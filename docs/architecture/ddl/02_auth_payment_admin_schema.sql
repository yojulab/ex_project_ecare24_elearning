-- ============================================================================
-- eCare24 DDL 확장안 02: 인증·권한(역할 없음)·납부·공지/팝업·관리자 기능
-- 선행: 01_master_schema.sql  |  계획서: docs/architecture/BACKEND_AND_MENU_PLAN.md
-- 대상: PostgreSQL 16+  (TypeORM 마이그레이션으로 이관 예정 · 기획 단계 명세)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. ENUM 확장 / 신규
-- ----------------------------------------------------------------------------
ALTER TYPE video_source_enum ADD VALUE IF NOT EXISTS 'HEYGEN';

CREATE TYPE user_type_enum      AS ENUM ('STUDENT', 'STAFF');
CREATE TYPE user_status_enum    AS ENUM ('ACTIVE', 'LOCKED', 'DORMANT', 'WITHDRAWN');
CREATE TYPE course_type_enum    AS ENUM ('MAIN', 'TRACK');
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PAID', 'CANCELED', 'REFUND_REQUESTED', 'REFUNDED');
CREATE TYPE payment_method_enum AS ENUM ('BANK_TRANSFER', 'CARD', 'VIRTUAL_ACCOUNT', 'FREE');
CREATE TYPE refund_status_enum  AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED');
CREATE TYPE cert_app_status_enum AS ENUM ('SUBMITTED', 'DOC_CHECK', 'NURSE_EVAL', 'REVIEW', 'ISSUED', 'REJECTED');
CREATE TYPE popup_target_enum   AS ENUM ('ALL', 'STUDENT', 'GUEST');
CREATE TYPE inquiry_status_enum AS ENUM ('OPEN', 'ANSWERED', 'CLOSED');

-- ----------------------------------------------------------------------------
-- 1. users 변경: 역할(role) 제거 → 권한은 user_permissions 로만 관리
-- ----------------------------------------------------------------------------
ALTER TABLE users DROP COLUMN role;
ALTER TABLE users
    ADD COLUMN login_id      VARCHAR(100) UNIQUE NOT NULL,           -- 휴대폰번호 또는 이메일 (오픈이슈 #3)
    ADD COLUMN user_type     user_type_enum   NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN status        user_status_enum NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN token_version INT NOT NULL DEFAULT 0,                 -- 권한 변경/강제 로그아웃 시 증가
    ADD COLUMN failed_login_count INT NOT NULL DEFAULT 0,
    ADD COLUMN locked_until  TIMESTAMPTZ,
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN last_login_at TIMESTAMPTZ;
DROP TYPE IF EXISTS user_role_enum;

-- ----------------------------------------------------------------------------
-- 2. 권한 마스터 + 사용자별 권한 리스트 (행 단위)
-- ----------------------------------------------------------------------------
CREATE TABLE permissions (
    code          VARCHAR(60) PRIMARY KEY,        -- 예: 'PAYMENT_CONFIRM'
    group_name    VARCHAR(40) NOT NULL,           -- 예: '납부'
    name_ko       VARCHAR(100) NOT NULL,
    description   TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_permissions (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_code VARCHAR(60) NOT NULL REFERENCES permissions(code) ON UPDATE CASCADE,
    granted_by      UUID REFERENCES users(id),
    granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_code)
);
CREATE INDEX idx_user_perm_code ON user_permissions(permission_code);

-- ----------------------------------------------------------------------------
-- 3. 인증 토큰 / 접속 이력
-- ----------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash    VARCHAR(255) NOT NULL UNIQUE,   -- SHA-256 해시만 저장
    token_version INT NOT NULL,
    user_agent    VARCHAR(300),
    ip_address    VARCHAR(50),
    expires_at    TIMESTAMPTZ NOT NULL,
    revoked_at    TIMESTAMPTZ,
    replaced_by   UUID REFERENCES refresh_tokens(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);

CREATE TABLE login_histories (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    login_id    VARCHAR(100) NOT NULL,
    is_success  BOOLEAN NOT NULL,
    fail_reason VARCHAR(50),
    channel     VARCHAR(20) NOT NULL,             -- 'WEB_USER' | 'WEB_ADMIN' | 'MOBILE'
    ip_address  VARCHAR(50),
    user_agent  VARCHAR(300),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_login_hist_user ON login_histories(user_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. 과정 변경 + 차시 영상
-- ----------------------------------------------------------------------------
ALTER TABLE courses
    ADD COLUMN course_type    course_type_enum NOT NULL DEFAULT 'TRACK',
    ADD COLUMN parent_course_id UUID REFERENCES courses(id),        -- TRACK → MAIN 연결(선택)
    ADD COLUMN study_period_days INT NOT NULL DEFAULT 90,
    ADD COLUMN thumbnail_url  VARCHAR(500),
    ADD COLUMN is_published   BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE course_videos (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id        UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    step_id          UUID REFERENCES curriculum_steps(id) ON DELETE SET NULL,
    title            VARCHAR(300) NOT NULL,
    source           video_source_enum NOT NULL,   -- 'HEYGEN' | 'YOUTUBE_EMBED' | 'OWN_HLS' | 'VIMEO'
    external_ref     VARCHAR(200),                 -- HeyGen 영상 ID / YouTube ID
    original_url     VARCHAR(500),
    embed_url        VARCHAR(500),                 -- 서버가 source+external_ref로 생성
    duration_seconds INT NOT NULL DEFAULT 0,
    display_order    INT NOT NULL DEFAULT 0,
    is_preview       BOOLEAN NOT NULL DEFAULT FALSE, -- 비로그인 미리보기 허용
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_course_videos_course ON course_videos(course_id, display_order);

CREATE TABLE video_progress (
    enrollment_id         UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    video_id              UUID NOT NULL REFERENCES course_videos(id) ON DELETE CASCADE,
    watched_seconds       INT NOT NULL DEFAULT 0,   -- 하트비트 적산 (HeyGen) / 구간 합산 (HLS)
    last_position_seconds INT NOT NULL DEFAULT 0,
    is_completed          BOOLEAN NOT NULL DEFAULT FALSE, -- watched >= duration * 0.8
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (enrollment_id, video_id)
);

-- ----------------------------------------------------------------------------
-- 5. 납부 / 환불 (1차 무통장 수동확인, PG 필드 예약)
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no        VARCHAR(40) UNIQUE NOT NULL,   -- 'EC24-20261019-000123'
    user_id         UUID NOT NULL REFERENCES users(id),
    enrollment_id   UUID NOT NULL REFERENCES course_enrollments(id),
    amount          INT NOT NULL CHECK (amount >= 0),
    method          payment_method_enum NOT NULL DEFAULT 'BANK_TRANSFER',
    status          payment_status_enum NOT NULL DEFAULT 'PENDING',
    depositor_name  VARCHAR(100),                  -- 입금자명
    due_at          TIMESTAMPTZ,                   -- 입금기한
    paid_at         TIMESTAMPTZ,
    confirmed_by    UUID REFERENCES users(id),     -- 입금확인 관리자
    pg_provider     VARCHAR(30),                   -- 'TOSS' (2차)
    pg_payment_key  VARCHAR(200),
    pg_raw_response JSONB,
    memo            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);
CREATE INDEX idx_payments_user ON payments(user_id);

CREATE TABLE refunds (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id     UUID NOT NULL REFERENCES payments(id),
    requested_by   UUID NOT NULL REFERENCES users(id),
    reason         TEXT NOT NULL,
    progress_rate_at_request NUMERIC(5,2),         -- 환불액 산정 근거
    refund_amount  INT,
    bank_name      VARCHAR(50),
    account_no_enc TEXT,                           -- AES-256-GCM 암호화
    account_holder VARCHAR(100),
    status         refund_status_enum NOT NULL DEFAULT 'REQUESTED',
    processed_by   UUID REFERENCES users(id),
    processed_at   TIMESTAMPTZ,
    reject_reason  TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. 자격증 신청 단계 추적 (마이페이지 타임라인)
-- ----------------------------------------------------------------------------
CREATE TABLE cert_applications (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id),
    course_id        UUID NOT NULL REFERENCES courses(id),
    eligibility_basis VARCHAR(30) NOT NULL,        -- 'THEORY_COMPLETED' | 'CAREGIVER_CERT'
    caregiver_cert_file_url VARCHAR(500),
    nurse_evaluation_id UUID,                      -- nurse_field_evaluations FK (IA 문서 DDL 반영 시 연결)
    status           cert_app_status_enum NOT NULL DEFAULT 'SUBMITTED',
    reviewer_id      UUID REFERENCES users(id),
    reject_reason    TEXT,
    certificate_id   UUID REFERENCES certificates(id),
    status_history   JSONB NOT NULL DEFAULT '[]',  -- [{status, at, by}]
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cert_app_status ON cert_applications(status);

-- ----------------------------------------------------------------------------
-- 7. 공지 / 팝업 공지 / 1:1 문의
-- ----------------------------------------------------------------------------
CREATE TABLE notices (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200) NOT NULL,
    content      TEXT NOT NULL,
    is_pinned    BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    view_count   INT NOT NULL DEFAULT 0,
    author_id    UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE TABLE popup_notices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    content_html    TEXT,
    image_url       VARCHAR(500),
    link_url        VARCHAR(500),
    target          popup_target_enum NOT NULL DEFAULT 'ALL',
    show_on_web     BOOLEAN NOT NULL DEFAULT TRUE,
    show_on_mobile  BOOLEAN NOT NULL DEFAULT TRUE,
    position_x      INT NOT NULL DEFAULT 40,
    position_y      INT NOT NULL DEFAULT 120,
    width           INT NOT NULL DEFAULT 480,
    priority        INT NOT NULL DEFAULT 0,
    allow_hide_today BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    author_id       UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (ends_at > starts_at)
);
CREATE INDEX idx_popup_active ON popup_notices(is_active, starts_at, ends_at);

CREATE TABLE inquiries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    category    VARCHAR(30) NOT NULL,             -- 'COURSE' | 'PAYMENT' | 'CERT' | 'ETC'
    title       VARCHAR(200) NOT NULL,
    content     TEXT NOT NULL,
    status      inquiry_status_enum NOT NULL DEFAULT 'OPEN',
    answer      TEXT,
    answered_by UUID REFERENCES users(id),
    answered_at TIMESTAMPTZ,
    ticket_id   UUID REFERENCES counseling_tickets(id), -- 콜센터 티켓 연계
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. 하드코딩 목업 → 기준 데이터 테이블 이관
-- ----------------------------------------------------------------------------
CREATE TABLE golden_rules (
    id         SERIAL PRIMARY KEY,
    rule_no    INT UNIQUE NOT NULL,               -- 1~10
    title      VARCHAR(100) NOT NULL,             -- 예: '탈건착환'
    description TEXT NOT NULL,
    bad_case   TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE caregiver_terms (
    id            SERIAL PRIMARY KEY,
    term          VARCHAR(100) NOT NULL,          -- 현장 용어 (예: '엘튜브')
    standard_term VARCHAR(150) NOT NULL,          -- 표준 용어 (예: 'L-tube(비위관)')
    category      VARCHAR(50) NOT NULL,
    definition    TEXT NOT NULL,
    care_point    TEXT,
    warning_alert TEXT,
    UNIQUE (term)
);

CREATE TABLE system_settings (
    key         VARCHAR(80) PRIMARY KEY,          -- 'CS_PHONE', 'BANK_ACCOUNT', 'ACADEMY_ADDRESS'
    value       TEXT NOT NULL,
    is_public   BOOLEAN NOT NULL DEFAULT FALSE,   -- GET /settings/public 노출 여부
    description TEXT,
    updated_by  UUID REFERENCES users(id),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ※ 비밀값(API 키·DB 비밀번호·JWT 시크릿)은 system_settings 가 아닌 .env 로만 관리
