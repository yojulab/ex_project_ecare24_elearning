import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { SEED_PERMISSIONS } from '../seeds/data/permissions.data';
import { SEED_DISEASE_CATEGORIES } from '../seeds/data/disease-categories.data';
import { SEED_GOLDEN_RULES } from '../seeds/data/golden-rules.data';
import { SEED_CAREGIVER_TERMS } from '../seeds/data/caregiver-terms.data';
import { SEED_COURSES } from '../seeds/data/courses.data';
import { SEED_EXAM_QUESTIONS } from '../seeds/data/exam-questions.data';
import { SEED_NOTICES } from '../seeds/data/notices.data';
import { SEED_POPUPS } from '../seeds/data/popups.data';
import {
  SEED_USERS,
  SEED_CERTIFICATES,
  SEED_CERT_APPLICATIONS,
  SEED_INQUIRIES,
  SEED_COUNSELING_TICKETS,
} from '../seeds/data/operational.data';

import { getConnectedClient } from './db-client.helper';

export async function runSeeds() {
  console.log('🌱 [DB:SEED] eCare24 기준 데이터 및 운영 데이터 전체 시드 주입 시작...');

  let client: Client | null = null;
  try {
    const res = await getConnectedClient();
    client = res.client;
    console.log(`✅ PostgreSQL 연결 성공 (host: ${res.activeHost}, user: ${process.env.DB_USER || 'ecare24_app'})`);

    // 1. 권한 마스터 시드 (25개)
    console.log(`🔐 [1/13] 권한 마스터 ${SEED_PERMISSIONS.length}건 주입 중...`);
    for (const p of SEED_PERMISSIONS) {
      await client.query(
        `INSERT INTO permissions (code, group_name, name_ko, description, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (code) DO UPDATE SET
           group_name = EXCLUDED.group_name,
           name_ko = EXCLUDED.name_ko,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order;`,
        [p.code, p.groupName, p.nameKo, p.description, p.displayOrder]
      );
    }
    console.log('✅ 권한 마스터 주입 완료.');

    // 2. 16대 질환군 마스터 시드
    console.log(`🏥 [2/13] 16대 질환군 마스터 ${SEED_DISEASE_CATEGORIES.length}건 주입 중...`);
    for (const d of SEED_DISEASE_CATEGORIES) {
      await client.query(
        `INSERT INTO disease_categories (id, code, name_ko, description, icon_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (code) DO UPDATE SET
           name_ko = EXCLUDED.name_ko,
           description = EXCLUDED.description,
           icon_url = EXCLUDED.icon_url,
           display_order = EXCLUDED.display_order,
           is_active = EXCLUDED.is_active;`,
        [d.id, d.code, d.nameKo, d.description, d.iconUrl, d.displayOrder, d.isActive]
      );
    }
    await client.query(`SELECT setval('disease_categories_id_seq', (SELECT MAX(id) FROM disease_categories));`);
    console.log('✅ 16대 질환군 마스터 주입 완료.');

    // 3. 간병 10대 골든 룰 시드
    console.log(`⭐ [3/13] 간병 10대 골든 룰 ${SEED_GOLDEN_RULES.length}건 주입 중...`);
    for (const r of SEED_GOLDEN_RULES) {
      await client.query(
        `INSERT INTO golden_rules (rule_no, title, description, bad_case, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (rule_no) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           bad_case = EXCLUDED.bad_case,
           is_active = EXCLUDED.is_active;`,
        [r.ruleNo, r.title, r.description, r.badCase, r.isActive]
      );
    }
    console.log('✅ 간병 10대 골든 룰 주입 완료.');

    // 4. 간병 임상 전문 용어사전 시드
    console.log(`📖 [4/13] 임상 전문 용어사전 ${SEED_CAREGIVER_TERMS.length}건 주입 중...`);
    for (const t of SEED_CAREGIVER_TERMS) {
      await client.query(
        `INSERT INTO caregiver_terms (term, standard_term, category, definition, care_point, warning_alert)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (term) DO UPDATE SET
           standard_term = EXCLUDED.standard_term,
           category = EXCLUDED.category,
           definition = EXCLUDED.definition,
           care_point = EXCLUDED.care_point,
           warning_alert = EXCLUDED.warning_alert;`,
        [t.term, t.standardTerm, t.category, t.definition, t.carePoint, t.warningAlert || null]
      );
    }
    console.log('✅ 임상 전문 용어사전 주입 완료.');

    // 5. 교육과정 & 차시 영상 (총 18개 교육과정)
    console.log(`🎓 [5/13] 교육과정 ${SEED_COURSES.length}개 및 차시 영상(HeyGen AI 포함) 주입 중...`);
    for (const c of SEED_COURSES) {
      await client.query(
        `INSERT INTO courses (
           id, category_id, course_type, title, target_disease, summary,
           price, theory_hours, practical_hours, practicum_hours,
           snubh_credit_cap_hours, qualification_name, is_published, study_period_days, is_active
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           target_disease = EXCLUDED.target_disease,
           summary = EXCLUDED.summary,
           price = EXCLUDED.price,
           theory_hours = EXCLUDED.theory_hours,
           practical_hours = EXCLUDED.practical_hours,
           practicum_hours = EXCLUDED.practicum_hours,
           snubh_credit_cap_hours = EXCLUDED.snubh_credit_cap_hours,
           qualification_name = EXCLUDED.qualification_name,
           is_published = EXCLUDED.is_published,
           study_period_days = EXCLUDED.study_period_days;`,
        [
          c.id,
          c.categoryId || null,
          c.courseType,
          c.title,
          c.targetDisease,
          c.summary,
          c.price,
          c.theoryHours,
          c.practicalHours,
          c.practicumHours,
          c.snubhCreditCapHours,
          c.qualificationName,
          c.isPublished,
          c.studyPeriodDays,
        ]
      );

      // 단계 스텝 주입
      for (const s of c.steps) {
        await client.query(
          `INSERT INTO curriculum_steps (course_id, step_number, step_type, title, duration_minutes, description, pass_score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING;`,
          [c.id, s.stepNumber, s.stepType, s.title, s.durationMinutes, s.description, s.passScore || 0]
        );
      }

      // 차시 영상 주입
      for (const v of c.videos) {
        await client.query(
          `INSERT INTO course_videos (course_id, title, source, external_ref, original_url, embed_url, duration_seconds, display_order, is_preview, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
           ON CONFLICT DO NOTHING;`,
          [c.id, v.title, v.source, v.externalRef, v.originalUrl, v.embedUrl, v.durationSeconds, v.displayOrder, v.isPreview]
        );
      }
    }
    console.log('✅ 교육과정 및 차시 영상 주입 완료.');

    // 6. CBT 문제은행 시드
    console.log(`📝 [6/13] CBT 문제은행 ${SEED_EXAM_QUESTIONS.length}문항 주입 중...`);
    for (const q of SEED_EXAM_QUESTIONS) {
      await client.query(
        `INSERT INTO exam_questions (category_id, subject_code, question_type, title, scenario, points, options, correct_answer, explanation, terminology_tags, is_reviewed_by_clinician)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT DO NOTHING;`,
        [
          q.categoryId,
          q.subjectCode,
          q.questionType,
          q.title,
          q.scenario || null,
          q.points,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.terminologyTags,
          q.isReviewedByClinician,
        ]
      );
    }
    console.log('✅ CBT 문제은행 주입 완료.');

    // 7. 시스템 운영 설정 시드
    console.log('⚙️ [7/13] 시스템 설정 기본값 주입 중...');
    const settings = [
      { key: 'CS_PHONE', value: '1588-2424', isPublic: true, desc: '대표 고객센터 전화번호' },
      { key: 'BANK_ACCOUNT', value: '신한은행 110-542-889900 (예금주: 한국돌봄종사자양성교육원)', isPublic: true, desc: '수강료 무통장 입금계좌' },
      { key: 'ACADEMY_ADDRESS', value: '서울특별시 강남구 테헤란로 427 위워크타워 14층 (선릉역 10번 출구)', isPublic: true, desc: '교육원 본원 소재지' },
      { key: 'NURSE_EVAL_PASS_SCORE', value: '80', isPublic: true, desc: '간호사 실습평가 합격 기준 점수 (100점 만점)' },
    ];
    for (const s of settings) {
      await client.query(
        `INSERT INTO system_settings (key, value, is_public, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           is_public = EXCLUDED.is_public,
           description = EXCLUDED.description;`,
        [s.key, s.value, s.isPublic, s.desc]
      );
    }
    console.log('✅ 시스템 설정 주입 완료.');

    // 8. 최고관리자(Super Admin) 계정 및 전체 권한 부여
    console.log('👑 [8/13] 최고관리자(Super Admin) 계정 생성 및 전권 부여 중...');
    const superAdminLoginId = process.env.SEED_SUPER_ADMIN_LOGIN_ID || 'admin';
    const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD || 'admin1234!';
    const superAdminName = process.env.SEED_SUPER_ADMIN_NAME || '시스템관리자';
    const superAdminPhone = process.env.SEED_SUPER_ADMIN_PHONE || '010-0000-0000';
    const saltRounds = parseInt(process.env.BCRYPT_COST || '10', 10);
    const passwordHash = await bcrypt.hash(superAdminPassword, saltRounds);

    const userRes = await client.query(
      `INSERT INTO users (login_id, full_name, phone_number, password_hash, user_type, status, email)
       VALUES ($1, $2, $3, $4, 'STAFF', 'ACTIVE', 'admin@ecare24.kr')
       ON CONFLICT (login_id) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         full_name = EXCLUDED.full_name,
         phone_number = EXCLUDED.phone_number,
         user_type = 'STAFF',
         status = 'ACTIVE'
       RETURNING id;`,
      [superAdminLoginId, superAdminName, superAdminPhone, passwordHash]
    );

    const superAdminId = userRes.rows[0].id;

    for (const p of SEED_PERMISSIONS) {
      await client.query(
        `INSERT INTO user_permissions (user_id, permission_code, granted_by, granted_at)
         VALUES ($1, $2, $1, NOW())
         ON CONFLICT (user_id, permission_code) DO NOTHING;`,
        [superAdminId, p.code]
      );
    }
    console.log(`✅ 최고관리자 계정 준비 완료: login_id="${superAdminLoginId}"`);

    // 9. 학생 및 상담원 사용자 계정 주입
    console.log(`👥 [9/13] 학생 및 상담원 사용자 계정 ${SEED_USERS.length}건 주입 중...`);
    const userMap: Record<string, string> = { admin: superAdminId };

    for (const u of SEED_USERS) {
      const uHash = await bcrypt.hash(u.password, saltRounds);
      const res = await client.query(
        `INSERT INTO users (login_id, full_name, phone_number, password_hash, user_type, status, email)
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6)
         ON CONFLICT (login_id) DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           phone_number = EXCLUDED.phone_number,
           email = EXCLUDED.email
         RETURNING id;`,
        [u.loginId, u.fullName, u.phoneNumber, uHash, u.userType, u.email]
      );
      userMap[u.loginId] = res.rows[0].id;

      // 상담원 계정인 경우 CS 권한 부여
      if (u.userType === 'STAFF') {
        const csPerms = ['ADMIN_PORTAL_ACCESS', 'DASHBOARD_VIEW', 'STUDENT_READ', 'COUNSEL_HANDLE', 'COUNSEL_READ_ALL'];
        for (const code of csPerms) {
          await client.query(
            `INSERT INTO user_permissions (user_id, permission_code, granted_by, granted_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id, permission_code) DO NOTHING;`,
            [res.rows[0].id, code, superAdminId]
          );
        }
      }
    }
    console.log('✅ 사용자 계정 주입 완료.');

    // 10. 공지사항 시드 주입
    console.log(`📢 [10/13] 공지사항 ${SEED_NOTICES.length}건 주입 중...`);
    for (const n of SEED_NOTICES) {
      await client.query(
        `INSERT INTO notices (id, title, content, is_pinned, is_published, view_count, author_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           is_pinned = EXCLUDED.is_pinned,
           is_published = EXCLUDED.is_published,
           view_count = EXCLUDED.view_count;`,
        [n.id, n.title, n.content, n.isPinned, n.isPublished, n.viewCount, superAdminId]
      );
    }
    console.log('✅ 공지사항 주입 완료.');

    // 11. 팝업 공지 시드 주입
    console.log(`🪟 [11/13] 팝업 공지 ${SEED_POPUPS.length}건 주입 중...`);
    for (const p of SEED_POPUPS) {
      await client.query(
        `INSERT INTO popup_notices (
           id, title, content_html, link_url, target, show_on_web, show_on_mobile,
           position_x, position_y, width, priority, allow_hide_today, starts_at, ends_at, is_active, author_id
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           content_html = EXCLUDED.content_html,
           link_url = EXCLUDED.link_url,
           target = EXCLUDED.target,
           show_on_web = EXCLUDED.show_on_web,
           show_on_mobile = EXCLUDED.show_on_mobile,
           priority = EXCLUDED.priority,
           starts_at = EXCLUDED.starts_at,
           ends_at = EXCLUDED.ends_at,
           is_active = EXCLUDED.is_active;`,
        [
          p.id,
          p.title,
          p.contentHtml,
          p.linkUrl || null,
          p.target,
          p.showOnWeb,
          p.showOnMobile,
          p.positionX,
          p.positionY,
          p.width,
          p.priority,
          p.allowHideToday,
          p.startsAt,
          p.endsAt,
          p.isActive,
          superAdminId,
        ]
      );
    }
    console.log('✅ 팝업 공지 주입 완료.');

    // 12. 자격증 및 자격증 신청서 주입
    console.log(`🏅 [12/13] 자격증 및 신청서 주입 중...`);
    for (const cert of SEED_CERTIFICATES) {
      const uId = userMap[cert.studentLoginId];
      if (uId) {
        await client.query(
          `INSERT INTO certificates (
             id, certificate_no, registry_no, user_id, course_id, category_id, qualification_name, grade, score, qr_verify_token, status
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (certificate_no) DO UPDATE SET
             score = EXCLUDED.score,
             status = EXCLUDED.status;`,
          [
            cert.id,
            cert.certificateNo,
            cert.registryNo,
            uId,
            cert.courseId,
            cert.categoryId || null,
            cert.qualificationName,
            cert.grade,
            cert.score,
            cert.qrVerifyToken,
            cert.status,
          ]
        );
      }
    }

    for (const app of SEED_CERT_APPLICATIONS) {
      const uId = userMap[app.studentLoginId];
      if (uId) {
        await client.query(
          `INSERT INTO cert_applications (id, user_id, course_id, eligibility_basis, status)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING;`,
          [app.id, uId, app.courseId, app.eligibilityBasis, app.status]
        );
      }
    }
    console.log('✅ 자격증 및 신청서 주입 완료.');

    // 13. 1:1 상담 문의 및 콜센터 CTI 상담 티켓 주입
    console.log(`📞 [13/13] 1:1 상담 문의 및 콜센터 상담 티켓 주입 중...`);
    for (const inq of SEED_INQUIRIES) {
      const uId = userMap[inq.studentLoginId];
      if (uId) {
        await client.query(
          `INSERT INTO inquiries (id, user_id, category, title, content, status, answer, answered_by, answered_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             content = EXCLUDED.content,
             status = EXCLUDED.status,
             answer = EXCLUDED.answer,
             answered_at = EXCLUDED.answered_at;`,
          [
            inq.id,
            uId,
            inq.category,
            inq.title,
            inq.content,
            inq.status,
            inq.answer || null,
            inq.answer ? superAdminId : null,
            inq.answer ? new Date() : null,
          ]
        );
      }
    }

    for (const t of SEED_COUNSELING_TICKETS) {
      const uId = userMap[t.studentLoginId];
      const agentId = userMap['counselor01'] || superAdminId;
      await client.query(
        `INSERT INTO counseling_tickets (id, user_id, agent_id, inbound_caller_number, category, status, subject)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING;`,
        [t.id, uId || null, agentId, t.callerNumber, t.category, t.status, t.subject]
      );

      await client.query(
        `INSERT INTO counseling_logs (ticket_id, agent_id, content, call_duration_seconds)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING;`,
        [t.id, agentId, t.memo, t.durationSeconds]
      );
    }
    console.log('✅ 상담 문의 및 콜센터 CTI 데이터 주입 완료.');

    console.log('🎉 [DB:SEED] 모든 기준 마스터 및 실제 운영 초기 데이터가 100% 완벽히 주입되었습니다!');
  } catch (error) {
    console.error('❌ [DB:SEED] 시드 주입 중 오류 발생:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

if (require.main === module) {
  runSeeds();
}
