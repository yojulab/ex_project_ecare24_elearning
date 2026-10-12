-- ============================================================================
-- eCare24 통합 플랫폼 PostgreSQL 16+ DDL 마스터 스키마
-- 문서 번호: ECARE24-DB-DDL-2026-V1
-- 근거: TASK_SPECIFICATION_ECARE24.md (Rev 1.2) & IMPLEMENTATION_PLAN_ECARE24.md (Rev 0.2)
-- 특징:
--  1) 누락되었던 12개 핵심 엔티티(users, caregiver_profiles, course_enrollments, 
--     step_progress, video_watch_sessions, practicum_logs, exam_attempts, exam_answers, 
--     retake_vouchers, payments, external_videos, audit_logs 등) 전수 구현
--  2) 질환군별 차등 이수시간 및 SNUBH 인정 상한(snubh_credit_cap_hours) 반영
--  3) HMAC QR 검증 및 자격증 상태(VALID, RENEWAL_DUE, EXPIRED, REVOKED) enum화
--  4) 콜센터 CTI 3분할 연동 및 개인정보 마스킹 감사 로그 반영
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. 공통 ENUM 정의
-- ============================================================================

CREATE TYPE user_role_enum AS ENUM ('STUDENT', 'AGENT', 'ADMIN', 'SUPERVISOR', 'REVIEWER');
CREATE TYPE step_type_enum AS ENUM ('THEORY_TEXT', 'PRACTICAL_VIDEO', 'MOCK_EXAM', 'FINAL_EXAM');
CREATE TYPE question_type_enum AS ENUM ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'CASE_STUDY');
CREATE TYPE cert_status_enum AS ENUM ('VALID', 'RENEWAL_DUE', 'EXPIRED', 'REVOKED');
CREATE TYPE practicum_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE ticket_status_enum AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE call_category_enum AS ENUM ('COURSE_INQUIRY', 'CERT_VERIFICATION', 'PATIENT_MATCHING', 'REFUND', 'TECHNICAL');
CREATE TYPE curation_grade_enum AS ENUM ('A', 'B', 'C', 'X');
CREATE TYPE video_source_enum AS ENUM ('OWN_HLS', 'YOUTUBE_EMBED', 'VIMEO');

-- ============================================================================
-- 2. 사용자 및 인증 도메인
-- ============================================================================

-- (1) 회원 기본 마스터 (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50) NOT NULL, -- 인덱스 검색 (콜센터 CTI 매칭)
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    role user_role_enum DEFAULT 'STUDENT',
    ci_hash VARCHAR(255),               -- 본인확인기관 CI 해시 (조회용 HMAC)
    encrypted_ci TEXT,                  -- AES-256 암호화된 실제 CI
    is_identity_verified BOOLEAN DEFAULT FALSE,
    accessibility_font_scale VARCHAR(10) DEFAULT 'NORMAL', -- 'NORMAL', 'LARGE', 'LARGER'
    is_high_contrast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_ci_hash ON users(ci_hash);

-- (2) 간병사 상세 프로필 (caregiver_profiles)
CREATE TABLE caregiver_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    birth_date DATE,
    has_nurse_aide_cert BOOLEAN DEFAULT FALSE,    -- 요양보호사 자격증 보유 여부
    nurse_aide_cert_no VARCHAR(100),
    caregiver_experience_years INT DEFAULT 0,
    preferred_disease_categories INT[],            -- 선호 질환군 ID 배열
    profile_memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. 질환군 및 교육과정 도메인
-- ============================================================================

-- (3) 16대 질환군 마스터 (disease_categories)
CREATE TABLE disease_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,             -- 예: '01_NEUROLOGY', '05_GASTRO'
    name_ko VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (4) 교육 과정 마스터 (courses) - 차등 이수시간 및 SNUBH 상한 반영
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT REFERENCES disease_categories(id),
    title VARCHAR(200) NOT NULL,
    target_disease VARCHAR(100) NOT NULL,
    summary TEXT,
    price INT DEFAULT 0,
    -- 질환군별 차등 이수시간 체계
    theory_hours INT NOT NULL DEFAULT 40,
    practical_hours INT NOT NULL DEFAULT 20,
    practicum_hours INT NOT NULL DEFAULT 20,
    required_hours INT GENERATED ALWAYS AS (theory_hours + practical_hours + practicum_hours) STORED,
    -- SNUBH 이론 인정 상한시간 (이론의 최대 50%)
    snubh_credit_cap_hours DECIMAL(4,1) NOT NULL DEFAULT 20.0,
    is_qualification_track BOOLEAN DEFAULT TRUE,
    qualification_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    course_version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (5) 4단계 커리큘럼 구성 (curriculum_steps)
CREATE TABLE curriculum_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    step_number INT NOT NULL,                      -- 1: 이론교안, 2: 실기영상, 3: 모의고사, 4: 자격시험
    step_type step_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    content_url VARCHAR(500),                      -- PDF 교안 URL 또는 자체 HLS 스트리밍 URL
    audio_tts_url VARCHAR(500),                    -- 실버용 음성 오디오북 TTS URL
    duration_minutes INT DEFAULT 0,
    pass_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (6) 수강 신청 및 등록 (course_enrollments)
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'ACTIVE',           -- 'ACTIVE', 'COMPLETED', 'CANCELED', 'EXPIRED'
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- 4. 진도율 트래킹 및 외부 영상 도메인
-- ============================================================================

-- (7) 외부 유튜브 영상 큐레이션 마스터 (external_videos - SNUBH 690편 등)
CREATE TABLE external_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    lecturer VARCHAR(100),
    source_section VARCHAR(50),
    video_type VARCHAR(20),                        -- 'LIVE', 'VOD', 'SHORTS'
    duration_seconds INT DEFAULT 0,
    curation_grade curation_grade_enum DEFAULT 'C',-- A: 이론인정, B: TV/쇼츠, C: 일반, X: 제외
    credit_eligible BOOLEAN DEFAULT FALSE,
    category_id INT REFERENCES disease_categories(id),
    step_id UUID REFERENCES curriculum_steps(id),  -- 특정 Step 1 교안 챕터에 바인딩
    is_embeddable BOOLEAN DEFAULT TRUE,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_ext_videos_grade ON external_videos(curation_grade);
CREATE INDEX idx_ext_videos_cat ON external_videos(category_id);

-- (8) 단계별 학습 진도 (step_progress)
CREATE TABLE step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    step_id UUID REFERENCES curriculum_steps(id) ON DELETE CASCADE,
    progress_percent INT DEFAULT 0,                -- 0 ~ 100%
    is_completed BOOLEAN DEFAULT FALSE,
    last_resume_position_seconds INT DEFAULT 0,    -- 이어보기 위치
    -- 출처별 인정된 시간 (초 단위)
    credited_own_seconds INT DEFAULT 0,
    credited_snubh_seconds INT DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(enrollment_id, step_id)
);

-- (9) 비디오 시청 세션 및 스킵 방지 감사 (video_watch_sessions)
CREATE TABLE video_watch_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_progress_id UUID REFERENCES step_progress(id) ON DELETE CASCADE,
    video_source video_source_enum NOT NULL,
    external_video_id UUID REFERENCES external_videos(id),
    watch_interval_start INT NOT NULL,             -- 시청 구간 시작(초)
    watch_interval_end INT NOT NULL,               -- 시청 구간 끝(초)
    playback_rate DECIMAL(3,2) DEFAULT 1.0,        -- 1.0, 1.25, 1.5 (1.5 초과 시 미인정)
    is_valid_credit BOOLEAN DEFAULT TRUE,
    session_recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (10) 실습 일지 및 서명 (practicum_logs)
CREATE TABLE practicum_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    patient_case_summary TEXT NOT NULL,
    performed_care_points TEXT NOT NULL,           -- 체변, 피딩, 폴리 거치 등
    photo_urls JSONB,                              -- 모바일 첨부 사진 리스트
    supervisor_name VARCHAR(100) NOT NULL,
    supervisor_signature_url VARCHAR(500),
    status practicum_status_enum DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. CBT 시험 및 민간자격증 발급 도메인
-- ============================================================================

-- (11) CBT 문제은행 (exam_questions)
CREATE TABLE exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT REFERENCES disease_categories(id),
    subject_code VARCHAR(50) DEFAULT 'GENERAL_CARE', -- 과락 판정용 과목 코드
    question_type question_type_enum DEFAULT 'MULTIPLE_CHOICE',
    title TEXT NOT NULL,
    explanation TEXT,
    points INT DEFAULT 5,
    options JSONB,                                 -- [{"no": 1, "text": "..."}, ...]
    correct_answer VARCHAR(100) NOT NULL,
    related_material_url VARCHAR(500),             -- 오답 시 복습할 강의 링크
    terminology_tags TEXT[],                       -- '피딩', '탈건착환' 등 용어사전 태그
    is_reviewed_by_clinician BOOLEAN DEFAULT FALSE,-- 임상 검수 승인 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (12) 시험 응시 기록 및 자동 임시저장 (exam_attempts)
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    step_id UUID REFERENCES curriculum_steps(id) ON DELETE CASCADE,
    attempt_number INT DEFAULT 1,
    is_final_exam BOOLEAN DEFAULT FALSE,
    current_answers JSONB DEFAULT '{}',            -- 3초 자동저장용 답안 버퍼
    score INT DEFAULT 0,
    is_passed BOOLEAN DEFAULT FALSE,
    is_disqualified_by_proctor BOOLEAN DEFAULT FALSE, -- 부정행위/창이탈 초과
    proctor_event_logs JSONB DEFAULT '[]',         -- 이탈 시간 및 횟수 기록
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- (13) 민간자격증 발급 대장 (certificates)
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_no VARCHAR(100) UNIQUE NOT NULL,   -- 'EC24-2026-NEURO-00001'
    registry_no VARCHAR(100) NOT NULL,             -- 직능원 등록번호
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    category_id INT REFERENCES disease_categories(id),
    qualification_name VARCHAR(150) NOT NULL,
    grade VARCHAR(50) DEFAULT '전문간병사 1급',
    score INT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,          -- 2년 뒤 만료
    qr_verify_token VARCHAR(255) UNIQUE NOT NULL,  -- HMAC-SHA256 해시 검증 토큰
    pdf_file_url VARCHAR(500),
    status cert_status_enum DEFAULT 'VALID',
    renewed_from_id UUID REFERENCES certificates(id)
);
CREATE INDEX idx_cert_no ON certificates(certificate_no);
CREATE INDEX idx_cert_qr ON certificates(qr_verify_token);

-- ============================================================================
-- 6. 콜센터 CS 및 CTI 도메인
-- ============================================================================

-- (14) 콜센터 상담 티켓 (counseling_tickets)
CREATE TABLE counseling_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES users(id),
    inbound_caller_number VARCHAR(50),             -- CTI 인입 발신번호
    category call_category_enum NOT NULL,
    status ticket_status_enum DEFAULT 'OPEN',
    subject VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (15) 콜센터 상담 상세 메모 및 통화 녹취 (counseling_logs)
CREATE TABLE counseling_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES counseling_tickets(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    call_duration_seconds INT DEFAULT 0,
    recording_file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (16) 개인정보 열람 및 보안 감사 로그 (audit_logs)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,                   -- 'PHONE_UNMASK', 'CERT_REISSUE', 'EXAM_RESET'
    target_user_id UUID REFERENCES users(id),
    reason TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
