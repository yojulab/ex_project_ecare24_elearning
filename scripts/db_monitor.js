#!/usr/bin/env node
/**
 * eCare24 PostgreSQL 실시간 DB 모니터링 도구
 * - 각 단계별 실제 데이터 입력 및 수정(INSERT / UPDATE) 시 DB 상태 변화를 실시간으로 모니터링
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const SNAPSHOT_FILE = path.join(__dirname, '.db_snapshot.json');

const dbConfig = {
  host: process.env.DB_HOST || 'graphrag_agent_db_postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'ecare24',
  user: process.env.DB_USER || 'ecare24_app',
  password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
};

async function getClient() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

async function getDbStatus(client) {
  const tables = [
    'users',
    'courses',
    'course_enrollments',
    'payments',
    'certificates',
    'cert_applications',
    'inquiries',
    'popup_notices',
    'notices',
    'counseling_tickets',
    'user_permissions',
  ];

  const counts = {};
  for (const t of tables) {
    const res = await client.query(`SELECT count(*) FROM "${t}"`);
    counts[t] = parseInt(res.rows[0].count, 10);
  }

  // 핵심 레코드 상세
  const recentPayments = (
    await client.query(`
      SELECT p.id, p.order_no, u.login_id, p.amount, p.status, p.paid_at, p.created_at
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC LIMIT 5
    `)
  ).rows;

  const recentEnrollments = (
    await client.query(`
      SELECT e.id, u.login_id, c.title as course_title, e.status, e.enrolled_at
      FROM course_enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.created_at DESC LIMIT 5
    `)
  ).rows;

  const recentInquiries = (
    await client.query(`
      SELECT i.id, u.login_id, i.category, i.title, i.status, i.answer, i.created_at
      FROM inquiries i
      JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC LIMIT 5
    `)
  ).rows;

  const recentPopups = (
    await client.query(`
      SELECT id, title, priority, is_active, starts_at, ends_at, created_at
      FROM popup_notices
      ORDER BY priority DESC, created_at DESC LIMIT 5
    `)
  ).rows;

  return {
    timestamp: new Date().toISOString(),
    counts,
    recentPayments,
    recentEnrollments,
    recentInquiries,
    recentPopups,
  };
}

async function showStatus() {
  const client = await getClient();
  try {
    const status = await getDbStatus(client);
    console.log('=================================================================');
    console.log(` 📊 eCare24 PostgreSQL 실시간 DB 모니터링 [${status.timestamp}]`);
    console.log('=================================================================');
    console.log('📋 테이블별 레코드 수:');
    for (const [tbl, count] of Object.entries(status.counts)) {
      console.log(`  • ${tbl.padEnd(22)} : ${count.toString().padStart(4)} 건`);
    }

    console.log('\n💳 최근 결제/납부 내역 (최대 5건):');
    for (const p of status.recentPayments) {
      console.log(`  [${p.status.padEnd(7)}] ${p.order_no} | 학생: ${p.login_id} | ${p.amount.toLocaleString()}원 | ${p.paid_at ? '결제완료: ' + p.paid_at.toISOString().slice(0, 16) : '입금대기'}`);
    }

    console.log('\n🎓 최근 수강 등록 내역 (최대 5건):');
    for (const e of status.recentEnrollments) {
      console.log(`  [${e.status.padEnd(7)}] 학생: ${e.login_id} | ${e.course_title.slice(0, 30)}...`);
    }

    console.log('\n💬 최근 1:1 상담 문의 내역:');
    for (const i of status.recentInquiries) {
      console.log(`  [${i.status.padEnd(8)}] [${i.category}] ${i.title.slice(0, 30)}... | 답변: ${i.answer ? '완료' : '대기'}`);
    }

    // 스냅샷 파일 저장
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(status, null, 2), 'utf8');
    console.log('\n💾 현재 DB 스냅샷이 저장되었습니다: scripts/.db_snapshot.json');
  } finally {
    await client.end();
  }
}

async function showKpis() {
  const client = await getClient();
  try {
    const totalStudents = (await client.query(`SELECT count(*) FROM users WHERE user_type = 'STUDENT'`)).rows[0].count;
    const pendingPayments = (await client.query(`SELECT count(*) as count, coalesce(sum(amount), 0) as sum FROM payments WHERE status = 'PENDING'`)).rows[0];
    const paidPayments = (await client.query(`SELECT count(*) as count, coalesce(sum(amount), 0) as sum FROM payments WHERE status = 'PAID'`)).rows[0];
    const activeEnrollments = (await client.query(`SELECT count(*) FROM course_enrollments WHERE status = 'ACTIVE'`)).rows[0].count;
    const pendingEnrollments = (await client.query(`SELECT count(*) FROM course_enrollments WHERE status = 'PENDING'`)).rows[0].count;
    const openInquiries = (await client.query(`SELECT count(*) FROM inquiries WHERE status = 'OPEN'`)).rows[0].count;

    console.log('=================================================================');
    console.log(' 📈 eCare24 실시간 DB 비즈니스 KPI 지표 모니터링');
    console.log('=================================================================');
    console.log(` • 총 등록 수강생 수      : ${totalStudents} 명`);
    console.log(` • 활성(ACTIVE) 수강 강좌  : ${activeEnrollments} 건 (입금대기 PENDING: ${pendingEnrollments} 건)`);
    console.log(` • 무통장 입금 대기 큐     : ${pendingPayments.count} 건 (${parseInt(pendingPayments.sum, 10).toLocaleString()} 원)`);
    console.log(` • 누적 수강료 결제 완료   : ${paidPayments.count} 건 (${parseInt(paidPayments.sum, 10).toLocaleString()} 원)`);
    console.log(` • 미답변 1:1 상담 문의    : ${openInquiries} 건`);
    console.log('=================================================================');
  } finally {
    await client.end();
  }
}

async function compareDiff() {
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    console.log('⚠️ 이전 스냅샷 파일이 없습니다. 먼저 `status` 명령을 실행하세요.');
    return;
  }
  const oldSnapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
  const client = await getClient();
  try {
    const current = await getDbStatus(client);
    console.log('=================================================================');
    console.log(` 🔍 DB 스냅샷 델타(Diff) 모니터링 [${oldSnapshot.timestamp} ➔ ${current.timestamp}]`);
    console.log('=================================================================');

    let hasChange = false;
    for (const tbl of Object.keys(current.counts)) {
      const oldCount = oldSnapshot.counts[tbl] || 0;
      const newCount = current.counts[tbl] || 0;
      const delta = newCount - oldCount;
      if (delta !== 0) {
        hasChange = true;
        const sign = delta > 0 ? `+${delta}` : `${delta}`;
        console.log(`  ⚡ [${tbl}] 레코드 변화: ${oldCount} ➔ ${newCount} (${sign})`);
      }
    }

    if (!hasChange) {
      console.log('  (테이블 레코드 수 변경 없음 - 필드 값 전이 여부를 점검합니다)');
    }

    // 결제 상태 전이 점검
    for (const p of current.recentPayments) {
      const old = oldSnapshot.recentPayments.find((x) => x.id === p.id);
      if (!old) {
        console.log(`  ✨ [신규 결제 INSERT] 주문번호: ${p.order_no} | 학생: ${p.login_id} | 금액: ${p.amount.toLocaleString()}원 | 상태: ${p.status}`);
      } else if (old.status !== p.status) {
        console.log(`  🔄 [결제 상태 UPDATE] 주문번호: ${p.order_no} | 상태 전이: ${old.status} ➔ ${p.status} (paid_at: ${p.paid_at})`);
      }
    }

    // 수강 등록 상태 전이 점검
    for (const e of current.recentEnrollments) {
      const old = oldSnapshot.recentEnrollments.find((x) => x.id === e.id);
      if (!old) {
        console.log(`  ✨ [신규 수강 INSERT] 학생: ${e.login_id} | 강좌: ${e.course_title} | 상태: ${e.status}`);
      } else if (old.status !== e.status) {
        console.log(`  🔄 [수강 상태 UPDATE] 학생: ${e.login_id} | 상태 전이: ${old.status} ➔ ${e.status}`);
      }
    }

    // 문의 답변 상태 점검
    for (const inq of current.recentInquiries) {
      const old = oldSnapshot.recentInquiries.find((x) => x.id === inq.id);
      if (!old) {
        console.log(`  ✨ [신규 문의 INSERT] 학생: ${inq.login_id} | 제목: ${inq.title} | 상태: ${inq.status}`);
      } else if (old.status !== inq.status) {
        console.log(`  🔄 [문의 답변 UPDATE] 제목: ${inq.title} | 상태: ${old.status} ➔ ${inq.status} (답변 완료)`);
      }
    }

    // 팝업 상태 점검
    for (const pop of current.recentPopups) {
      const old = oldSnapshot.recentPopups.find((x) => x.id === pop.id);
      if (!old) {
        console.log(`  ✨ [신규 팝업 INSERT] 제목: ${pop.title} | 우선순위: ${pop.priority}`);
      }
    }

    console.log('=================================================================');
  } finally {
    await client.end();
  }
}

const cmd = process.argv[2] || 'status';
switch (cmd) {
  case 'kpi':
    showKpis().catch(console.error);
    break;
  case 'diff':
    compareDiff().catch(console.error);
    break;
  case 'status':
  default:
    showStatus().catch(console.error);
    break;
}
