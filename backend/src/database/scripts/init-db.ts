import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

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

export async function runInitDb() {
  console.log('🚀 [DB:INIT] eCare24 PostgreSQL 데이터베이스 스키마 초기화 시작...');

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
    console.log('✅ PostgreSQL 연결 성공 (user: ' + (process.env.DB_USER || 'ecare24_app') + ')');

    const schema1Path = path.resolve(__dirname, '../../../../docs/architecture/ddl/01_master_schema.sql');
    const schema2Path = path.resolve(__dirname, '../../../../docs/architecture/ddl/02_auth_payment_admin_schema.sql');

    if (!fs.existsSync(schema1Path)) {
      throw new Error(`01_master_schema.sql 파일을 찾을 수 없습니다: ${schema1Path}`);
    }
    if (!fs.existsSync(schema2Path)) {
      throw new Error(`02_auth_payment_admin_schema.sql 파일을 찾을 수 없습니다: ${schema2Path}`);
    }

    const tableCheck = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users';"
    );
    if (tableCheck.rows.length > 0) {
      console.log('ℹ️  [DB:INIT] 이미 데이터베이스 테이블(users 등)이 존재합니다.');
      console.log('   스키마 전체를 새로 초기화하고 시드를 재주입하려면 아래 명령어를 실행하세요:');
      console.log('   👉 NODE_ENV=development npm run db:reset\n');
      console.log('🎉 [DB:INIT] 데이터베이스 스키마 검증 완료 (기존 테이블 보존).');
      return;
    }

    console.log('📄 [1/2] 01_master_schema.sql 적용 중...');
    const ddl1 = fs.readFileSync(schema1Path, 'utf8');
    await client.query(ddl1);
    console.log('✅ 01_master_schema.sql 적용 완료.');

    console.log('📄 [2/2] 02_auth_payment_admin_schema.sql 적용 중...');
    const ddl2 = fs.readFileSync(schema2Path, 'utf8');
    await client.query(ddl2);
    console.log('✅ 02_auth_payment_admin_schema.sql 적용 완료.');

    console.log('🎉 [DB:INIT] 모든 DDL 스키마가 성공적으로 초기화되었습니다!');
  } catch (error) {
    console.error('❌ [DB:INIT] 스키마 초기화 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runInitDb();
}
