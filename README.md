# 🏥 eCare24 이러닝 플랫폼 (한국돌봄종사자양성교육원)

> **간병 전문 인력 양성을 위한 차세대 이러닝 및 통합 학사·행정 플랫폼**  
> 16대 질환군 전문 커리큘럼, 실버 접근성(WCAG AAA) 수강생 포털, 콜센터 CS 원스크린 어드민, 모바일 웹 앱 시뮬레이터, 그리고 엔터프라이즈 REST API 백엔드를 하나의 모노레포로 통합 운영합니다.

---

## 📌 1. 4대 핵심 서비스 및 포트 매핑 현황

본 프로젝트는 수강생, 관리자/상담원, 모바일 학습자, 백엔드 API 서버를 위한 4개 독립 서비스로 구성되어 있습니다:

| 서비스 구분 | 프로젝트 디렉터리 | 기술 스택 | 기본 포트 | 접속 URL | 설명 |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **수강생 웹 포털** | `frontend_user/` | **Next.js 14** (App Router) | **`30010`** | `http://0.0.0.0:30010` | 실버 친화적 초직관 UI, 160h+80h 교육과정, CBT 시험실, 마이페이지 |
| **관리자 & CS 포털** | `frontend_admin/` | **Vite + React 18** | **`30011`** | `http://0.0.0.0:30011` | 콜센터 CTI 3분할 원스크린, 10대 학사 LNB, 권한 매트릭스, 입금 확인 |
| **모바일 웹 시뮬레이터** | `mobileApp/` | **Vite + React 18** | **`30012`** | `http://0.0.0.0:30012` | 모바일 터치 최적화, 1분 숏폼(간병24TV), 자격증 지갑, 모바일 MY |
| **엔터프라이즈 REST API** | `backend/` | **NestJS 10 + TypeORM** | **`30014`** | `http://0.0.0.0:30014/api/v1`<br>`/api/docs` (Swagger) | PostgreSQL 17 연동, JWT 인증, 8대 핵심 모듈, 25개 마스터 권한 제어 |

---

## 🚀 2. 포트별 개별 및 일괄 운영/개발 기동 가이드 (`run_port.sh` & `compile.sh`)

루트 디렉터리의 `run_port.sh` (또는 심볼릭 링크 `compile.sh`)를 사용하여 4대 서비스를 **운영 모드(Production)** 또는 **개발 모드(Development)**로 개별/일괄 기동 및 컴파일할 수 있습니다.

> [!NOTE]
> **운영 서버 최적화**: 기본 실행 시 **`NODE_ENV=production`** 모드로 동작하며, 사전 빌드 산출물(`BUILD_ID`, `dist`)이 없으면 **자동으로 클린 빌드를 수행한 뒤 고속 서빙(Next.js `next start`, Vite `vite preview`, NestJS `node dist/main`)**합니다. 모든 프로세스는 `HOSTNAME=0.0.0.0`으로 바인딩됩니다.

### 2.1. 대화형 선택 메뉴 (Interactive CLI)
인자 없이 스크립트를 실행하면 터미널에서 번호 선택만으로 모든 기능을 제어할 수 있습니다:
```bash
./run_port.sh
```

```bash
# 기본 사용법: ./run_port.sh [명령어] [대상]

./run_port.sh [all|30010|30011|30012|30014]         # 운영 모드 기동 (기본값)
./run_port.sh dev [all|30010|30011|30012|30014]     # 개발 모드(HMR/Watch) 기동
./run_port.sh compile [all|30010|30011|30012|30014] # 컴파일 / 빌드 (또는 ./compile.sh)
./run_port.sh stop [all|30010|30011|30012|30014]    # 프로세스 종료
./run_port.sh restart [all|...]                     # 재시작
./run_port.sh status                                # 서비스 가동 상태 점검
```

---

### 2.2. 운영 모드 기동 (Production - 기본값)

빌드 산출물이 없을 경우 자동으로 사전 컴파일을 수행한 후, 백그라운드에서 안전하게 기동합니다:

```bash
# 전체 서비스 일괄 운영 기동 (30010, 30011, 30012, 30014)
./run_port.sh all
# 또는
./start_server.sh
# 또는
npm start

# 개별 포트 운영 기동
./run_port.sh 30010       # 수강생 웹 포털 (Next.js start)
./run_port.sh 30011       # 관리자/CS 포털 (Vite preview)
./run_port.sh 30012       # 모바일 웹 앱 (Vite preview)
./run_port.sh 30014       # 엔터프라이즈 REST API (node dist/main)
```

---

### 2.3. 개발 모드 기동 (Development - HMR & Watch)

소스코드 수정 시 실시간 핫 리로딩(HMR) 및 핫 패치가 필요한 개발 환경에서는 `dev` 명령어를 사용합니다:

```bash
# 전체 개발 서버 일괄 기동
./run_port.sh dev all
# 또는
npm run dev

# 개별 개발 서버 기동
./run_port.sh dev 30010   # 수강생 웹 포털 (:30010 dev)
./run_port.sh dev 30011   # 관리자 포털 (:30011 dev)
./run_port.sh dev 30012   # 모바일 앱 (:30012 dev)
./run_port.sh dev 30014   # 백엔드 REST API (:30014 nest start --watch)
```

---

### 2.4. 컴파일 및 프로덕션 빌드 (Compile / Build)

컴파일과 포트 관리가 완벽히 통합되어 `run_port.sh compile` 또는 단축 링크 `compile.sh`로 즉시 빌드할 수 있습니다:

```bash
# 전체 4대 서비스 일괄 컴파일 / 빌드
./compile.sh all
# 또는
./run_port.sh compile all
# 또는
npm run build

# 개별 서비스 컴파일
./compile.sh 30010        # 수강생 포털 (Next.js build)
./compile.sh 30011        # 관리자/CS 포털 (tsc && vite build)
./compile.sh 30012        # 모바일 앱 (tsc && vite build)
./compile.sh 30014        # 백엔드 API (nest build)
```

---

### 2.5. 서비스 상태 점검 (Status) 및 종료/재시작 (Stop / Restart)

```bash
# 현재 포트 가동 상태 점검 (ONLINE / STOPPED 및 PID 확인)
./run_port.sh status
# 또는
npm run status

# 특정 포트 프로세스 안전 종료
./run_port.sh stop 30010

# 전체 4대 포트 프로세스 일괄 안전 종료
./run_port.sh stop all
# 또는
./stop_server.sh
# 또는
npm run stop

# 전체 서비스 재시작
./run_port.sh restart all
# 또는
./restart_server.sh
# 또는
npm run restart
```

---

## 🗄️ 3. 데이터베이스 초기화 및 시드 관리 (Database Commands)

PostgreSQL 17 기반의 데이터베이스 스키마 및 마스터/운영 데이터를 목적에 따라 아래 3가지 명령어로 제어할 수 있습니다:

### 3.1. DB 전체 완전 초기화 및 기본 시드 재구축 (클린 리셋)
기존 `public` 스키마 내 모든 테이블을 삭제(`DROP SCHEMA public CASCADE`)한 후, 최신 DDL 스키마를 생성하고 13대 공식 시드 데이터(16대 질환군, 3대 실데이터 트랙, 15개 챕터 교안/HeyGen VOD, 180문항 CBT 문제은행, 25개 권한 마스터, 기본 계정 등)를 완전히 초기 상태로 복원합니다.

```bash
# 기본 실행 (개발 환경)
npm run db:reset

# 운영 환경(NODE_ENV=production)에서 명시적 강제 초기화
npm run db:reset:force
# 또는
NODE_ENV=development npm run db:reset
```

> [!NOTE]
> **Docker PostgreSQL 컨테이너 (`external_project_db_postgres`) 연동 안내**:  
> - **호스트 실행 시**: `backend/.env`의 `DB_HOST=127.0.0.1` (또는 `localhost`), `DB_PORT=5432`로 바인딩됩니다.
> - **Docker Network 상의 컨테이너 간 통신 시**: 같은 도커 네트워크에 속해 있다면 `DB_HOST=external_project_db_postgres`로 컨테이너 이름을 직접 지정할 수 있습니다.
> - 컨테이너가 부팅 중일 때도 자동 재시도(`connectWithRetry`)를 지원하므로 일시적 접속 거부 없이 안전하게 연결됩니다.

---

### 3.2. 기존 테이블 유지 + 초기 기준 데이터 갱신 (시드 주입)
기존 테이블 스키마와 신규 생성된 데이터를 보존하면서, 공식 교육과정·문제은행·마스터 권한만 최신 버전으로 업데이트(Upsert)하고자 할 때 실행합니다:

```bash
npm run db:seed
```

---

### 3.3. 테이블 DDL 스키마만 생성 (데이터 없는 빈 테이블)
데이터 주입 없이 `01_master_schema.sql` 및 `02_auth_payment_admin_schema.sql` 테이블 구조만 깨끗하게 생성할 때 실행합니다:

```bash
npm run db:init
```

---

### 3.4. 초기 제공 테스트 계정 정보

DB 초기화 완료 후 아래 기본 계정으로 즉시 로그인 및 기능 테스트가 가능합니다:

| 구분 | 아이디 (`loginId`) | 비밀번호 (`password`) | 성명 / 역할 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **관리자 포털 (:30011)** | `admin` | `admin1234!` | 시스템관리자 | 25개 전권 보유 (최고관리자) |
| **수강생 웹 (:30010)** | `student01` | `password123!` | 김영희 교육생 | 240시간 정규과정 수강 중 |
| **수강생 서브 데모** | `student02` | `password123!` | 이철수 교육생 | 일반 교육생 |
| **강사 계정** | `inst01` | `password123!` | 박교수 | 임상 전담 강사 |

---

### 3.5. 개발 / 운영 환경 DB 일원화 및 자동 프로비저닝 (Auto-Provisioning)

운영 환경(외부 PostgreSQL 도커 컨테이너 `external_project_db_postgres`의 `admin`/`admin123`/`db_graphrag_agent`)과 로컬 개발 환경(`ecare24_app`/`ecare24_secret_2026`) 간의 계정 및 데이터베이스 불일치 문제를 **완전 일원화**하였습니다.

1. **자동 프로비저닝 (Self-Healing)**:
   - `ecare24_app` 계정 또는 `ecare24` 데이터베이스가 생성되어 있지 않은 환경(운영 서버 등)에서 `npm run db:reset:force`나 `npm run db:init`을 실행하면, 스크립트가 `admin` 슈퍼유저로 자동 접속하여:
     - `ecare24_app` 계정 생성 및 전용 권한 부여
     - `ecare24` 전용 독립 데이터베이스 생성 (기존 `db_graphrag_agent` 데이터 100% 보존)
     - `age` (Apache AGE) 확장 활성화
   - 를 **전자동으로 수행한 뒤 즉시 정상 연결**합니다.
   - 따라서 호스트에서 수동으로 `docker exec psql ...` 명령을 입력할 필요가 없습니다.

2. **투명한 실시간 진단 로깅 (에러 착시 원천 방지)**:
   - 각 호스트(`172.20.0.4`, `external_project_db_postgres`, `127.0.0.1` 등) 연결 시 발생하는 오류(네트워크 단절, 인증 실패, Role/DB 부재)를 단계별로 명확하게 출력하여 마지막 호스트의 `ECONNREFUSED`만 보이는 착시 현상을 원천 차단했습니다.

3. **환경 변수 일원화 (`backend/.env`)**:
   ```env
   # 앱 전용 접속 계정 (운영 서버는 컨테이너 이름, 로컬 개발은 localhost/127.0.0.1)
   DB_HOST=external_project_db_postgres
   DB_PORT=5432
   DB_NAME=ecare24
   DB_USER=ecare24_app
   DB_PASSWORD=ecare24_secret_2026

   # 자동 프로비저닝용 슈퍼유저 정보 (운영 DB 컨테이너의 실제 슈퍼유저와 일치해야 함)
   DB_ADMIN_USER=admin
   DB_ADMIN_PASSWORD=admin123
   DB_ADMIN_NAME=db_graphrag_agent
   ```

4. **`28P01 password authentication failed`의 진짜 의미**:
   - PostgreSQL(scram/md5 인증)은 **계정이 아예 없을 때도 `28P01`(비밀번호 불일치)을 반환**합니다 (계정 존재 여부 노출 방지).
   - 따라서 `28P01`은 ① 계정 부재 ② 비밀번호 불일치 모두를 의미하며, 두 경우 모두 자동 프로비저닝이 `CREATE ROLE` 또는 `ALTER ROLE ... PASSWORD`로 해결합니다.

5. **운영 서버 `.env` 일괄 생성 (`generate_env.sh`)**:
   - 운영 서버는 앱 컨테이너(`external_project_app_fullstack`)와 DB 컨테이너(`external_project_db_postgres`)가 **같은 도커 네트워크**에 있으므로 `DB_HOST`는 `localhost`가 아닌 **컨테이너 이름**을 사용합니다 (스크립트 기본값 적용).
   - 운영 슈퍼유저 정보가 기본값(`admin`/`admin123`)과 다르면 실행 시 환경 변수로 덮어씁니다:
     ```bash
     DB_ADMIN_PASSWORD='실제_admin_비밀번호' bash generate_env.sh
     # 필요 시: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_ADMIN_USER, DB_ADMIN_NAME 도 동일하게 지정 가능
     ```
   - 자동 프로비저닝 실패 시 관리자 계정별 접속 실패 사유(`➔ password authentication failed for user "admin"` 등)가 그대로 출력되므로, 원인이 슈퍼유저 정보 불일치인지 즉시 확인할 수 있습니다.

---

### 3.6. 브라우저 로컬 세션 캐시 초기화
이전 로그인 세션 토큰이나 클라이언트 상태를 깨끗이 초기화하고 싶을 경우, 브라우저 개발자 도구(`F12`) 콘솔에서 아래 스크립트를 실행합니다:
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```


---

## 🔒 4. 로그인 세션 관리 및 마이페이지 보안 가드 체계

비인가 접근 및 불필요한 개인정보 노출을 방지하기 위해 **수강생 웹, 관리자 포털, 모바일 앱 전반에 걸쳐 엔드투엔드 세션 가드**가 구축되어 있습니다.

### 4.1. 수강생 웹 포털 (`frontend_user`, `:30010`)
- **GNB 마이페이지 조건부 렌더링**: 비로그인 상태에서는 GNB 메뉴에서 마이페이지([P00-SEC01-LNK06])가 숨겨지며, [로그인/회원가입] 버튼만 노출됩니다.
- **비인가 직접 진입 가드**: 비로그인 상태로 `/mypage` URL에 직접 진입하더라도 회원정보 노출을 원천 차단하고 **"로그인이 필요한 페이지입니다" 가드 화면**([P10-SEC00-BTN-LOGIN], [P10-SEC00-BTN-SIGNUP])을 표시합니다.
- **실회원 데이터 실시간 바인딩**: 로그인 성공 시 하드코딩된 데모 데이터가 아닌, 현재 토큰의 실제 회원 프로필(성명, 아이디, 휴대폰, 이메일) 및 수강·가상계좌 납부·자격증 현황을 실시간 바인딩합니다.
- **원클릭 로그아웃**: 상단 GNB([P00-SEC01-BTN-LOGOUT]), 마이페이지 상단([P10-SEC01-BTN-LOGOUT]), 회원정보 탭([P15-SEC01-BTN-LOGOUT])에서 로그아웃 시 세션을 즉시 파기하고 메인 페이지(`/`)로 안전하게 리다이렉트합니다.

### 4.2. 관리자 포털 (`frontend_admin`, `:30011`)
- **대시보드 차단 및 관리자 인증 가드**: 세션 토큰이 없거나 만료된 경우 대시보드 및 학사 LNB 접근이 차단되며, **"관리자 인증이 필요합니다" 가드 뷰**([P50-SEC00-BTN-LOGIN])가 표시됩니다.
- **로그아웃 즉시 세션 파기**: 우측 상단 로그아웃 버튼([P50-SEC01-BTN-LOGOUT]) 클릭 시 관리자 세션이 즉시 삭제되며 가드 화면으로 복귀합니다.

### 4.3. 모바일 스마트러닝 (`mobileApp`, `:30012`)
- **SPA 해시 라우팅 동기화**: `#tab=my` URL 해시 딥링킹 지원 및 탭 전환 시 실시간 동기화.
- **모바일 비로그인 가드 카드**: 비로그인 상태 시 타인 프로필을 숨기고 **"로그인이 필요한 서비스입니다" 가드 카드**([P48-SEC00-CRD-LOGIN])를 노출합니다.
- **로그인/로그아웃 동기화**: 로그인 시 실시간 프로필 및 3대 지표가 바인딩되며, 로그아웃([P48-SEC01-BTN-LOGOUT]) 시 즉시 비로그인 카드로 전환됩니다.

---

## 🧪 5. E2E 무인 자동 검증 및 테스트 슈트 (Playwright Headless)

리눅스 arm64 컨테이너 환경의 안정적 무인 실행을 위해 필수 브라우저 4대 런치 옵션(`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`)을 준수하는 자동 검증 슈트를 제공합니다:

| 검증 슈트 | 실행 명령어 | 대상 화면 / 시나리오 | 산출물 |
| :--- | :--- | :--- | :--- |
| **21개 중요 화면 무결성 검증** | `npm run test:capture` | 수강생(10), 관리자(7), 모바일(3), 백엔드(1) 총 21개 전 화면 HTTP 200 검증 | `tests/snapshots/*.png`<br>`tests/snapshots/VERIFICATION_REPORT.md` |
| **로그인 세션 관리 종합 검증** | `node tests/test_session_management.js` | 사용자/관리자/모바일 비로그인 가드, 실데이터 바인딩, 로그아웃 15개 시나리오 | `tests/snapshots/session_*.png`<br>15개 항목 100% ALL PASS |
| **5대 CRUD 시나리오 검증** | `npm run test:crud` | 팝업 공지, 트랙 공개 토글, CBT 문제은행, 결제 승인/취소, 1:1 상담문의 | `tests/snapshots/crud_scenarios/*.png`<br>`tests/snapshots/CRUD_VERIFICATION_REPORT.md` |

```bash
# 21개 전 화면 자동 캡처 및 무결성 검증 실행
npm run test:capture

# 세션 관리 및 마이페이지 보안 검증 실행
node tests/test_session_management.js

# 5대 CRUD 시나리오 E2E 검증 실행
npm run test:crud
```

---

## 📋 6. `package.json` 단축 스크립트 목록

루트 경로에서 `npm run` 명령어로 즉시 호출할 수 있도록 사전 구성되어 있습니다:

```bash
# 운영 서버 기동 (Production)
npm start                # 4대 포트 일괄 운영 기동 (Build 확인 후 백그라운드)
npm run prod:all         # 4대 포트 일괄 운영 기동 (동일)
npm run port             # run_port.sh 대화형 CLI 메뉴 실행

# 개발 서버 기동 (Development dev)
npm run dev              # 4대 포트 일괄 개발 서버 기동
npm run dev:all          # 4대 포트 일괄 개발 서버 기동
npm run dev:user         # 수강생 포털 (:30010 dev) 기동
npm run dev:admin        # 관리자 포털 (:30011 dev) 기동
npm run dev:mobile       # 모바일 앱 (:30012 dev) 기동
npm run dev:api          # 백엔드 REST API (:30014 dev watch) 기동

# 컴파일/빌드 검증 관련
npm run build            # 전체 4대 서비스 일괄 컴파일 (build all)
npm run compile          # 전체 4대 서비스 일괄 컴파일 (build all)
npm run compile:user     # 수강생 포털 Next.js 컴파일
npm run compile:admin    # 관리자 포털 Vite/tsc 컴파일
npm run compile:mobile   # 모바일 앱 Vite/tsc 컴파일
npm run compile:api      # 백엔드 API NestJS 컴파일

# 데이터베이스 관리
npm run db:reset         # DB 스키마 클린 리셋 및 13대 공식 시드 주입
npm run db:seed          # 기준 마스터 데이터 갱신 (Upsert)
npm run db:init          # DDL 스키마 테이블만 생성

# 자동 검증 및 E2E 테스트
npm run test:capture     # Playwright 21개 중요 화면 자동 캡처 검증
npm run test:crud        # 5대 CRUD 시나리오 E2E 검증

# 서비스 수명주기 및 진단
npm run status           # 포트 점유 상태 및 헬스체크
npm run stop             # 모든 포트 서비스 일괄 종료
npm run restart          # 서비스 재시작

# 외부 공유 터널
npm run tunnel:share     # Cloudflare 외부 접속용 공용 URL 생성
npm run tunnel:status    # 터널 활성 상태 확인
```

---

## 🌍 7. 외부 공유용 Cloudflare 터널

로컬 방화벽이나 외부 포트포워딩 설정 없이 외부 모바일 기기나 의뢰자가 직접 브라우저로 접속할 수 있는 임시 HTTPS 터널을 제공합니다:

```bash
# 3대 프론트엔드 서비스 외부 접속 URL 일괄 생성
bash scripts/start_tunnels.sh

# 생성된 접속 URL 및 활성 터널 상태 점검
bash scripts/status_tunnels.sh
```

---

## 🔎 8. 의뢰자 소통용 UI 일련번호 인스펙션 시스템

모든 화면과 인터랙션 컴포넌트에는 정밀 피드백을 위한 고유 일련번호(`[P01-SEC01-BTN01]`)가 부여되어 있습니다.

- **인스펙션 토글**: 브라우저 어디서나 **`Alt + I`** 키를 누르면 각 컴포넌트 상단에 노란색/바이올렛 식별 뱃지가 표시/숨김 처리됩니다.
- **클립보드 원클릭 상세 복사**: 뱃지를 클릭하면 **4대 필수 정보(일련번호, 페이지명, URI, 항목명)**가 클립보드에 정돈되어 즉시 복사(`[Copied! ✓]`)되며, 페이지명에 화면코드와 서비스명이 결합되어 수정 요청 시 그대로 메신저나 지시서에 붙여넣을 수 있습니다.
  ```text
  - 일련번호: P41-SEC01-RESUME
  - 페이지명: 홈 대시보드 (P-41) - eCare24 스마트러닝
  - URI: https://third.axfoundly.com/#tab=home
  - 항목명: 모바일 강의 이어보기 카드
  ```

---

## 📁 9. 프로젝트 디렉터리 구조

```text
project_ecare24_elearning/
├── frontend_user/          # [Port 30010] 수강생 웹 포털 (Next.js 14, 실버 친화적 초직관 UX)
├── frontend_admin/         # [Port 30011] 관리자 & 콜센터 CS 포털 (Vite + React, CTI 3분할)
├── mobileApp/              # [Port 30012] 모바일 웹 시뮬레이터 (Vite + React, 모바일 터치/숏폼)
├── backend/                # [Port 30014] 엔터프라이즈 REST API (NestJS 10, TypeORM, PostgreSQL 17)
├── packages/               # 공용 유틸 및 타입 정의 모노레포 패키지
│   ├── types/              # 질환군, 자격증, 수강생, 결제 공용 TypeScript 인터페이스
│   └── utils/              # UI 일련번호 인스펙터 헬퍼 및 포맷터 유틸리티
├── tests/                  # Playwright Headless 무인 자동 검증 슈트
│   ├── capture_screens.js  # 21개 중요 화면 자동 캡처 검증기
│   ├── test_session_management.js # 세션 관리 및 마이페이지 가드 15대 시나리오 검증기
│   ├── test_crud_scenarios.js     # 5대 CRUD 시나리오 검증기
│   └── snapshots/          # 캡처 스냅샷 이미지 및 검증 보고서
├── scripts/                # Cloudflare 터널, DB 모니터링 및 시드 스크립트
├── logs/                   # 서비스별 일자별 실행 로그 (.log)
├── docs/                   # 임상 전문 용어 사전, 커리큘럼, 아키텍처 사양서, DDL
├── run_port.sh             # 포트별 개별/일괄 컴파일 & 기동 메인 제어기
├── compile.sh              # run_port.sh 심볼릭 링크
├── start_server.sh         # 통합 백그라운드 기동 스크립트
├── stop_server.sh          # 통합 프로세스 종료 스크립트
├── restart_server.sh       # 통합 프로세스 재시작 스크립트
├── GEMINI.md               # 하네스 헌장 및 시스템 사양 문서
└── README.md               # 본 문서
```
