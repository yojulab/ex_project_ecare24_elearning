import { Client, ClientConfig } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * DB 초기화 및 시드 스크립트 실행 시 backend/.env 파일을 최우선 로드합니다.
 */
export function loadBackendEnv(): string {
  const candidates = [
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: true });
      return envPath;
    }
  }

  dotenv.config();
  return process.cwd();
}

export const loadedEnvPath = loadBackendEnv();

export interface DbConnectionResult {
  client: Client;
  activeHost: string;
  loadedEnvPath: string;
}

/**
 * 운영/개발 환경에서 ecare24_app 계정(없음 또는 비밀번호 불일치)이나 ecare24 데이터베이스가 없을 때,
 * 슈퍼유저(admin 또는 postgres)로 자동 접속하여 전용 계정과 데이터베이스를 생성/갱신(프로비저닝)합니다.
 *
 * ※ PostgreSQL(scram/md5 인증)은 존재하지 않는 계정에 대해서도 28P01(비밀번호 불일치)을 반환하므로
 *   28P01 역시 프로비저닝 트리거 대상입니다.
 */
async function autoProvisionRoleAndDatabase(host: string, port: number): Promise<boolean> {
  const targetUser = process.env.DB_USER || 'ecare24_app';
  const targetPassword = process.env.DB_PASSWORD || 'ecare24_secret_2026';
  const targetDb = process.env.DB_NAME || 'ecare24';

  // 슈퍼유저 후보군 (backend/.env 의 DB_ADMIN_* 최우선, 이후 일반적인 기본값 순차 시도)
  const adminCandidates: { user: string; password: string; database: string }[] = [];
  const pushCandidate = (user: string, password: string, database: string) => {
    if (!adminCandidates.some((c) => c.user === user && c.password === password && c.database === database)) {
      adminCandidates.push({ user, password, database });
    }
  };
  const envAdminUser = process.env.DB_ADMIN_USER || 'admin';
  const envAdminPass = process.env.DB_ADMIN_PASSWORD || 'admin123';
  const envAdminDb = process.env.DB_ADMIN_NAME || 'db_graphrag_agent';
  pushCandidate(envAdminUser, envAdminPass, envAdminDb);
  pushCandidate(envAdminUser, envAdminPass, 'postgres');
  pushCandidate('postgres', process.env.DB_ADMIN_PASSWORD || 'postgres', 'postgres');

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
      adminFailures.push(`${adminCfg.user}@${host}/${adminCfg.database} ➔ ${err.message} (code: ${err.code || 'UNKNOWN'})`);
      try {
        await adminClient.end();
      } catch (_) {}
      continue;
    }

    try {
      console.log(`🛠️ [DB 자동 프로비저닝] 관리자 계정(${adminCfg.user}@${host}/${adminCfg.database}) 접속 성공.`);

      // 1) 대상 ROLE(계정) 생성 또는 비밀번호/권한 갱신 (리터럴·식별자 안전 이스케이프)
      const qUser = adminClient.escapeIdentifier(targetUser);
      const lUser = adminClient.escapeLiteral(targetUser);
      const lPass = adminClient.escapeLiteral(targetPassword);
      const roleCheck = await adminClient.query(`SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = ${lUser}`);
      if (roleCheck.rows.length === 0) {
        console.log(`🛠️ [DB 자동 프로비저닝] 계정 '${targetUser}' 신규 생성 중...`);
        await adminClient.query(`CREATE ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
      } else {
        console.log(`🛠️ [DB 자동 프로비저닝] 계정 '${targetUser}' 이미 존재 ➔ 비밀번호/권한 동기화 중...`);
        await adminClient.query(`ALTER ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
      }

      // 2) 대상 DATABASE 존재 여부 확인 및 생성
      const dbCheck = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDb]);
      if (dbCheck.rows.length === 0) {
        console.log(`🛠️ [DB 자동 프로비저닝] 데이터베이스 '${targetDb}' 생성 중 (소유자: ${targetUser})...`);
        await adminClient.query(`CREATE DATABASE ${adminClient.escapeIdentifier(targetDb)} OWNER ${qUser}`);
      } else {
        console.log(`ℹ️  [DB 자동 프로비저닝] 데이터베이스 '${targetDb}'가 이미 존재합니다.`);
      }

      await adminClient.end();

      // 3) 생성된 DB에 Apache AGE 확장 활성화 (선택적)
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
      adminFailures.push(`${adminCfg.user}@${host}/${adminCfg.database} 프로비저닝 쿼리 실패 ➔ ${err.message}`);
      try {
        await adminClient.end();
      } catch (_) {}
    }
  }

  console.error(`❌ [DB 자동 프로비저닝] host='${host}' 관리자 계정 접속/프로비저닝 실패 상세:`);
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
  const envHost = process.env.DB_HOST;
  const rawHosts = [
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
    database: process.env.DB_NAME || 'ecare24',
    user: process.env.DB_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
    connectionTimeoutMillis: 3000,
    ...overrideConfig,
  };

  const attemptErrors: { host: string; message: string; code?: string }[] = [];
  // 네트워크 도달은 성공했으나 계정/DB/비밀번호 문제로 실패한 호스트 (프로비저닝 대상, 호스트당 1회)
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
