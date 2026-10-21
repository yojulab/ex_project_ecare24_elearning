-- ============================================================================
-- eCare24 DDL 03: Phase 2 수정요청(CR) 보완 스키마
-- 선행: 01_master_schema.sql, 02_auth_payment_admin_schema.sql
-- 계획서: docs/architecture/PHASE2_CHANGE_REQUEST_PLAN.md
-- 대상: PostgreSQL 16+ (TypeORM 마이그레이션 및 엔티티 동기화 연동)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. ENUM 확장 / 신규
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_format_enum') THEN
        CREATE TYPE video_format_enum AS ENUM ('SHORT', 'LONG');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_usage_enum') THEN
        CREATE TYPE question_usage_enum AS ENUM ('QUIZ', 'MOCK', 'FINAL', 'ALL');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 1. [CR-01] 공통 돌봄 수칙 테이블 (common_care_rules)
--    지침서 독립 메뉴 삭제 후, 교안 서두에 배치될 필수 공통/질환별 텍스트 수칙
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS common_care_rules (
    id             SERIAL PRIMARY KEY,
    category_id    INT REFERENCES disease_categories(id) ON DELETE SET NULL, -- NULL이면 전 질환 공통
    rule_code      VARCHAR(50) NOT NULL UNIQUE,                              -- 예: 'RULE_HAND_HYGIENE', 'RULE_FALL_PREVENTION'
    title          VARCHAR(150) NOT NULL,
    summary        VARCHAR(300) NOT NULL,
    body           TEXT NOT NULL,
    image_url      VARCHAR(500),
    clinical_point TEXT,                                                     -- 임상 간호 관찰 포인트
    display_order  INT NOT NULL DEFAULT 0,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_common_care_rules_cat_order ON common_care_rules(category_id, display_order);

-- 수강생별 공통 수칙 확인 이력 (최초 1회 동의 기록)
CREATE TABLE IF NOT EXISTS user_care_rule_agreements (
    id             BIGSERIAL PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id      UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    agreed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client_ip      VARCHAR(45),
    CONSTRAINT uq_user_course_rule_agree UNIQUE (user_id, course_id)
);

-- ----------------------------------------------------------------------------
-- 2. [CR-02] 동영상 숏폼 마이크로러닝 필드 확장 (course_videos)
-- ----------------------------------------------------------------------------
ALTER TABLE course_videos
    ADD COLUMN IF NOT EXISTS format video_format_enum NOT NULL DEFAULT 'SHORT',
    ADD COLUMN IF NOT EXISTS symptom_tag VARCHAR(150),
    ADD COLUMN IF NOT EXISTS observation_points JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS follow_up_question_ids UUID[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS is_verified_short BOOLEAN NOT NULL DEFAULT TRUE; -- 60~90초 권장 충족 여부

-- ----------------------------------------------------------------------------
-- 3. [CR-03] 20문항 소그룹 CBT 엔진 테이블 및 필드 확장
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_question_groups (
    id              SERIAL PRIMARY KEY,
    category_id     INT REFERENCES disease_categories(id) ON DELETE CASCADE,
    code            VARCHAR(50) NOT NULL,                                     -- 'BASIC_CARE', 'AIRWAY', 'NEURO_COMP', 'EMERGENCY'
    name            VARCHAR(100) NOT NULL,                                    -- '기초 간병', '호흡/가래 관리' 등
    description     TEXT,
    question_count  INT NOT NULL DEFAULT 20,                                  -- 소그룹당 문항수
    min_pass_ratio  NUMERIC(4, 2) NOT NULL DEFAULT 0.40,                      -- 과락 기준 (40% 미만 과락)
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cat_group_code UNIQUE (category_id, code)
);

ALTER TABLE exam_questions
    ADD COLUMN IF NOT EXISTS group_id INT REFERENCES exam_question_groups(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS usage question_usage_enum NOT NULL DEFAULT 'ALL',
    ADD COLUMN IF NOT EXISTS difficulty SMALLINT NOT NULL DEFAULT 2,          -- 1: 기초, 2: 표준, 3: 심화
    ADD COLUMN IF NOT EXISTS is_report_only_bias BOOLEAN NOT NULL DEFAULT FALSE; -- '보고한다' 편향 여부 린트 플래그

CREATE INDEX IF NOT EXISTS idx_exam_q_cat_group ON exam_questions(category_id, group_id);

-- ----------------------------------------------------------------------------
-- 4. [CR-04] 실데이터 교안 테이블 (course_materials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_materials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    section_no      INT NOT NULL,                                            -- 단원 번호 (1, 2, 3...)
    title           VARCHAR(200) NOT NULL,
    body_markdown   TEXT NOT NULL,
    char_count      INT NOT NULL DEFAULT 0,
    estimated_read_minutes INT NOT NULL DEFAULT 5,
    source_version  VARCHAR(50) DEFAULT 'v1.0',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_course_section UNIQUE (course_id, section_no)
);

CREATE INDEX IF NOT EXISTS idx_course_materials_course_seq ON course_materials(course_id, section_no);

-- ----------------------------------------------------------------------------
-- 5. [REQ-16] 이론 및 실습 완료 게이트 필드 확장 (course_enrollments)
-- ----------------------------------------------------------------------------
ALTER TABLE course_enrollments
    ADD COLUMN IF NOT EXISTS theory_completed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS practice_completed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS practice_evaluator VARCHAR(100),                -- 간호사 평가자 성명/면허번호
    ADD COLUMN IF NOT EXISTS practice_score INT DEFAULT 0;
