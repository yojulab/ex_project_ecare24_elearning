import { Client, ClientConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export interface DbConnectionResult {
  client: Client;
  activeHost: string;
}

/**
 * 환경에 따라 작동 가능한 PostgreSQL 호스트를 자동 탐색하여 연결된 Client를 반환합니다.
 * 탐색 순서:
 *  1) process.env.DB_HOST (환경 변수 우선)
 *  2) external_project_db_postgres (도커 컨테이너명)
 *  3) 127.0.0.1 (IPv4 로컬 루프백)
 *  4) host.docker.internal (Docker Desktop / 호스트 게이트웨이)
 *  5) 172.17.0.1 (리눅스 Docker 기본 브리지 게이트웨이)
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
    '127.0.0.1',
    'host.docker.internal',
    '172.17.0.1',
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

  let lastError: any = null;

  for (const host of candidates) {
    for (let attempt = 1; attempt <= maxRetriesPerHost; attempt++) {
      // 매 시도마다 항상 새로운 Client 인스턴스를 생성 (reuse client 에러 원천 방지)
      const client = new Client({
        ...baseConfig,
        host,
      });

      try {
        await client.connect();
        return { client, activeHost: host };
      } catch (err: any) {
        lastError = err;
        try {
          await client.end();
        } catch (_) {}

        if (attempt < maxRetriesPerHost) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
    }
  }

  throw new Error(
    `❌ PostgreSQL 연결 실패: 탐색한 호스트 [${candidates.join(', ')}] 모두 접속할 수 없습니다.\n` +
      `   마지막 오류: ${lastError?.message || lastError}\n` +
      `   Docker 컨테이너가 실행 중인지 확인해 주십시오: docker ps | grep external_project_db_postgres`
  );
}
