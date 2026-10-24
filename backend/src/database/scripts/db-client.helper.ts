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
 * 개발/운영 환경에 따른 PostgreSQL 호스트 탐색 후보군 반환
 * - 개발 환경: graphrag_agent_db_postgres (1순위)
 * - 운영 환경: external_project_db_postgres (1순위)
 */
export function getHostCandidates(): string[] {
  const isProd = isProductionEnv();
  const envHost = process.env.DB_HOST;

  let rawHosts: string[];
  if (isProd) {
    // [운영 서버 우선순위]
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
  } else {
    // [개발 환경 우선순위]
    rawHosts = [
      envHost,
      'graphrag_agent_db_postgres',
      '127.0.0.1',
      'localhost',
      'host.docker.internal',
      '172.22.0.4',
      '172.17.0.1',
      '172.20.0.1',
    ].filter(Boolean) as string[];
  }

  // 중복 제거 및 'localhost' -> '127.0.0.1' 정규화
  const candidates: string[] = [];
  for (const h of rawHosts) {
    const normalized = h === 'localhost' ? '127.0.0.1' : h;
    if (!candidates.includes(normalized)) {
      candidates.push(normalized);
    }
  }
  return candidates;
}

/**
 * [1] DB Admin 연결 클라이언트 획득 (schema 초기화 및 프로비저닝 전용)
 * - backend/.env:L15-L18 설정(DB_ADMIN_USER, DB_ADMIN_PASSWORD, DB_ADMIN_NAME)을 사용합니다.
 * - targetDatabase를 지정하면 해당 데이터베이스에 관리자 권한으로 접속합니다.
 */
export async function getAdminClient(
  targetDatabase?: string,
  overrideHost?: string
): Promise<DbConnectionResult> {
  const isProd = isProductionEnv();
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const hosts = overrideHost ? [overrideHost] : getHostCandidates();

  const envAdminUser = process.env.DB_ADMIN_USER || 'admin';
  const envAdminPass = process.env.DB_ADMIN_PASSWORD || 'admin123';
  const envAdminDb = process.env.DB_ADMIN_NAME || 'db_graphrag_agent';

  // 관리자 후보군 (backend/.env 설정을 최우선 적용)
  const adminCandidates = [
    {
      user: envAdminUser,
      password: envAdminPass,
      database: targetDatabase || envAdminDb,
      label: `backend/.env 지정 관리자 (${envAdminUser}@${targetDatabase || envAdminDb})`,
    },
    {
      user: envAdminUser,
      password: envAdminPass,
      database: targetDatabase || 'postgres',
      label: `관리자 fallback (${envAdminUser}@${targetDatabase || 'postgres'})`,
    },
    {
      user: 'postgres',
      password: envAdminPass,
      database: targetDatabase || 'postgres',
      label: `표준 postgres 슈퍼유저 (postgres@${targetDatabase || 'postgres'})`,
    },
    {
      user: 'postgres',
      password: 'postgres',
      database: targetDatabase || 'postgres',
      label: '로컬 postgres 기본값 (postgres@postgres)',
    },
  ];

  const errors: string[] = [];

  for (const host of hosts) {
    for (const cand of adminCandidates) {
      const client = new Client({
        host,
        port,
        user: cand.user,
        password: cand.password,
        database: cand.database,
        ssl: process.env.DB_SSL === 'true',
        connectionTimeoutMillis: 3000,
      });

      try {
        await client.connect();
        return { client, activeHost: host, loadedEnvPath };
      } catch (err: any) {
        errors.push(`${cand.user}@${host}/${cand.database} ➔ ${err.message} (code: ${err.code || 'UNKNOWN'})`);
        try {
          await client.end();
        } catch (_) {}
      }
    }
  }

  throw new Error(
    `❌ [DB Admin 연결 실패] 관리자 슈퍼유저로 PostgreSQL에 접속할 수 없습니다.\n` +
      `   시도 호스트: [${hosts.join(', ')}]\n` +
      `   상세 실패 내역:\n` +
      errors.map((e) => `     - ${e}`).join('\n') +
      `\n   👉 backend/.env 의 DB_ADMIN_USER / DB_ADMIN_PASSWORD / DB_ADMIN_NAME 을 확인하세요.`
  );
}

/**
 * 타겟 역할(Role) 및 데이터베이스(Database) 자동 프로비저닝
 * - 관리자 계정으로 접속하여 ecare24_app 및 ecare24 DB를 생성하고 권한을 부여합니다.
 */
export async function ensureRoleAndDatabase(activeHost?: string): Promise<{ activeHost: string }> {
  const isProd = isProductionEnv();
  const targetUser = process.env.DB_USER || 'ecare24_app';
  const targetPassword = process.env.DB_PASSWORD || 'ecare24_secret_2026';
  const targetDb = process.env.DB_NAME || 'ecare24';

  console.log(
    `🛠️ [DB 프로비저닝] 관리자 계정으로 앱 DB 및 계정 검증/생성 시작... ` +
      `[user: '${targetUser}', db: '${targetDb}', mode: ${isProd ? '운영' : '개발'}]`
  );

  const { client: adminClient, activeHost: host } = await getAdminClient(undefined, activeHost);

  try {
    const qUser = adminClient.escapeIdentifier(targetUser);
    const lPass = adminClient.escapeLiteral(targetPassword);

    // 1) 대상 ROLE(계정) 존재 여부 확인 및 생성/동기화
    const roleCheck = await adminClient.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [targetUser]);
    if (roleCheck.rowCount === 0) {
      await adminClient.query(`CREATE ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
      console.log(`✅ [DB 프로비저닝] 계정 생성 완료: ${targetUser}`);
    } else {
      await adminClient.query(`ALTER ROLE ${qUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD ${lPass}`);
      console.log(`✅ [DB 프로비저닝] 계정 비밀번호 및 권한 동기화 완료: ${targetUser}`);
    }

    // 2) 대상 DATABASE 존재 여부 확인 및 생성
    const dbCheck = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
    if (dbCheck.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE ${adminClient.escapeIdentifier(targetDb)} OWNER ${qUser}`);
      console.log(`✅ [DB 프로비저닝] 데이터베이스 생성 완료: ${targetDb}`);
    } else {
      console.log(`ℹ️  [DB 프로비저닝] 데이터베이스 이미 존재: ${targetDb}`);
    }

    // 3) 데이터베이스 권한 부여
    await adminClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${adminClient.escapeIdentifier(targetDb)} TO ${qUser}`);

    await adminClient.end();

    // 4) 타겟 DB에 관리자로 접속하여 확장(Extension) 활성화
    try {
      const { client: dbAdminClient } = await getAdminClient(targetDb, host);
      await dbAdminClient.query(`CREATE EXTENSION IF NOT EXISTS age;`).catch(() => {});
      await dbAdminClient.end();
    } catch (_) {}

    console.log(`🎉 [DB 프로비저닝] '${targetUser}' 계정 및 '${targetDb}' 데이터베이스 준비 완료! (host: ${host})`);
    return { activeHost: host };
  } catch (err: any) {
    try {
      await adminClient.end();
    } catch (_) {}
    throw new Error(`❌ [DB 프로비저닝 실패] ${err.message}`);
  }
}

/**
 * [2] Schema 초기화용 DB Admin 클라이언트 획득
 * - DB admin 정보를 사용하여 타겟 데이터베이스(ecare24)에 직접 관리자 권한으로 연결합니다.
 * - 타겟 DB나 계정이 없으면 자동으로 프로비저닝 후 연결합니다.
 * - init-db.ts 및 reset-db.ts에서 DDL 실행, public 스키마 생성/삭제, 권한 부여에 사용됩니다.
 */
export async function getAdminSchemaClient(): Promise<DbConnectionResult> {
  const targetDb = process.env.DB_NAME || 'ecare24';

  // 1) 계정 및 데이터베이스 존재 보장 (자동 프로비저닝)
  const { activeHost } = await ensureRoleAndDatabase();

  // 2) 타겟 데이터베이스에 관리자 권한으로 연결
  console.log(`🔑 [DB:SCHEMA-CLIENT] 타겟 DB('${targetDb}')에 DB admin 권한으로 연결 중... (host: ${activeHost})`);
  const adminDbRes = await getAdminClient(targetDb, activeHost);
  return adminDbRes;
}

/**
 * [3] 앱 DB 접근용 클라이언트 획득 (데이터 접근 전용)
 * - backend/.env:L7-L13 설정(DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)을 사용합니다.
 * - NestJS TypeORM, seed-runner.ts, 데이터 모니터링 등 일반 비즈니스 데이터 접근에 사용됩니다.
 * - 계정/DB가 없거나 비밀번호 불일치 시 자동으로 관리자 프로비저닝을 수행한 후 재접속합니다.
 */
export async function getConnectedClient(
  overrideConfig: Partial<ClientConfig> = {},
  maxRetriesPerHost = 2,
  delayMs = 1000
): Promise<DbConnectionResult> {
  const isProd = isProductionEnv();
  const hosts = getHostCandidates();

  console.log(
    isProd
      ? `🌐 [운영 환경 DB 감지 (production)] 호스트 탐색 목록: [${hosts.join(', ')}]`
      : `💻 [개발 환경 DB 감지 (development)] 호스트 탐색 목록: [${hosts.join(', ')}]`
  );

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

  for (const host of hosts) {
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

        // 28000(계정 부재), 28P01(비밀번호 불일치/계정부재), 3D000(DB 부재)
        // ➔ 네트워크 도달 성공, 인증/권한 문제이므로 관리자 프로비저닝 시도
        if (errCode === '28000' || errCode === '28P01' || errCode === '3D000') {
          console.warn(
            `⚠️  [DB 접속 감지] host='${host}' 네트워크 도달 성공, 인증/DB 부재 감지: ${err.message} (code: ${errCode})\n` +
              `     관리자 계정으로 자동 프로비저닝을 시작합니다...`
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
      try {
        await ensureRoleAndDatabase(host);
        const retryClient = new Client({ ...baseConfig, host });
        await retryClient.connect();
        console.log(`✅ [DB 연결 성공] '${host}'에서 앱 계정('${baseConfig.user}')으로 연결되었습니다.`);
        return { client: retryClient, activeHost: host, loadedEnvPath };
      } catch (provisionErr: any) {
        attemptErrors.push({
          host,
          message: `프로비저닝 후 재접속 실패: ${provisionErr.message}`,
          code: provisionErr.code,
        });
      }
    }
  }

  // 모든 후보 실패 시 실패 상세 목록 리포트
  const errorDetails = attemptErrors
    .map((e, idx) => `   [${idx + 1}] host: ${e.host} ➔ ${e.message} (code: ${e.code})`)
    .join('\n');

  throw new Error(
    `❌ PostgreSQL 연결 실패: 탐색한 호스트 후보에 모두 접속할 수 없습니다.\n` +
      `-----------------------------------------------------------------\n` +
      `[각 호스트별 시도 결과 상세]\n${errorDetails}\n` +
      `-----------------------------------------------------------------\n` +
      `💡 해결 가이드:\n` +
      `  1) 개발 docker container 호스트: graphrag_agent_db_postgres\n` +
      `  2) 운영 docker container 호스트: external_project_db_postgres\n` +
      `  3) backend/.env의 DB_ADMIN_USER, DB_ADMIN_PASSWORD, DB_ADMIN_NAME이 올바른지 확인하세요.`
  );
}
