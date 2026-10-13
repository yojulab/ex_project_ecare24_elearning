# 🏥 eCare24 이러닝 플랫폼 (한국돌봄종사자양성교육원)

> **간병 전문 인력 양성을 위한 차세대 이러닝 및 통합 행정 플랫폼**  
> 16대 질환군 전문 커리큘럼, 실버 접근성(WCAG AAA) 수강생 포털, 콜센터 CS 원스크린 어드민, 모바일 웹 앱 시뮬레이터를 하나의 모노레포로 통합 운영합니다.

---

## 📌 1. 3대 핵심 서비스 및 포트 매핑 현황

본 프로젝트는 수강생, 관리자/상담원, 모바일 학습자를 위한 3개 독립 웹 애플리케이션으로 구성되어 있습니다:

| 서비스 구분 | 프로젝트 디렉터리 | 기술 스택 | 기본 포트 | 접속 URL | 설명 |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **수강생 웹 포털** | `frontend_user/` | **Next.js 14** (App Router) | **`30010`** | `http://0.0.0.0:30010` | 실버 친화적 초직관 UI, 160h+80h 교육과정, CBT 시험실 |
| **관리자 & CS 포털** | `frontend_admin/` | **Vite + React 18** | **`30011`** | `http://0.0.0.0:30011` | 콜센터 CTI 3분할 원스크린 레이아웃, 수강생/자격증 발급 관리 |
| **모바일 웹 시뮬레이터** | `mobileApp/` | **Vite + React 18** | **`30012`** | `http://0.0.0.0:30012` | 모바일 터치 최적화, 1분 숏폼(간병24TV), 이동 학습 모드 |

---

## 🚀 2. 포트별 개별 및 일괄 운영/개발 기동 가이드 (`run_port.sh` & `compile.sh`)

루트 디렉터리의 `run_port.sh` (또는 심볼릭 링크 `compile.sh`)를 사용하여 3개 서비스를 **운영 모드(Production)** 또는 **개발 모드(Development)**로 개별/일괄 기동 및 컴파일할 수 있습니다.

> [!NOTE]
> **운영 서버 최적화**: 기본 실행 시 **`NODE_ENV=production`** 모드로 동작하며, 사전 빌드 산출물(`BUILD_ID`, `dist`)이 없으면 **자동으로 클린 빌드를 수행한 뒤 고속 서빙(Next.js `next start`, Vite `vite preview`)**합니다. 모든 프로세스는 `HOSTNAME=0.0.0.0`으로 바인딩됩니다.

### 2.1. 대화형 선택 메뉴 (Interactive CLI)
인자 없이 스크립트를 실행하면 터미널에서 번호 선택만으로 모든 기능을 제어할 수 있습니다:
```bash
./run_port.sh
```

```text
=================================================================
 🏥 eCare24 통합 운영/개발 포트 매니저 (run_port.sh)
=================================================================
원하시는 작업을 번호로 선택하세요:

 [운영 서버 모드 (Production - 권장)]
   1) 🚀 모든 포트 일괄 운영 기동 (30010, 30011, 30012 Production Start)
   2) 🌐 수강생 웹 포털 운영 기동 (:30010 Next.js start)
   3) 🌐 관리자 & CS 운영 기동 (:30011 Vite preview)
   4) 🌐 모바일 웹 시뮬레이터 운영 기동 (:30012 Vite preview)

 [개발 모드 (Development)]
   5) 💻 모든 포트 일괄 개발 서버 기동 (Dev All, HMR 지원)
   6) 💻 수강생 웹 포털 개발 기동 (:30010 dev)
   7) 💻 관리자 & CS 포털 개발 기동 (:30011 dev)
   8) 💻 모바일 웹 시뮬레이터 개발 기동 (:30012 dev)

 [컴파일 및 빌드 검증]
   9) 📦 모든 서비스 일괄 컴파일 / 빌드 (Build All)

 [관리 및 진단]
  10) 🔍 현재 포트 점유 상태 및 헬스체크 (Status)
  11) 🛑 모든 포트 서비스 일괄 종료 (Stop All)
   0) 🚪 종료 (Exit)
```

---

### 2.2. 운영 서버 기동 (Production 모드 - 기본값)

#### A. 모든 포트(30010, 30011, 30012) 일괄 운영 기동 (백그라운드)
사전 빌드 산출물이 없을 경우 자동 빌드 후 3개 서비스를 백그라운드로 안전하게 띄웁니다:
```bash
./run_port.sh all
# 또는
npm start
# 또는
npm run prod:all
```

#### B. 개별 포트 운영 기동
```bash
# 실시간 콘솔 포그라운드 실행
./run_port.sh 30010       # 수강생 웹 포털 (:30010, next start)
./run_port.sh 30011       # 관리자/CS 포털 (:30011, vite preview)
./run_port.sh 30012       # 모바일 웹 앱 (:30012, vite preview)

# 백그라운드(데몬) 실행 (-d 옵션)
./run_port.sh 30010 -d
./run_port.sh 30011 -d
./run_port.sh 30012 -d

# 환경변수 오버라이드 지정
HOSTNAME=0.0.0.0 PORT=30010 ./run_port.sh 30010
```

---

### 2.3. 개발 모드 기동 (Development dev 모드)

소스코드 수정 시 실시간 핫 리로딩(HMR)이 필요한 개발 환경에서는 `dev` 키워드를 사용합니다:
```bash
# 전체 개발 서버 일괄 기동
./run_port.sh dev all
# 또는
npm run dev:all

# 개별 개발 서버 기동
./run_port.sh dev 30010
./run_port.sh dev 30011
./run_port.sh dev 30012
```

---

### 2.4. 컴파일 및 프로덕션 빌드 검증 (`compile` / `build`)

Next.js 번들링 및 Vite/TypeScript의 타입체크 및 정적 빌드를 검증합니다:

```bash
# 1. 3개 서비스 전체 일괄 컴파일 / 빌드
./compile.sh all
# 또는
npm run build
# 또는
npm run compile

# 2. 개별 서비스 컴파일
./compile.sh 30010        # 수강생 포털 (Next.js build)
./compile.sh 30011        # 관리자/CS 포털 (tsc && vite build)
./compile.sh 30012        # 모바일 앱 (tsc && vite build)
```

---

### 2.4. 서비스 상태 점검 (status) 및 종료 (stop)

```bash
# 현재 포트 점유 여부 및 PID 확인
./run_port.sh status

# 특정 포트 프로세스 안전 종료
./run_port.sh stop 30010

# 전체 3대 포트 프로세스 일괄 안전 종료
./run_port.sh stop all
```

---

## 📋 3. `package.json` 단축 스크립트 목록

루트 경로에서 `npm run` 명령어로 즉시 호출할 수 있도록 사전 구성되어 있습니다:

```bash
# 운영 서버 기동 (Production)
npm start                # 3대 포트 일괄 운영 기동 (Build 확인 후 백그라운드)
npm run prod:all         # 3대 포트 일괄 운영 기동 (동일)
npm run port             # run_port.sh 대화형 CLI 메뉴 실행

# 개발 서버 기동 (Development dev)
npm run dev              # 3대 포트 일괄 개발 서버 기동
npm run dev:all          # 3대 포트 일괄 개발 서버 기동
npm run dev:user         # 수강생 포털 (:30010 dev) 기동
npm run dev:admin        # 관리자 포털 (:30011 dev) 기동
npm run dev:mobile       # 모바일 앱 (:30012 dev) 기동

# 컴파일/빌드 검증 관련
npm run build            # 전체 3대 서비스 일괄 컴파일 (build all)
npm run compile          # 전체 3대 서비스 일괄 컴파일 (build all)
npm run compile:user     # 수강생 포털 Next.js 컴파일
npm run compile:admin    # 관리자 포털 Vite/tsc 컴파일
npm run compile:mobile   # 모바일 앱 Vite/tsc 컴파일

# 서비스 수명주기 및 진단
npm run status           # 포트 점유 상태 및 헬스체크
npm run stop             # 모든 포트 서비스 일괄 종료
npm run restart          # 서비스 재시작

# 외부 공유 터널
npm run tunnel:share     # Cloudflare 외부 접속용 공용 URL 생성
npm run tunnel:status    # 터널 활성 상태 확인
```

---

## 🌍 4. 외부 공유용 Cloudflare 터널

로컬 방화벽이나 외부 포트포워딩 설정 없이 외부 모바일 기기나 의뢰자가 직접 브라우저로 접속할 수 있는 임시 HTTPS 터널을 제공합니다:

```bash
# 3대 서비스 외부 접속 URL 일괄 생성
bash scripts/start_tunnels.sh

# 생성된 접속 URL 및 활성 터널 상태 점검
bash scripts/status_tunnels.sh
```

---

## 🔎 5. 의뢰자 소통용 UI 일련번호 인스펙션 시스템

모든 화면과 인터랙션 컴포넌트에는 정밀 피드백을 위한 고유 일련번호(`[P01-SEC01-BTN01]`)가 부여되어 있습니다.

- **인스펙션 토글**: 브라우저 어디서나 **`Alt + I`** 키를 누르면 각 컴포넌트 상단에 노란색 식별 뱃지가 표시/숨김 처리됩니다.
- **클립보드 원클릭 복사**: 뱃지를 클릭하면 일련번호가 클립보드에 즉시 복사(`[Copied! ✓]`)되어 수정 요청 시 손쉽게 붙여넣을 수 있습니다.

---

## 📁 6. 프로젝트 디렉터리 구조

```text
project_ecare24_elearning/
├── frontend_user/          # [Port 30010] 수강생 웹 포털 (Next.js 14)
├── frontend_admin/         # [Port 30011] 관리자 & 콜센터 CS 포털 (Vite + React)
├── mobileApp/              # [Port 30012] 모바일 웹 시뮬레이터 (Vite + React)
├── packages/               # 공용 유틸 및 타입 정의 모노레포 패키지
│   ├── types/              # 질환군, 자격증, 수강생 공용 TypeScript 인터페이스
│   └── utils/              # 포맷터 및 공용 유틸리티
├── scripts/                # Cloudflare 터널 및 부가 관리 스크립트
├── logs/                   # 서비스별 일자별 실행 로그 (.log)
├── docs/                   # 임상 전문 용어 사전, 커리큘럼, 아키텍처 사양서
├── run_port.sh             # 포트별 개별/일괄 컴파일 & 기동 메인 제어기
├── compile.sh              # run_port.sh 심볼릭 링크
├── start_server.sh         # 통합 백그라운드 기동 스크립트
├── stop_server.sh          # 통합 프로세스 종료 스크립트
├── restart_server.sh       # 통합 프로세스 재시작 스크립트
├── GEMINI.md               # 하네스 헌장 및 시스템 사양 문서
└── README.md               # 본 문서
```
