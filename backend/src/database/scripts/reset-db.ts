import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { runInitDb } from './init-db';
import { runSeeds } from './seed-runner';

dotenv.config();

function getDbHost(): string {
  const host = process.env.DB_HOST || '127.0.0.1';
  return host === 'localhost' ? '127.0.0.1' : host;
}

async function connectWithRetry(client: Client, maxRetries = 5, delayMs = 1500): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.connect();
      return;
    } catch (err: any) {
      if (attempt === maxRetries || (err.code !== 'ECONNREFUSED' && err.code !== 'ETIMEDOUT')) {
        throw err;
      }
      console.log(`⏳ [DB] PostgreSQL 컨테이너 연결 대기 중... (${attempt}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function runResetDb() {
  if (process.env.NODE_ENV === 'production') {
    console.error('🛑 [DB:RESET] 운영 환경(NODE_ENV=production)에서는 데이터베이스를 리셋할 수 없습니다!');
    process.exit(1);
  }

  console.log('⚠️ [DB:RESET] 데이터베이스 전체 테이블 삭제 및 재생성 시작...');

  const client = new Client({
    host: getDbHost(),
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ecare24',
    user: process.env.DB_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
  });

  try {
    await connectWithRetry(client);

    // public 스키마 내 모든 테이블/타입 cascade drop
    console.log('💣 기존 public 스키마 초기화(DROP & CREATE SCHEMA public)...');
    await client.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO ecare24_app;`);
    await client.query(`GRANT ALL ON SCHEMA public TO public;`);
    console.log('✅ public 스키마 클린 초기화 완료.');
    await client.end();

    // DDL 초기화 및 시드 순차 실행
    await runInitDb();
    await runSeeds();

    console.log('🎉 [DB:RESET] 데이터베이스 리셋 및 초기 시드 완료!');
  } catch (error) {
    console.error('❌ [DB:RESET] 오류 발생:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runResetDb();
}
