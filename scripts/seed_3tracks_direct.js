const { Client } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const parsedTracks = require('../packages/utils/src/parsed_tracks.json');

async function seedThreeTracks() {
  console.log('🚀 [SEED-DIRECT] 3개 실데이터 트랙 및 180문항 주입 시작...');

  const client = new Client({
    host: process.env.DB_HOST || 'graphrag_agent_db_postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ecare24',
    user: process.env.DB_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
  });

  try {
    await client.connect();
    console.log('✅ PostgreSQL 연결 성공.');

    // 0. courses의 target_disease 컬럼 타입을 VARCHAR(255)로 보장
    await client.query(`ALTER TABLE courses ALTER COLUMN target_disease TYPE VARCHAR(255);`);
    console.log('✅ courses.target_disease 타입 VARCHAR(255) 보장 완료.');

    // 1. 기존 트랙 관련 목업 데이터 정리 (하위 의존성 테이블 포함)
    console.log('🧹 기존 목업 데이터 정리 중...');
    // 관련된 외래키 테이블들 데이터 정리
    await client.query(`DELETE FROM step_progress;`);
    await client.query(`DELETE FROM video_watch_sessions;`);
    await client.query(`DELETE FROM exam_attempts;`);
    await client.query(`DELETE FROM cert_applications;`);
    await client.query(`DELETE FROM certificates;`);
    await client.query(`DELETE FROM payments;`);
    await client.query(`DELETE FROM course_enrollments;`);
    await client.query(`DELETE FROM course_videos;`);
    await client.query(`DELETE FROM curriculum_steps;`);
    await client.query(`DELETE FROM exam_questions;`);
    await client.query(`DELETE FROM courses;`);
    await client.query(`DELETE FROM disease_categories;`);
    console.log('✅ 기존 목업 코스, 카테고리, 시험문항, 수강기록 정리 완료.');

    // 2. 3대 질환군 마스터 시드
    console.log('🏥 [1/4] 3대 질환군 마스터 주입 중...');
    const categories = [
      {
        id: 1,
        code: 'PULMONARY',
        nameKo: '호흡기계·폐질환 케어 트랙',
        description: 'COPD, 폐렴, 천식, 산소요법 및 흡인 기구 안전 수칙',
        iconUrl: '/icons/pulmonary.svg',
        displayOrder: 1,
      },
      {
        id: 2,
        code: 'DEMENTIA',
        nameKo: '인지·정신·치매환자 케어 트랙',
        description: '알츠하이머, 혈관성 치매, BPSD 감정 수용, 낙상·연하 안전 및 섬망 감별',
        iconUrl: '/icons/dementia.svg',
        displayOrder: 2,
      },
      {
        id: 3,
        code: 'MUSCULOSKELETAL',
        nameKo: '근골격계질환 및 수술 후 재활 케어 트랙',
        description: '척추손상, 디스크, 인공관절, 골절, 마비측 팔 견인 금지 및 기구 5대 점검',
        iconUrl: '/icons/musculoskeletal.svg',
        displayOrder: 3,
      },
    ];

    for (const cat of categories) {
      await client.query(
        `INSERT INTO disease_categories (id, code, name_ko, description, icon_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE);`,
        [cat.id, cat.code, cat.nameKo, cat.description, cat.iconUrl, cat.displayOrder]
      );
    }
    await client.query(`SELECT setval('disease_categories_id_seq', (SELECT MAX(id) FROM disease_categories));`);
    console.log('✅ 3대 질환군 카테고리 주입 완료.');

    // 3. 3개 실데이터 트랙 및 챕터 스텝, HeyGen 비디오 주입
    console.log('🎓 [2/4] 3개 실데이터 교육과정 및 챕터/HeyGen 비디오 주입 중...');
    for (const t of parsedTracks) {
      await client.query(
        `INSERT INTO courses (
           id, category_id, course_type, title, target_disease, summary,
           price, theory_hours, practical_hours, practicum_hours,
           snubh_credit_cap_hours, qualification_name, is_published, study_period_days, is_active
         )
         VALUES ($1, $2, 'TRACK', $3, $4, $5, 120000, 4, 4, 0, 2.0, $6, TRUE, 90, TRUE);`,
        [
          t.id,
          t.categoryId,
          t.title,
          t.targetDisease.substring(0, 250),
          `${t.qualificationName} 공식 교육과정. 5대 챕터 정규 교안, ${t.videoTitle} VOD, 실전 모의고사 30문항, 최종 평가시험 30문항 완비.`,
          t.qualificationName,
        ]
      );

      // 4단계 스텝 주입
      const steps = [
        {
          num: 1,
          type: 'THEORY_TEXT',
          title: 'Step 1. 전문간병사 정규 교안 (5대 챕터 문구형 교안)',
          dur: 240,
          desc: t.chapters.map(c => c.title).join(' / '),
        },
        {
          num: 2,
          type: 'PRACTICAL_VIDEO',
          title: `Step 2. 4K 실기 & 실습 시뮬레이션 (${t.videoTitle})`,
          dur: 240,
          desc: '전문강사 핵심 임상 실기 VOD 및 스크립트 기반 실무 시뮬레이션',
        },
        {
          num: 3,
          type: 'MOCK_EXAM',
          title: 'Step 3. 실전 모의고사 CBT (30문항)',
          dur: 60,
          desc: '실무 임상 상황별 문제은행 30문항 및 상세 해설',
        },
        {
          num: 4,
          type: 'FINAL_EXAM',
          title: 'Step 4. 정규 자격검정 평가시험 (30문항 실시간 통과)',
          dur: 60,
          desc: '한국직업능력연구원(pqi.or.kr) 등록 정규 자격 검정 (60점 이상 합격)',
        },
      ];

      for (const st of steps) {
        await client.query(
          `INSERT INTO curriculum_steps (course_id, step_number, step_type, title, duration_minutes, description, pass_score)
           VALUES ($1, $2, $3, $4, $5, $6, 60);`,
          [t.id, st.num, st.type, st.title, st.dur, st.desc]
        );
      }

      // HeyGen 비디오 주입
      const videoDuration = t.id.endsWith('03') ? 110 : 75;
      await client.query(
        `INSERT INTO course_videos (course_id, title, source, external_ref, original_url, embed_url, duration_seconds, display_order, is_preview, is_active)
         VALUES ($1, $2, 'HEYGEN', $3, $4, $5, $6, 1, TRUE, TRUE);`,
        [t.id, t.videoTitle, t.videoUrl.split('/videos/')[1] || 'heygen', t.videoUrl, t.embedUrl, videoDuration]
      );
    }
    console.log('✅ 3개 실데이터 과정, 챕터 스텝, HeyGen 비디오 주입 완료.');

    // 4. 180문항 CBT 문제은행 주입
    console.log('📝 [3/4] 3개 트랙 180문항 CBT 문제은행 주입 중...');
    let qCount = 0;
    for (const t of parsedTracks) {
      // Mock questions (30)
      for (const q of t.mockQuestions) {
        await client.query(
          `INSERT INTO exam_questions (category_id, subject_code, question_type, title, scenario, points, options, correct_answer, explanation, terminology_tags, is_reviewed_by_clinician)
           VALUES ($1, $2, 'MULTIPLE_CHOICE', $3, $4, 20, $5, $6, $7, $8, TRUE);`,
          [
            t.categoryId,
            q.subjectCode,
            q.title,
            `[${t.qualificationName} 모의평가] 문항 ${q.questionNumber}`,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.terminologyTags,
          ]
        );
        qCount++;
      }
      // Final questions (30)
      for (const q of t.finalQuestions) {
        await client.query(
          `INSERT INTO exam_questions (category_id, subject_code, question_type, title, scenario, points, options, correct_answer, explanation, terminology_tags, is_reviewed_by_clinician)
           VALUES ($1, $2, 'CASE_STUDY', $3, $4, 20, $5, $6, $7, $8, TRUE);`,
          [
            t.categoryId,
            q.subjectCode,
            q.title,
            `[${t.qualificationName} 정규 자격검정] 문항 ${q.questionNumber}`,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.terminologyTags,
          ]
        );
        qCount++;
      }
    }
    console.log(`✅ 총 ${qCount}개 문항 (트랙당 모의고사 30 + 최종평가 30) 주입 완료.`);

    // 4-1. 권한 마스터 시드 (25개)
    console.log('🔐 [4/5] 권한 마스터 시드 보장 중...');
    const permissionsData = require('../backend/dist/database/seeds/data/permissions.data').SEED_PERMISSIONS;
    for (const p of permissionsData) {
      await client.query(
        `INSERT INTO permissions (code, group_name, name_ko, description, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (code) DO NOTHING;`,
        [p.code, p.groupName, p.nameKo, p.description, p.displayOrder]
      );
    }

    // 4-2. 사용자 계정 생성 (최고관리자 admin, 학생 student01, student02)
    console.log('👥 [4/5] 최고관리자(admin) 및 학생(student01, student02) 계정 생성 중...');
    const adminHash = await bcrypt.hash('admin1234!', 10);
    const studentHash = await bcrypt.hash('password123!', 10);

    const adminRes = await client.query(
      `INSERT INTO users (login_id, full_name, phone_number, password_hash, user_type, status, email)
       VALUES ('admin', '시스템관리자', '010-0000-0000', $1, 'STAFF', 'ACTIVE', 'admin@ecare24.kr')
       ON CONFLICT (login_id) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id;`,
      [adminHash]
    );
    const adminId = adminRes.rows[0].id;

    for (const p of permissionsData) {
      await client.query(
        `INSERT INTO user_permissions (user_id, permission_code, granted_by, granted_at)
         VALUES ($1, $2, $1, NOW())
         ON CONFLICT (user_id, permission_code) DO NOTHING;`,
        [adminId, p.code]
      );
    }

    await client.query(
      `INSERT INTO users (login_id, full_name, phone_number, password_hash, user_type, status, email)
       VALUES 
         ('student01', '김영희', '010-9876-5432', $1, 'STUDENT', 'ACTIVE', 'younghee.kim@caregiver24.kr'),
         ('student02', '박철수', '010-1234-5678', $1, 'STUDENT', 'ACTIVE', 'chulsoo.park@caregiver24.kr')
       ON CONFLICT (login_id) DO UPDATE SET password_hash = EXCLUDED.password_hash;`,
      [studentHash]
    );
    console.log('✅ 최고관리자 및 학생 계정 준비 완료.');

    // 5. 기본 학생 계정(student01, student02) 수강 등록 및 자격증 데이터 보강
    console.log('📜 [5/5] 수강생 등록 및 자격증 데이터 3개 트랙 연동...');
    const userRes = await client.query(`SELECT id, login_id FROM users WHERE login_id IN ('student01', 'student02');`);
    const studentUser = userRes.rows.find(u => u.login_id === 'student01');

    if (studentUser) {
      // 트랙 1 수강 등록 (ACTIVE) & 결제 (PAID)
      const enrollRes1 = await client.query(
        `INSERT INTO course_enrollments (user_id, course_id, status)
         VALUES ($1, 'a0000000-0000-0000-0000-000000000001', 'ACTIVE')
         RETURNING id;`,
        [studentUser.id]
      );
      await client.query(
        `INSERT INTO payments (order_no, enrollment_id, user_id, amount, method, status, depositor_name, paid_at)
         VALUES ('EC24-ORD-2026-0001', $1, $2, 120000, 'BANK_TRANSFER', 'PAID', '김영희', NOW());`,
        [enrollRes1.rows[0].id, studentUser.id]
      );

      // 트랙 2 수강 등록 (ACTIVE) & 결제 (PAID)
      const enrollRes2 = await client.query(
        `INSERT INTO course_enrollments (user_id, course_id, status)
         VALUES ($1, 'a0000000-0000-0000-0000-000000000002', 'ACTIVE')
         RETURNING id;`,
        [studentUser.id]
      );
      await client.query(
        `INSERT INTO payments (order_no, enrollment_id, user_id, amount, method, status, depositor_name, paid_at)
         VALUES ('EC24-ORD-2026-0002', $1, $2, 120000, 'BANK_TRANSFER', 'PAID', '김영희', NOW());`,
        [enrollRes2.rows[0].id, studentUser.id]
      );

      // 트랙 1 합격 자격증 1건
      await client.query(
        `INSERT INTO certificates (
           id, certificate_no, registry_no, user_id, course_id, category_id,
           qualification_name, grade, score, qr_verify_token, status
         )
         VALUES (
           'd0000000-0000-0000-0000-000000000001', 'EC24-CERT-2026-00892', 'PQI-2026-0892',
           $1, 'a0000000-0000-0000-0000-000000000001', 1,
           '환자 질환별 전문간병사 (호흡기계·폐질환자)', '전문간병사 1급', 92, 'QR-TOKEN-EC24-2026-PULMONARY-892', 'VALID'
         );`,
        [studentUser.id]
      );

      // 트랙 2 합격 자격증 1건
      await client.query(
        `INSERT INTO certificates (
           id, certificate_no, registry_no, user_id, course_id, category_id,
           qualification_name, grade, score, qr_verify_token, status
         )
         VALUES (
           'd0000000-0000-0000-0000-000000000002', 'EC24-CERT-2026-00104', 'PQI-2026-0104',
           $1, 'a0000000-0000-0000-0000-000000000002', 2,
           '환자 질환별 전문간병사 (인지·정신·치매)', '전문간병사 1급', 95, 'QR-TOKEN-EC24-2026-DEMENTIA-104', 'VALID'
         );`,
        [studentUser.id]
      );

      // 트랙 3 자격증 신청 1건 (DOC_CHECK)
      await client.query(
        `INSERT INTO cert_applications (
           id, user_id, course_id, eligibility_basis, status
         )
         VALUES (
           'e0000000-0000-0000-0000-000000000001',
           $1, 'a0000000-0000-0000-0000-000000000003', '요양보호사 1급 소지자 및 8h 이수', 'DOC_CHECK'
         );`,
        [studentUser.id]
      );
    }

    console.log('🎉 [SEED-DIRECT] 3개 실데이터 트랙 및 180문항 DB 반영 완료!');
  } catch (err) {
    console.error('❌ 시드 주입 중 오류:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedThreeTracks();
