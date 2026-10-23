import { Client, ClientConfig } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * DB 초기화 및 시드 스크립트 실행 시 backend/.env 파일을 최우선 로드합니다.
 */
export function loadBackendEnv(): string {
  const initialNodeEnv = process.env.NODE_ENV;
  const initialDbHost = process.env.DB_HOST;

  const candidates = [
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  let loaded = 'default';
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: true });
      loaded = envPath;
      break;
    }
  }

  if (loaded === 'default') {
    dotenv.config();
  }

  // CLI 등 상위 프로세스에서 명시적으로 전달된 값 우선 보존
  if (initialNodeEnv !== undefined) process.env.NODE_ENV = initialNodeEnv;
  if (initialDbHost !== undefined) process.env.DB_HOST = initialDbHost;

  return loaded;
}

export const loadedEnvPath = loadBackendEnv();

export interface DbConnectionResult {
  client: Client;
  activeHost: string;
  loadedEnvPath: string;
}

/**
 * 개발 환경 vs 운영 환경 여부 확인
 */
export function isProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.APP_ENV === 'production' ||
    Boolean(process.env.DOCKER_CONTAINER)
  );
}

/**
 * 운영/개발 환경에 맞춘 관리자(슈퍼유저) 자동 프로비저닝 함수
 * (운영 서버 성공 패턴 반영 및 개발/운영 명확한 구분)
 */
async function autoProvisionRoleAndDatabase(host: string, port: number): Promise<boolean> {
  const isProd = isProductionEnv();

  // 타겟 계정 정보 (.env 및 alias 지원)
  const targetUser = process.env.DB_USER || process.env.POSTGRES_USER || 'ecare24_app';
  const targetPassword = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'ecare24_secret_2026';
  const targetDb = process.env.DB_NAME || process.env.DB_DATABASE || process.env.POSTGRES_DB || 'ecare24';

  console.log(
    `감지된 .env 타겟 설정: { user: '${targetUser}', db: '${targetDb}' } [${
      isProd ? '운영(production)' : '개발(development)'
    }]`
  );

  // 개발 vs 운영 구분 슈퍼유저 후보군 구성
  const adminCandidates: { user: string; password: string; database: string; label: string }[] = [];

  const envAdminUser = process.env.DB_ADMIN_USER;
  const envAdminPass = process.env.DB_ADMIN_PASSWORD;
  const envAdminDb = process.env.DB_ADMIN_NAME;

  if (isProd) {
    // [운영 서버 우선순위]
    // 1) backend/.env 지정 값 또는 운영 컨테이너 기본 슈퍼유저 (admin / admin123 / db_graphrag_agent)
    adminCandidates.push({
      user: envAdminUser || 'admin',
      password: envAdminPass || 'admin123',
      database: envAdminDb || 'db_graphrag_agent',
      label: '운영 슈퍼유저 (external_project_db_postgres)',
    });
    // 2) 운영 admin 계정 + postgres DB
    adminCandidates.push({
      user: envAdminUser || 'admin',
      password: envAdminPass || 'admin123',
      database: 'postgres',
      label: '운영 관리자 (postgres DB)',
    });
    // 3) 표준 postgres 계정 fallback
    adminCandidates.push({
      user: 'postgres',
      password: envAdminPass || 'postgres',
      database: 'postgres',
      label: '표준 postgres 슈퍼유저',
    });
  } else {
    // [개발 환경 우선순위]
    // 1) 로컬 postgres 기본 슈퍼유저 (postgres / postgres / postgres)
    adminCandidates.push({
      user: envAdminUser || 'postgres',
      password: envAdminPass || 'postgres',
      database: envAdminDb || 'postgres',
      label: '로컬 개발 슈퍼유저 (postgres)',
    });
    // 2) backend/.env 지정 admin 계정
    adminCandidates.push({
      user: envAdminUser || 'admin',
      password: envAdminPass || 'admin123',
      database: envAdminDb || 'db_graphrag_agent',
      label: '개발 보조 슈퍼유저 (admin)',
    });
  }

  const adminFailures: string[] = [];

  for (const adminCfg of adminCandidates) {
    const adminClient = new Client({
      host,
      port,
      user: adminCfg.user,
      password: adminCfg.password,
      database: adminCfg.database,
      connectionTimeoutMillis: 3000,
    });

    try {
      await adminClient.connect();
    } catch (err: any) {
      adminFailures.push(
        `${adminCfg.user}@${host}/${adminCfg.database} (${adminCfg.label}) ➔ ${err.message} (code: ${
          err.code || 'UNKNOWN'
        })`
      );
      try {
        await adminClient.end();
      } catch (_) {}
      continue;
    }

    try {
      console.log(
        `🛠️ [DB 자동 프로비저닝] ${adminCfg.label} 접속 성공 (${adminCfg.user}@${host}/${adminCfg.database})`
      );

      // 1) 대상 ROLE(계정) 존재 여부 확인 및 생성/동기화 (사용자 성공 문장 양식 반영)
      const r = await adminClient.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [targetUser]);
      const qUser = adminClient.escapeIdentifier(targetUser);
      const lPass = adminClient.escapeLiteral(targetPassword);

      if (r.rowCount === 0) {
        await adminClient.query(`CREATE ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
        console.log(`✅ 계정 생성 완료: ${targetUser}`);
      } else {
        await adminClient.query(`ALTER ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
        console.log(`✅ 계정 비밀번호 및 권한 동기화 완료: ${targetUser}`);
      }

      // 2) 대상 DATABASE 존재 여부 확인 및 생성 (사용자 성공 문장 양식 반영)
      const dbRes = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
      if (dbRes.rowCount === 0) {
        await adminClient.query(`CREATE DATABASE ${adminClient.escapeIdentifier(targetDb)} OWNER ${qUser}`);
        console.log(`✅ 데이터베이스 생성 완료: ${targetDb}`);
      } else {
        console.log(`ℹ️  데이터베이스 이미 존재: ${targetDb}`);
      }

      await adminClient.end();

      // 3) Apache AGE 확장 활성화 (선택적)
      try {
        const dbAdminClient = new Client({
          host,
          port,
          user: adminCfg.user,
          password: adminCfg.password,
          database: targetDb,
          connectionTimeoutMillis: 3000,
        });
        await dbAdminClient.connect();
        await dbAdminClient.query(`CREATE EXTENSION IF NOT EXISTS age;`).catch(() => {});
        await dbAdminClient.end();
      } catch (_) {}

      console.log(`🎉 [DB 자동 프로비저닝] '${targetUser}' 계정 및 '${targetDb}' 데이터베이스 준비 완료!`);
      return true;
    } catch (err: any) {
      adminFailures.push(`${adminCfg.user}@${host}/${adminCfg.database} 프로비저닝 실행 실패: ${err.message}`);
      try {
        await adminClient.end();
      } catch (_) {}
    }
  }

  console.error(`❌ [DB 자동 프로비저닝 실패] host='${host}' 대상 슈퍼유저 접속/프로비저닝 불가:`);
  adminFailures.forEach((f) => console.error(`     - ${f}`));
  console.error(
    `   👉 운영 슈퍼유저 정보가 다르면 backend/.env 의 DB_ADMIN_USER / DB_ADMIN_PASSWORD / DB_ADMIN_NAME 을 실제 값으로 수정하세요.\n` +
      `      (generate_env.sh 실행 시: DB_ADMIN_PASSWORD='실제비번' bash generate_env.sh)`
  );
  return false;
}

/**
 * 환경에 따라 작동 가능한 PostgreSQL 호스트를 자동 탐색하여 연결된 Client를 반환합니다.
 * 에러 착시를 방지하기 위해 각 호스트별 접속 시도 및 실패 사유를 상세히 로깅하며,
 * 계정/DB 부재 시 자동 프로비저닝(Auto-Provisioning)을 수행합니다.
 */
export async function getConnectedClient(
  overrideConfig: Partial<ClientConfig> = {},
  maxRetriesPerHost = 2,
  delayMs = 1000
): Promise<DbConnectionResult> {
  const isProd = isProductionEnv();
  const envHost = process.env.DB_HOST;

  // 개발 vs 운영 구분 호스트 탐색 목록
  let rawHosts: string[];
  if (isProd) {
    // [운영 서버 우선순위]
    // 1) DB_HOST 환경 변수
    // 2) 도커 컨테이너 이름 (external_project_db_postgres)
    // 3) 도커 브리지 IP (172.20.0.4)
    // 4) 로컬 루프백 (127.0.0.1)
    rawHosts = [
      envHost,
      'external_project_db_postgres',
      '172.20.0.4',
      '127.0.0.1',
      'localhost',
      'host.docker.internal',
      '172.17.0.1',
      '172.20.0.1',
      '172.18.0.1',
    ].filter(Boolean) as string[];
    console.log(`🌐 [운영 환경 DB 감지 (production)] 호스트 탐색 목록: [${rawHosts.join(', ')}]`);
  } else {
    // [개발 환경 우선순위]
    // 1) DB_HOST 환경 변수
    // 2) 로컬 루프백 (127.0.0.1 / localhost)
    // 3) Docker Desktop 게이트웨이 (host.docker.internal)
    // 4) 컨테이너 이름 (fallback)
    rawHosts = [
      envHost,
      '127.0.0.1',
      'localhost',
      'host.docker.internal',
      'external_project_db_postgres',
      '172.17.0.1',
      '172.20.0.1',
    ].filter(Boolean) as string[];
    console.log(`💻 [개발 환경 DB 감지 (development)] 호스트 탐색 목록: [${rawHosts.join(', ')}]`);
  }

  // 중복 제거 및 'localhost' -> '127.0.0.1' 정규화
  const candidates: string[] = [];
  for (const h of rawHosts) {
    const normalized = h === 'localhost' ? '127.0.0.1' : h;
    if (!candidates.includes(normalized)) {
      candidates.push(normalized);
    }
  }

  const baseConfig: ClientConfig = {
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || process.env.DB_DATABASE || process.env.POSTGRES_DB || 'ecare24',
    user: process.env.DB_USER || process.env.POSTGRES_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
    connectionTimeoutMillis: 3000,
    ...overrideConfig,
  };

  const attemptErrors: { host: string; message: string; code?: string }[] = [];
  const reachableHosts: string[] = [];

  for (const host of candidates) {
    let reachableButDenied = false;

    for (let attempt = 1; attempt <= maxRetriesPerHost; attempt++) {
      const client = new Client({
        ...baseConfig,
        host,
      });

      try {
        await client.connect();
        return { client, activeHost: host, loadedEnvPath };
      } catch (err: any) {
        try {
          await client.end();
        } catch (_) {}

        const errCode = err.code || 'UNKNOWN';
        attemptErrors.push({ host, message: err.message, code: errCode });

        // 28000(계정 부재) / 28P01(비밀번호 불일치 — 계정 부재 시에도 동일 코드 반환) / 3D000(DB 부재)
        // ➔ 네트워크는 이미 정상 도달한 것이므로 재시도 없이 즉시 프로비저닝 단계로 이동
        if (errCode === '28000' || errCode === '28P01' || errCode === '3D000') {
          console.warn(
            `⚠️  [DB 접속 감지] host='${host}' 네트워크 도달 성공, 그러나 접속 거부: ${err.message} (code: ${errCode})\n` +
              `     (계정 '${baseConfig.user}' 부재 / 비밀번호 불일치 / DB '${baseConfig.database}' 부재 중 하나)`
          );
          reachableButDenied = true;
          break;
        }

        if (attempt < maxRetriesPerHost) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
    }

    if (reachableButDenied) {
      reachableHosts.push(host);
      console.log(
        `💡 [DB 자동 복구] host='${host}' 관리자 계정으로 '${baseConfig.user}' 계정 및 '${baseConfig.database}' DB 생성/동기화를 시도합니다...`
      );
      const provisioned = await autoProvisionRoleAndDatabase(host, Number(baseConfig.port));
      if (provisioned) {
        const retryClient = new Client({ ...baseConfig, host });
        try {
          await retryClient.connect();
          console.log(`✅ [DB 연결 성공] '${host}'에서 '${baseConfig.user}' 계정으로 연결되었습니다.`);
          return { client: retryClient, activeHost: host, loadedEnvPath };
        } catch (retryErr: any) {
          attemptErrors.push({ host, message: `프로비저닝 후 재접속 실패: ${retryErr.message}`, code: retryErr.code });
          try {
            await retryClient.end();
          } catch (_) {}
        }
      }
    }
  }

  // 모든 후보 실패 시 실패 상세 목록을 명확히 리포트 (에러 착시 완전 제거)
  const errorDetails = attemptErrors
    .map((e, idx) => `   [${idx + 1}] host: ${e.host} ➔ ${e.message} (code: ${e.code})`)
    .join('\n');

  throw new Error(
    `❌ PostgreSQL 연결 실패: 탐색한 호스트 후보에 모두 접속할 수 없습니다.\n` +
      `-----------------------------------------------------------------\n` +
      `[각 호스트별 시도 결과 상세 - 에러 착시 방지]\n${errorDetails}\n` +
      `-----------------------------------------------------------------\n` +
      `💡 해결 가이드:\n` +
      `  1) 네트워크 오류(ECONNREFUSED/ETIMEDOUT)인 경우: docker ps로 DB 컨테이너 상태를 확인하세요.\n` +
      `  2) 인증 오류(28000/28P01)인 경우: backend/.env의 DB_USER/DB_PASSWORD가 실제 DB 설정과 일치하는지 확인하세요.\n` +
      `  3) 운영 슈퍼유저 계정이 다를 경우 backend/.env에 DB_ADMIN_USER, DB_ADMIN_PASSWORD를 지정하면 자동 프로비저닝됩니다.`
  );
}
