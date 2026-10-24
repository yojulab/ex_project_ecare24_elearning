import * as fs from 'fs';
import * as path from 'path';
import { getAdminSchemaClient, loadBackendEnv, loadedEnvPath } from './db-client.helper';

// backend/.env 환경 변수 최우선 로드
loadBackendEnv();

export async function runInitDb() {
  console.log('🚀 [DB:INIT] eCare24 PostgreSQL 데이터베이스 스키마 초기화 시작...');
  console.log(`📁 [DB:INIT] 환경 변수 출처: ${loadedEnvPath}`);
  console.log(`🔑 [DB:INIT] 스키마 초기화 사용 계정: DB Admin (${process.env.DB_ADMIN_USER || 'admin'})`);

  try {
    // DB admin 정보(backend/.env:L15-L18)를 사용하여 schema 초기화 수행
    const { client, activeHost } = await getAdminSchemaClient();
    console.log(`✅ [DB:INIT] 관리자 권한으로 타겟 DB 연결 성공 (host: ${activeHost}, admin: ${process.env.DB_ADMIN_USER || 'admin'})`);

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
      console.log('   👉 npm run db:reset:force (또는 NODE_ENV=development npm run db:reset)\n');
      console.log('🎉 [DB:INIT] 데이터베이스 스키마 검증 완료 (기존 테이블 보존).');
      await client.end();
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

    // 앱 DB 접근 사용자(ecare24_app)에게 public 스키마 내 모든 권한 완벽 부여
    const targetUser = process.env.DB_USER || 'ecare24_app';
    const qUser = client.escapeIdentifier(targetUser);
    console.log(`🔐 [DB:INIT] 앱 계정('${targetUser}')에 테이블 및 스키마 권한 부여 중...`);
    await client.query(`GRANT USAGE, CREATE ON SCHEMA public TO ${qUser};`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${qUser};`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${qUser};`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ${qUser};`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${qUser};`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${qUser};`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${qUser};`);
    console.log(`✅ [DB:INIT] 앱 계정('${targetUser}') 권한 부여 완료.`);

    console.log('🎉 [DB:INIT] 모든 DDL 스키마가 성공적으로 초기화되었습니다!');
    await client.end();
  } catch (error) {
    console.error('❌ [DB:INIT] 스키마 초기화 중 오류 발생:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runInitDb();
}
