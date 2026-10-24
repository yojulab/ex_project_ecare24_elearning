import { runInitDb } from './init-db';
import { runSeeds } from './seed-runner';
import { getAdminSchemaClient, loadBackendEnv, loadedEnvPath } from './db-client.helper';

// CLI 인자 및 사전 실행 환경 변수 보존
const initialNodeEnv = process.env.NODE_ENV;
const initialForceReset = process.env.FORCE_RESET;

// backend/.env 환경 변수 최우선 로드
loadBackendEnv();

if (initialNodeEnv !== undefined) process.env.NODE_ENV = initialNodeEnv;
if (initialForceReset !== undefined) process.env.FORCE_RESET = initialForceReset;

export async function runResetDb() {
  const isForce = process.argv.includes('--force') || process.env.FORCE_RESET === 'true';
  if (process.env.NODE_ENV === 'production' && !isForce) {
    console.error('🛑 [DB:RESET] 운영 환경(NODE_ENV=production)에서는 데이터베이스를 리셋할 수 없습니다!');
    console.error('   운영 환경에서 강제로 초기화하려면 아래 중 하나를 실행해 주십시오:');
    console.error('   👉 npm run db:reset:force');
    console.error('   👉 FORCE_RESET=true npm run db:reset');
    console.error('   👉 NODE_ENV=development npm run db:reset');
    process.exit(1);
  }

  console.log('⚠️ [DB:RESET] 데이터베이스 전체 테이블 삭제 및 재생성 시작...');
  console.log(`📁 [DB:RESET] 환경 변수 출처: ${loadedEnvPath}`);
  console.log(`🔑 [DB:RESET] 스키마 리셋 사용 계정: DB Admin (${process.env.DB_ADMIN_USER || 'admin'})`);

  try {
    // 1. DB admin 정보(backend/.env:L15-L18)를 사용하여 public 스키마 클린 리셋
    const { client, activeHost } = await getAdminSchemaClient();
    console.log(`✅ [DB:RESET] 관리자 권한으로 타겟 DB 연결 성공 (host: ${activeHost})`);

    const targetUser = process.env.DB_USER || 'ecare24_app';
    const qUser = client.escapeIdentifier(targetUser);

    console.log('💣 기존 public 스키마 초기화(DROP & CREATE SCHEMA public)...');
    await client.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO ${qUser};`);
    await client.query(`GRANT ALL ON SCHEMA public TO public;`);
    console.log(`✅ public 스키마 클린 초기화 및 '${targetUser}' 권한 부여 완료.`);
    await client.end();

    // 2. DDL 스키마 초기화 실행 (DB admin 정보 사용)
    await runInitDb();

    // 3. 비즈니스 기준 및 운영 시드 데이터 순차 주입 (앱 DB 접근 정보 사용)
    console.log(`🌱 [DB:RESET] 앱 DB 접근 계정('${targetUser}')으로 기준 데이터 시드 주입 시작...`);
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
