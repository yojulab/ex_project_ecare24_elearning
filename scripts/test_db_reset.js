const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function main() {
  console.log('🚀 [RESET-RUNNER] Starting clean database reset and seed...');

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ecare24',
    user: process.env.DB_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
  });

  try {
    await client.connect();
    console.log('✅ Connected to Postgres.');

    console.log('💣 Cleaning public schema...');
    await client.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO ecare24_app;`);
    await client.query(`GRANT ALL ON SCHEMA public TO public;`);
    console.log('✅ Schema public recreated.');

    // DDL 실행
    const ddl1Path = path.join(__dirname, '../docs/architecture/ddl/01_master_schema.sql');
    const ddl2Path = path.join(__dirname, '../docs/architecture/ddl/02_auth_payment_admin_schema.sql');

    console.log('📄 Executing 01_master_schema.sql...');
    const ddl1 = fs.readFileSync(ddl1Path, 'utf8');
    await client.query(ddl1);
    console.log('✅ 01_master_schema.sql executed.');

    console.log('📄 Executing 02_auth_payment_admin_schema.sql...');
    const ddl2 = fs.readFileSync(ddl2Path, 'utf8');
    await client.query(ddl2);
    console.log('✅ 02_auth_payment_admin_schema.sql executed.');

    // SEED 데이터 로드
    const parsedTracks = require('../packages/utils/src/parsed_tracks.json');

    // 1. permissions
    const { SEED_PERMISSIONS } = require('../backend/src/database/seeds/data/permissions.data.ts'.replace('.ts', '')); // ts-node or parse ts
  } catch (err) {
    console.error('❌ Error during reset:', err);
  } finally {
    await client.end();
  }
}

main();
