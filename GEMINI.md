# GEMINI.md — eCare24 이러닝 프로젝트 하네스 헌장

> **Antigravity & Gemini 하네스 엔지니어링 시스템 가동 중**
> 본 프로젝트는 Claude Code의 `revfactory/harness` 및 `ralph-loop` 아키텍처를 Google Antigravity 및 Gemini 실행 환경에 맞춰 완벽히 재구성하고, **`TASK_SPECIFICATION_ECARE24.md` (Rev 1.2)** 업무지시서와 **`caregiver_terminology_dictionary.md`** 임상 전문 용어 사전, 그리고 **의뢰자 소통용 UI 태깅 인스펙션 시스템**에 최적화된 하네스 규칙 체계를 준수합니다.

---

## 1. 하네스 시스템 트리거 및 라우팅 포인터

사용자의 요청 키워드에 따라 아래 스킬과 룰을 즉시 참조하여 작업을 수행합니다:

| 사용자 요청 키워드 | 대상 스킬 / 룰 | 설명 |
| :--- | :--- | :--- |
| **"하네스 구성해줘"**, **"하네스 설계"**, **"에이전트 팀 만들어줘"** | [.agents/skills/harness/SKILL.md](file:///apps/project_ecare24_elearning/.agents/skills/harness/SKILL.md) | 프로젝트 도메인 분석 후 최적의 에이전트 팀과 스킬 설계 |
| **"하네스 회고"**, **"하네스 피드백 반영"**, **"하네스 진화"** | [.agents/skills/harness-evolve/SKILL.md](file:///apps/project_ecare24_elearning/.agents/skills/harness-evolve/SKILL.md) | 실행 델타 포착, 원리 일반화, 룰 및 에이전트 지속 개선 |
| **"루프 실행"**, **"ralph loop"**, **"끝날 때까지 반복"**, **"자율 루프"** | [.agents/skills/ralph-loop/SKILL.md](file:///apps/project_ecare24_elearning/.agents/skills/ralph-loop/SKILL.md) | Ralph Loop 자율 반복 실행, 완료 약속 및 서킷 브레이커 관리 |
| **UI 일련번호 태깅 & 단축키 인스펙션** | [.agents/rules/ui-tagging-inspection.md](file:///apps/project_ecare24_elearning/.agents/rules/ui-tagging-inspection.md) | 페이지/태그 일련번호 체계, `Alt+I` 단축키 토글, 뱃지 클릭 시 복사 |
| **간병 임상 용어 사전 & 10대 골든 룰** | [.agents/rules/caregiver-terminology.md](file:///apps/project_ecare24_elearning/.agents/rules/caregiver-terminology.md) | [caregiver_terminology_dictionary.md](file:///apps/project_ecare24_elearning/docs/caregiver_terminology_dictionary.md) 기반 임상 전문 용어, 약어 및 10대 골든 룰 |
| **eCare24 도메인 & PRD 규격** | [.agents/rules/ecare24-domain.md](file:///apps/project_ecare24_elearning/.agents/rules/ecare24-domain.md) | 16대 질환군, 실버 UX, 콜센터 3분할, 자격증, 간병24TV, DB DDL 스펙 |
| **Git 커밋 규약 & 업무 종료 수칙** | [.agents/rules/git-workflow.md](file:///apps/project_ecare24_elearning/.agents/rules/git-workflow.md) | 업무 종료 시 Git Commit 필수화, 원자적 커밋, 메시지 컨벤션 |
| **하네스 아키텍처 & 품질 원칙** | [.agents/rules/harness-engineering.md](file:///apps/project_ecare24_elearning/.agents/rules/harness-engineering.md) | 6대 팀 패턴, 5대 품질 검증, 점진적 공개 원칙 |
| **루프 엔지니어링 원칙 & 서킷 브레이커** | [.agents/rules/loop-engineering.md](file:///apps/project_ecare24_elearning/.agents/rules/loop-engineering.md) | Iteration > Perfection, 상태 디스크 영속화, 서킷 브레이커 규정 |

---

## 2. eCare24 핵심 업무 지시 원칙 및 개발 가드레일

1. **기획 및 상세 아키텍처 수립 단계 준수 (비개발 원칙)**:
   - **※ 본 단계에서는 실제 소스코드 개발을 진행하지 않습니다.**
   - 개발팀, 기획팀, 인프라팀이 상호 합의하고 즉시 스프린트에 착수할 수 있도록 구체적인 스펙, WBS, 인터페이스 정의 및 아키텍처 수립에 집중합니다.
2. **의뢰자 소통용 UI 일련번호 태깅 및 4대 정보 뱃지 복사 규정**:
   - 모든 화면과 컴포넌트 태그에 고유 일련번호(`[P01-SEC01-BTN01]`)를 부여합니다.
   - 단축키 **`Alt + I`**로 뱃지 표시/숨김 토글을 지원하고, **뱃지 클릭 시 4대 핵심 정보(일련번호, 페이지명, URI, 항목명)가 클립보드에 자동 복사(Copy)**되어 의뢰자가 피드백에 1초 만에 활용할 수 있도록 구현합니다.
3. **간병 실무 필수 전문 용어 및 10대 골든 룰 준수**:
   - 모든 교안, CBT 시험 문항, 콜센터 상담 템플릿 작성 시 [caregiver_terminology_dictionary.md](file:///apps/project_ecare24_elearning/docs/caregiver_terminology_dictionary.md)의 전문 용어(피딩, 엘튜브, PEG, 폴리, 유린백, 체변, 앙와위/측위 등)와 **"현장 압축 10대 골든 룰"**(탈건착환, q2hr 체변, 유린백 방광 하단 거치, 석션 15초 이내 등)을 절대 준수합니다.
4. **알맞은 업무 종료 시 Git Commit 의무화**:
   - 모든 에이전트는 기획/아키텍처 문서 생성, 룰 갱신, 검증 완료 등 유의미한 작업 단위를 완수했을 때 **반드시 원자적 Git Commit을 수행**합니다.
   - 커밋 전 `.env` 등 민감 정보 누출 방지 및 `.gitignore` 적용 여부를 엄격히 확인합니다.
5. **4대 프로젝트 타겟 분리 구조**:
   - `frontend_user/` (수강생 포털, 실버 친화적 초직관 UX, WCAG AAA)
   - `frontend_admin/` (관리자 & 콜센터 CS 3분할 원스크린, CTI 단축키 연동)
   - `backend/` (NestJS Clean Architecture, 8대 핵심 모듈, PostgreSQL 16+ DDL)
   - `mobileApp/` (React Native 실버 터치, 오프라인 교안 캐싱, 숏폼 스와이프)
   - `tests/` (Playwright Headless 중요 화면 자동 캡처 슈트)
6. **Playwright Headless 무인 자동 검증 및 중요 화면 캡처 원칙**:
   - 화면/기능 변경 시 `npm run test:capture`(`tests/capture_screens.js`)를 실행하여 수강생 웹(10개), 관리자/CS 포털(7개), 모바일 시뮬레이터(3개), 백엔드 API 문서(1개) 등 **총 21개 중요 화면의 무결성(HTTP 200, 렌더링 에러 0건)을 기계적으로 자동 캡처·검증**하고 스냅샷(`tests/snapshots/`)과 검증 리포트(`VERIFICATION_REPORT.md`)를 갱신 보존한다.
   - Linux arm64 컨테이너 환경의 안정적 무인 실행을 위해 필수 브라우저 4대 런치 옵션(`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`)을 준수한다.

---

## 3. eCare24 하네스 전담 에이전트 팀 (Roles)

| 에이전트 롤 | 모델 티어 | 주 임무 및 전담 산출물 |
| :--- | :--- | :--- |
| **System Architect** | Gemini Pro | 전체 4대 멀티 프로젝트 구조, DB DDL 스키마, .env 규격, .vscode 통합 디버그 환경 설계 |
| **Silver UX Specialist** | Gemini Pro/Flash | 수강생 포털(`frontend_user`) 및 모바일앱 실버 접근성(폰트 조절 `[가-/가/가+]`, 고대비, OMR CBT, 이어보기, 용어 툴팁, **UI 일련번호 태깅 명세**) |
| **Callcenter CS Specialist** | Gemini Pro/Flash | 관리자 및 콜센터 포털(`frontend_admin`) 3분할 원스크린 레이아웃, CTI 팝업 연동, 상담 단축키(Alt+1~3, Alt+S), 임상 약어 템플릿, **콜센터 UI 일련번호 설계** |
| **Caregiver Cert Specialist** | Gemini Pro | 16대 질환군 4단계 커리큘럼, 직능원(pqi.or.kr) 민간자격 관리규정, CBT 출제 및 과락 판정 엔진, 임상 용어 Care Point 반영 |
| **Media TV24 Specialist** | Gemini Flash | 간병24TV 유튜브 API 연동, 1분 숏폼 스와이프 플레이어 및 무료 교안 유입 퍼널 설계 |
| **Quality & E2E Assurer** | Gemini Pro | Playwright Headless 21개 중요 화면 자동 캡처 슈트(`test:capture`), **UI 일련번호 기반 안정적 셀렉터 검증**, 보안/개인정보 암호화 감사 |

---

## 4. 하네스 변경 이력 (Harness Changelog)

| 일자 | 변경 내용 | 대상 | 사유 |
| :--- | :--- | :--- | :--- |
| **2026-10-12** | Gemini 맞춤형 하네스 규칙 체계 최초 수립 | 전체 하네스 시스템 | Claude Code `harness@harness-marketplace` 기반 Gemini/Antigravity 환경으로 완벽 재구성 |
| **2026-10-12** | 루프 엔지니어링(Ralph Loop) 체계 추가 구성 | `ralph-loop` 스킬, `loop-engineering.md`, `hooks.json` | `ralph-loop@claude-plugins-official` 아키텍처를 Antigravity Stop Hook, Fresh Context Bash 러너 및 서킷 브레이커로 완벽 재구성 |
| **2026-10-12** | eCare24 PRD 사양 반영 및 Git Commit 의무화 | `ecare24-domain.md`, `git-workflow.md`, `GEMINI.md`, `AGENTS.md` | `TASK_SPECIFICATION_ECARE24.md` (Rev 1.2) 업무지시서 요구사항 완벽 반영 및 업무 종료 시 Git commit 룰 탑재 |
| **2026-10-12** | 간병 실무 필수 전문 용어 사전 룰 연동 | `caregiver-terminology.md`, `ecare24-domain.md`, `GEMINI.md`, `AGENTS.md` | `caregiver_terminology_dictionary.md` 기반 임상 전문 용어 및 10대 골든 룰 준수 체계 탑재 |
| **2026-10-12** | 의뢰자 소통용 UI 태깅 & 인스펙션 뱃지 시스템 구축 | `ui-tagging-inspection.md`, `ecare24-domain.md`, `GEMINI.md`, `AGENTS.md` | 의뢰자-에이전트 간 정밀 피드백을 위한 페이지/태그 일련번호 체계, `Alt+I` 단축키 토글, 뱃지 클릭 복사(Copy) 규격 수립 |
| **2026-10-13** | 한국돌봄종사자양성학원 웹·앱 메뉴/디자인 전면 개편 | `REVISED_IA_AND_MENU_SPECIFICATION.md`, `ecare24-domain.md`, `GEMINI.md` | nllc-edu 분석 기반 잡다한 메뉴 제거, 단일 수강신청, 160h+80h 이원화, 간호사 실습평가서 조건, 분당서울대병원 돌봄지침서 메뉴 탑재 |
| **2026-10-13** | 한국돌봄종사자양성교육원 6대 메뉴/내용 고도화 보완 | `frontend_user`, `mobileApp`, `REVISED_IA_AND_MENU_SPECIFICATION.md`, `GEMINI.md` | 학원→교육원 명칭 변경, 배경색 `#f8fafc` 통일, 홈 단순화/계층화, 실버 폰트 스케일 확대(16/22/28px), 16대 자격 트랙 각 8h 개편, ecarecti 참조 교육원소개 5대 하위메뉴 탑재 |
| **2026-10-13** | 교육원소개/교육체계 독립 페이지화 & 메뉴 간결화 | `frontend_user`, `mobileApp`, `REVISED_IA_AND_MENU_SPECIFICATION.md`, `GEMINI.md` | 교육원소개 드롭다운 제거 및 /about 별도페이지화, 수강신청 중복메뉴 삭제, 교육 체계 /curriculum 상단 수강신청~수료 절차도 탑재, 돌봄 지침서 명칭 간결화 |
| **2026-10-13** | 실버 폰트 겹침 해결 & 병원명·홈 UI 정돈 | 전체 웹/앱/관리자 | 실버 접근성 폰트 확대 시 텍스트 겹침 방지(줄간격/컨테이너 신축), '분당서울대병원' 문구 ➔ '대학병원 표준 임상' 대체, 돌봄지침서 편수 뱃지 삭제, 공식 교육포털 탑바 이동, 16대 트랙 중복문구 및 690편 버튼 삭제 |
| **2026-10-13** | 홈 16개 트랙 카드 삭제 및 '수강신청' 용어 정돈 | `frontend_user`, `REVISED_IA_AND_MENU_SPECIFICATION.md`, `GEMINI.md` | 홈에서 '질환별 전문 돌봄 교육과정(16개 카드)' 완전 삭제(/curriculum 일원화), '단일 수강신청' ➔ '수강신청' 용어 통일 |
| **2026-10-13** | 모바일 앱 홈 질환별 카드 삭제 및 수강신청 일원화 | `mobileApp`, `HomeScreen.tsx`, `GEMINI.md` | 모바일 앱 홈에서도 '16대 질환군 전문과정' 카드 그리드 완전 삭제, '돌봄종사자 수강신청 바로가기' 및 '교육원 소개' 배너로 일원화 |
| **2026-10-13** | 포트별 개별 및 일괄 컴파일/기동 스크립트 구축 | `run_port.sh`, `compile.sh`, `package.json` | 모든 포트(30010, 30011, 30012) 일괄/개별 dev 기동 및 build 컴파일 sh 제공 (대화형 CLI 메뉴, 0.0.0.0 바인딩 지원) |
| **2026-10-13** | 운영 서버 프로덕션(Production) 모드 전면 전환 | `run_port.sh`, `start_server.sh`, `package.json`, `README.md` | NODE_ENV=production 기본화, BUILD_ID 자동 검증 및 클린 빌드, Next.js start 및 Vite preview 프로덕션 서빙 구축 |
| **2026-10-13** | 셸 스크립트 대폭 단순화 및 compile/port 관리 단일화 통합 | `run_port.sh`, `compile.sh`, `start_server.sh`, `stop_server.sh`, `restart_server.sh`, `README.md` | 850줄의 비대한 스크립트를 250줄의 직관적 통합 스크립트로 단순화, compile/start/dev/stop/restart/status 일관 문법 지원 |
| **2026-10-13** | 개별 패키지 빌드 이슈 해결 및 폰트 CDN 정규화 | `mobileApp`, `frontend_user`, `frontend_admin`, `package.json` | Google Fonts 부재 Pretendard 제거 및 jsdelivr 분리(400 에러 해결), postinstall .bin 자동 링크(vite: not found 방지), TS antd 모듈 인식 보장 |
| **2026-10-13** | 외부 도메인 차단 방지 Vite allowedHosts 전체 허용 | `frontend_admin/vite.config.ts`, `mobileApp/vite.config.ts`, `GEMINI.md` | third.axfoundly.com 등 터널/외부 호스트 차단 방지를 위해 server 및 preview allowedHosts: true 전면 적용 |
| **2026-10-13** | UI 인스펙터 뱃지 복사 시 4대 정보(일련번호, 페이지명, URI, 항목명) 확장 | `packages/utils/uiTagHelper.ts`, `UiBadge.tsx`, `ui-tagging-inspection.md`, `GEMINI.md` | 뱃지 클릭 시 단일 ID 대신 일련번호, 페이지명, URI, 항목명이 정돈된 텍스트로 자동 추출·복사되도록 고도화 |
| **2026-10-16** | UI inspect 시스템 규격 고도화 및 용어·사이즈·위치 통일 | 전체 웹/앱/관리자/규칙, `docs/UI-Inspects.md` | 'UI inspect' 용어 통일, 뱃지 사이즈 9.5px/2.5px 5.5px 콤팩트화, 관리자 좌측 메뉴 뱃지 좌상단 핀 위치 일치화 |
| **2026-10-17** | UI inspect 복사 문구 형식 고도화 및 SPA 해시(#tab=...) 딥링킹 | `packages/utils/uiTagHelper.ts`, `mobileApp`, `frontend_admin`, `frontend_user`, `UI-Inspects.md` | 복사 시 `{페이지명} ({화면코드}) - {서비스명}` 결합, 모바일/관리자 탭 전환 시 URL hash 실시간 동기화, 항목명 사전 매핑 탑재 |
| **2026-10-19** | 메뉴 보완(마이페이지·로그인·관리자 LNB) 및 RESTful backend 구성 계획 수립 | `docs/architecture/BACKEND_AND_MENU_PLAN.md`, `ddl/02_auth_payment_admin_schema.sql` | NestJS+TypeORM, 역할 없는 사용자별 권한 리스트, 무통장 납부, 목업 전면 정리·DB 시드 명령, .env 규격, HeyGen 영상 연동 설계 |
| **2026-10-19** | RESTful backend 구축 및 권한 매트릭스·마이페이지·관리자 LNB 전면 연동 | `backend`, `frontend_admin`, `frontend_user`, `mobileApp`, `GEMINI.md` | NestJS 10 RESTful API(:30013), PostgreSQL 17 DB/시드(25개 권한 마스터, HeyGen 2편 바인딩), 학생 마이페이지(6개 탭), 관리자 LNB 10개 메뉴 및 무통장 입금확인/권한매트릭스 화면 연동 완료 |
| **2026-10-19** | Playwright Headless 21개 중요 화면 자동 캡처 검증 및 무인 환경 이슈 해결 | `tests/capture_screens.js`, `tests/snapshots/`, `GEMINI.md`, `AGENTS.md` | Linux arm64 컨테이너 전용 4대 옵션(--no-sandbox 등) 적용, 21개 전 화면 100% 캡처 및 검증 리포트 자동 생성 구축 |
| **2026-10-19** | 세세한 엔티티 관계도 검증 및 수강/결제 라이프사이클 이슈 해결 | `backend` 엔티티, `frontend_user`, `docs/architecture/ENTITY_RELATIONSHIP_VERIFICATION.md`, `GEMINI.md` | TypeORM 양방향 Relation 보강(User, Course, Category, Cert, Inquiry), enrollment PENDING 상태 전이 및 마이페이지 동적 수강목록 연동, E2E 라이프사이클 100% 입증 |
| **2026-10-19** | 엔터프라이즈 백엔드 REST API 포트 30013 -> 30014 전면 이전 및 검증 | `backend`, `frontend_admin`, `frontend_user`, `run_port.sh`, `package.json`, `tests` | 백엔드 API 기본 포트를 30014로 변경, run_port.sh/Swagger/관리자/수강생 포털 연동 완료 및 Playwright 21개 전 화면 100% 무결성 검증 통과 |
| **2026-10-19** | 각 서버 주요 환경 변수 .env 관리 일원화 및 코드 내 하드코딩 URI 전면 정리 | 전체 서버/웹/앱/테스트, `.env.example`, `src/config/env.ts` | REST API 엔드포인트 URI 환경 변수화(NEXT_PUBLIC_API_BASE_URL, VITE_API_BASE_URL, EXPO_PUBLIC_API_URL), 패키지별 .env/.env.example 구축, Playwright 21개 전 화면 무결성 검증 완료 |
| **2026-10-19** | 백엔드 모든 IP 접속 허용 (CORS_ORIGINS=*) 및 launch.json 백엔드 통합 | `backend/.env`, `main.ts`, `.vscode/launch.json`, `.env.example` | CORS_ORIGINS=* 설정 및 origin 리플렉트 credentials 지원, launch.json에 백엔드:30014 및 Fullstack 4개 서버 복합 디버거 구성, Playwright 21개 전 화면 100% 검증 통과 |
| **2026-10-19** | 실제 DB 초기값 13개 마스터/운영 데이터 완비 및 REST API·프론트엔드 실연동 무결성 검증 | `backend`, `frontend_admin`, `frontend_user`, `mobileApp`, `VERIFICATION_REPORT.md` | 공지사항(4건)·팝업(2건)·자격증(2건)·문의(2건)·상담(3건) 및 18개 교육과정 DB 초기값 완비, 관리자 자격증대장/교육체계/지갑 실데이터 연동, Playwright 21개 전 화면 100% 무결성 통과 |
| **2026-10-19** | 실제 데이터 입력·수정 5대 시나리오 DB 모니터링 및 UI 적용 검증 완료 | `scripts/db_monitor.js`, `mcp_config.json`, `tests/snapshots/`, `GEMINI.md` | 수강신청·입금승인·1:1문의답변·긴급팝업·권한변경 5대 시나리오 DB Diff/KPI 실시간 추적 및 관리자/수강생/모바일 UI 변화 검증, Playwright 21개 전 화면 100% 통과 |
| **2026-10-19** | 실 데이터 구성 보완 4대 사항(관리자 등록 챕터 노출·문구형 교안·HeyGen 영상·실제 시험 실시간 통과) 적용 및 검증 완료 | `backend`, `frontend_user`, `frontend_admin`, `tests/snapshots/`, `GEMINI.md` | 관리자 등록 챕터만 수강생 포털 동적 노출(/curriculum), TTS 대신 5대 단원 문구형 교안(P03), 제공 링크 HeyGen 실제 VOD 인라인 재생(P04), 실제 CBT 5대 임상 문항 출제 및 실시간 즉시 합격/모바일 자격증 발급(P08) 완비 |
| **2026-10-21** | 회의 수정요청(CR) 4건 및 16개 자격증 체계 보완 계획 수립 완료 | `docs/architecture/PHASE2_CHANGE_REQUEST_PLAN.md`, `ddl/03_phase2_change_request.sql`, `GEMINI.md` | 지침서 메뉴 삭제→공통수칙 흡수, 롱폼→숏폼 마이크로러닝, 20문항 소그룹 CBT, 실데이터 3종 검증, 이론+실습 이수 게이트 등 전 서버 보완 계획서 승인 및 DDL 명세 완비 |
| **2026-10-21** | Playwright Headless 전 서버 기능 무결성 종합 검증 및 21개 스냅샷 100% 통과 | `tests/comprehensive_e2e_inspection.js`, `tests/snapshots/`, `GEMINI.md` | 백엔드 JWT 인증·공개/보호 API, 수강생 실버 UX(폰트/고대비/인스펙트), HeyGen 인라인 VOD, CBT 시험/실시간 합격증, 관리자 10대 메뉴/승인, 모바일 탭 등 총 41개 항목 무결성(이슈 0건) 입증 |
| **2026-10-22** | 공식 3대 실데이터 트랙 전면 구축 및 관리자/수강생/모바일/백엔드 개편 | `backend`, `frontend_admin`, `frontend_user`, `mobileApp`, `packages/utils`, `GEMINI.md` | 제공된 3개 실데이터 트랙(폐질환·치매·근골격계) 외 모든 목업 제거, 15개 챕터 교안/HeyGen VOD·스크립트/180문항 CBT 문제은행 적재, 관리자 교안·VOD·문제은행 인스펙터 고도화 및 Playwright 21개 전 화면 100% 무결성 검증 통과 |
| **2026-10-22** | 등록·수정·삭제(CRUD) 기능 보완 및 Playwright 5대 시나리오 무인 검증 100% 통과 | `backend`, `frontend_admin`, `tests/test_crud_scenarios.js`, `GEMINI.md` | 팝업·트랙·문제은행·수강결제·문의 CRUD 엔드포인트 및 관리자 UI 구축, 계정 시드/모달 오버레이 이슈 해결, Playwright Headless 5대 시나리오(12개 스냅샷) 100% PASS 입증 |
| **2026-10-22** | 회원가입·돌봄지킴이삭제·HeyGen문구삭제·P22문제은행 모의/평가 탭 분리 완비 | 전 프로젝트 (`user`, `admin`, `mobile`, `backend`), `tests`, `GEMINI.md` | 수강생/관리자/모바일 회원가입·로그인·로그아웃 전면 연동, '돌봄 지침서/지킴이' 메뉴 웹/앱 완전 삭제, HeyGen 외래 문구 완전 삭제 및 표준 임상 VOD 대체, [P22-SEC02-DET01] 모의(30)/평가(30) 탭 분리 및 입력/수정 모달 구축, Playwright 20개 전 항목 100% PASS 및 21개 전 화면 캡처 검증 완료 |
| **2026-10-22** | 관리자 4대 추가 고도화(P50 통합대시보드 고도화·LNB 아이콘화 토글·P22 트랙추가/숨김/페이지네이션·P22-SEC02-DET01 상세화면 분리) 완비 | `frontend_admin`, `CurriculumManager.tsx`, `DashboardScreen.tsx`, `App.tsx`, `tests`, `GEMINI.md` | 대시보드 5대 KPI·트랙별 진도율 통계(P50-SEC02-STATS)·원클릭 퀵액션(P50-SEC03-QUICK)·실시간 학사 피드(P50-SEC04-FEED) 고도화, LNB 아이콘화 토글(P50-LNB-TOGGLE, w-16/w-64) 및 툴팁 구현, P22-SEC01-TTL01 신규 트랙 추가(P22-SEC01-BTN-ADD)·숨김 스위치·노출 필터·페이지네이션 지원, P22-SEC01-CRD01 트랙 카드 클릭 시 별도 상세화면(P22-SEC02-DET01) 분리 및 뒤로가기(P22-SEC02-BTN-BACK) 네비게이션 연동, Playwright 17개 전 항목 100% PASS 및 21개 중요 화면 캡처 통과 |
| **2026-10-22** | 로그인 세션 관리 전면 보완(수강생·관리자·앱) 및 마이페이지 비로그인 가드 & 실회원정보 연동 완비 | 전 프로젝트 (`user`, `admin`, `mobile`, `backend`), `tests`, `GEMINI.md` | 초기 강제 데모 계정 주입 제거, 로그아웃 시 GNB 마이페이지 메뉴 소멸([P00-SEC01-LNK06]), 비로그인 상태 /mypage 진입 차단 및 로그인 가드 카드([P10-SEC00-BTN-LOGIN]), 로그인 시 실제 로그인 회원(성명·아이디·연락처·이메일·수강목록) 정확한 실데이터 바인딩, 관리자 비로그인 대시보드 차단 및 관리자 인증 가드 뷰([P50-SEC00-BTN-LOGIN]), 모바일 마이페이지 비로그인 가드 카드([P48-SEC00-CRD-LOGIN]), Playwright 15개 전 항목 100% PASS 및 21개 중요 화면 캡처 통과 |
| **2026-10-23** | DB 초기화 환경 변수 backend/.env 최우선 로드 및 최고관리자(SEED_SUPER_ADMIN_*) 동적 주입 완비 | `backend` (db-client.helper, init-db, reset-db, seed-runner, app.module), `GEMINI.md` | 실행 위치와 무관하게 backend/.env 최우선 로드, SEED_SUPER_ADMIN_LOGIN_ID/PASSWORD 기반 최고관리자 계정 생성 및 25개 전권 부여, CLI 플래그 보존 및 db:reset:force 무결성 검증 완료 |
| **2026-10-23** | 개발/운영 DB 일원화(에러 착시 제거 및 슈퍼유저 자동 프로비저닝 Self-Healing) 완비 | `db-client.helper.ts`, `backend/.env`, `generate_env.sh`, `README.md`, `GEMINI.md` | 호스트별 상세 에러 로깅으로 착시 방지, ecare24_app/ecare24 부재 시 admin 슈퍼유저로 자동 생성 및 age 확장 활성화, 개발·운영 무수정 통합 구동 완비 |
| **2026-10-23** | 운영 28P01(없는 계정도 비밀번호 불일치로 응답) 대응 및 운영용 generate_env.sh 정합화 | `db-client.helper.ts`, `scripts/generate_env.sh`, `README.md`, `GEMINI.md` | 28P01도 프로비저닝 트리거(CREATE/ALTER ROLE), 관리자 계정별 실패 사유 로깅, 리터럴/식별자 안전 이스케이프, 호스트당 1회 프로비저닝, 운영 DB_HOST=컨테이너명 기본화 및 DB_ADMIN_*/DB_* 실행 시 환경변수 override 지원 |
| **2026-10-23** | 개발/운영 DB 완벽 분기(운영 성공 문장 양식 반영 및 generate_env.sh dev/prod 분기) 완비 | `db-client.helper.ts`, `scripts/generate_env.sh`, `README.md`, `GEMINI.md` | 운영 서버 성공 문구(감지된 .env 타겟 설정/계정·DB 생성완료) 동일 양식 적용, NODE_ENV 기반 호스트/슈퍼유저 1순위 분기, generate_env.sh dev/prod 모드별 .env 동적 생성 완비 |
| **2026-10-23** | 원클릭 데모 Failed to fetch 해결 및 Next.js/Vite 내부 리버스 프록시(/api/v1) 체계 완비 | `next.config.js`, `vite.config.ts`, `env.ts`, `AuthModal.tsx`, `GEMINI.md` | 브라우저-백엔드 간 포트포워딩 누락/CORS/Mixed Content 차단 원천 해결을 위해 Next.js rewrites 및 Vite proxy 구축, 브라우저 클라이언트 Same-Origin(/api/v1) 상대경로 연동, 데모 계정(student01, student02) 200 OK 인증 검증 완료 |
| **2026-10-23** | 모바일 앱(mobileApp) 로그인 하드코딩 URL 제거 및 Vite 프록시(/api/v1) 실연동 완비 | `MobileAuthModal.tsx`, `MyScreen.tsx`, `GEMINI.md` | MobileAuthModal 및 MyScreen 내 하드코딩된 'http://localhost:30014'를 ENV.API_BASE_URL(/api/v1)로 전면 교체, Vite 30012 리버스 프록시를 통한 모바일 로그인 및 me/summary 200 OK 정상 동작 검증 완료 |
| **2026-10-24** | 운영 서버 로그인 JSON 파싱 오류(Unexpected token 'I' 및 Unexpected end of JSON input) 완전 해결 및 안전 API 통신 체계 구축 | `frontend_user`, `mobileApp`, `frontend_admin`, `packages/utils`, `scripts/generate_env.sh`, `GEMINI.md` | 환경변수(NEXT_PUBLIC_/VITE_API_BASE_URL) 브라우저 최우선 사용, Next.js/Vite 프록시 backendTarget 동적화, safeFetchJson 도입을 통한 500/502/0바이트 응답 파싱 예외 원천 방어 및 다중 Failover 보강 완비 |
| **2026-10-24** | DB 초기화 검증 및 DB Admin(스키마 초기화)/앱(데이터 접근) 분리 및 개발·운영 호스트명 일원화 완비 | `backend/.env`, `db-client.helper.ts`, `init-db.ts`, `reset-db.ts`, `generate_env.sh`, `db_monitor.js`, `GEMINI.md` | backend/.env를 단일 진실 공급원으로 일원화, DB admin(admin/admin123/db_graphrag_agent)을 스키마 초기화(DDL/Reset) 전용으로 적용, 앱 접근 정보(ecare24_app/ecare24)를 데이터 접근 전용으로 분리, 개발 docker container 호스트명(graphrag_agent_db_postgres) 및 운영 호스트명(external_project_db_postgres) 반영, Playwright 21개 전 화면 100% 무결성 검증 통과 |
| **2026-10-24** | 운영 환경 백엔드(:30014) 연결 실패 및 run_port.sh 가짜 ONLINE 버그 완전 해결 | `backend/src/app.module.ts`, `backend/src/config/configuration.ts`, `db-client.helper.ts`, `run_port.sh`, `GEMINI.md` | `backend/.env`의 개발 DB_HOST가 운영 모드에서 `external_project_db_postgres`를 덮어써 TypeORM 연결 실패 무한 재시도로 30014 포트가 미개방되던 원인 해결 (configuration.ts 환경별 호스트 자동 매핑 및 app.module.ts 다중 호스트 소켓 프로브 Self-Healing 완비), run_port.sh의 포트 미열림 상태에서 PID만으로 가짜 ONLINE 출력하던 버그 수정 및 프로세스 조기 종료 즉시 감지·로그 출력 보강, Playwright 21개 중요 화면 100% 무결성 검증 통과 |
| **2026-10-30** | Next.js Server Action "x" 프로빙 오류 해결 및 보안 미들웨어 구축과 데몬 지속성 보강 | `frontend_user/src/middleware.ts`, `frontend_user/.env.example`, `scripts/generate_env.sh`, `run_port.sh`, `GEMINI.md` | 외부 봇/스캐너의 Next-Action: x 프로빙 요청으로 인한 Next.js 500 Unhandled Exception(Failed to find Server Action "x")을 Next.js Middleware에서 400 Bad Request로 선제 안전 차단, NEXT_SERVER_ACTIONS_ENCRYPTION_KEY 고정 키 주입으로 배포/빌드 간 Skew 방지, setsid 기반 백그라운드 세션 유지 보장 및 Playwright 21개 전 화면 100% 무결성 검증 통과 |


