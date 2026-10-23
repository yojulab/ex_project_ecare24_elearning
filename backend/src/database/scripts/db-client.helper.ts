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
 * 운영/개발 환경에서 ecare24_app 계정이나 ecare24 데이터베이스가 없을 때,
 * 슈퍼유저(admin 또는 postgres)로 자동 접속하여 전용 계정과 데이터베이스를 생성(프로비저닝)합니다.
 */
async function autoProvisionRoleAndDatabase(host: string, port: number): Promise<boolean> {
  const targetUser = process.env.DB_USER || 'ecare24_app';
  const targetPassword = process.env.DB_PASSWORD || 'ecare24_secret_2026';
  const targetDb = process.env.DB_NAME || 'ecare24';

  // 슈퍼유저 후보군 (운영: admin/admin123 on db_graphrag_agent 또는 postgres, 개발: postgres/postgres on postgres)
  const adminCandidates = [
    {
      user: process.env.DB_ADMIN_USER || 'admin',
      password: process.env.DB_ADMIN_PASSWORD || 'admin123',
      database: process.env.DB_ADMIN_NAME || 'db_graphrag_agent',
    },
    {
      user: 'admin',
      password: process.env.DB_ADMIN_PASSWORD || 'admin123',
      database: 'postgres',
    },
    {
      user: 'postgres',
      password: process.env.DB_ADMIN_PASSWORD || 'postgres',
      database: 'postgres',
    },
  ];

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
      console.log(`🛠️ [DB 자동 프로비저닝] 관리자 계정(${adminCfg.user}@${host}/${adminCfg.database}) 접속 성공.`);

      // 1) 대상 ROLE(계정) 존재 여부 확인 및 생성/권한 부여
      console.log(`🛠️ [DB 자동 프로비저닝] 계정 '${targetUser}' 생성/권한 갱신 중...`);
      await adminClient.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${targetUser}') THEN
            CREATE ROLE ${targetUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD '${targetPassword}';
          ELSE
            ALTER ROLE ${targetUser} WITH LOGIN SUPERUSER CREATEDB PASSWORD '${targetPassword}';
          END IF;
        END
        $$;
      `);

      // 2) 대상 DATABASE 존재 여부 확인 및 생성
      const dbCheck = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [targetDb]
      );
      if (dbCheck.rows.length === 0) {
        console.log(`🛠️ [DB 자동 프로비저닝] 데이터베이스 '${targetDb}' 생성 중 (소유자: ${targetUser})...`);
        await adminClient.query(`CREATE DATABASE "${targetDb}" OWNER "${targetUser}"`);
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
      try {
        await adminClient.end();
      } catch (_) {}
      // 다음 슈퍼유저 후보 시도
    }
  }

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

  for (const host of candidates) {
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

        // 계정 부재(28000) 또는 DB 부재(3D000)인 경우 네트워크는 이미 정상 도달한 것임!
        // 에러 착시 방지를 위해 화면에 명확히 출력하고 자동 프로비저닝 시도
        if (errCode === '28000' || errCode === '3D000') {
          console.warn(
            `⚠️  [DB 접속 감지] host='${host}'에 네트워크 도달 성공했으나 계정/DB 없음: ${err.message} (code: ${errCode})`
          );
          console.log(`💡 [DB 자동 복구] 관리자 계정으로 '${baseConfig.user}' 계정 및 '${baseConfig.database}' DB 생성을 시도합니다...`);

          const provisioned = await autoProvisionRoleAndDatabase(host, Number(baseConfig.port));
          if (provisioned) {
            // 프로비저닝 성공 후 재연결 시도
            const retryClient = new Client({
              ...baseConfig,
              host,
            });
            try {
              await retryClient.connect();
              console.log(`✅ [DB 연결 성공] '${host}'에서 '${baseConfig.user}' 계정으로 연결되었습니다.`);
              return { client: retryClient, activeHost: host, loadedEnvPath };
            } catch (retryErr: any) {
              try {
                await retryClient.end();
              } catch (_) {}
            }
          }
        } else if (errCode === '28P01') {
          console.warn(
            `⚠️  [DB 인증 실패] host='${host}' (user: ${baseConfig.user}): 비밀번호가 일치하지 않습니다. (code: 28P01)`
          );
        }

        if (attempt < maxRetriesPerHost) {
          await new Promise((r) => setTimeout(r, delayMs));
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
