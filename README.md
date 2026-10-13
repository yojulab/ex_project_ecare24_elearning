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

## 🚀 2. 포트별 개별 및 일괄 컴파일 / 기동 가이드 (`run_port.sh` & `compile.sh`)

루트 디렉터리의 `run_port.sh` (또는 심볼릭 링크 `compile.sh`)를 사용하여 3개 서비스를 **개별 또는 일괄로 기동 및 컴파일**할 수 있습니다.

모든 프로세스는 기본적으로 **`HOSTNAME=0.0.0.0`**으로 바인딩되어 외부 및 컨테이너 환경에서도 접속 가능합니다.

### 2.1. 대화형 선택 메뉴 (Interactive CLI)
인자 없이 스크립트를 실행하면 터미널에서 번호 선택만으로 모든 기능을 제어할 수 있습니다:
```bash
./run_port.sh
# 또는
./compile.sh
```

```text
=================================================================
 🏥 eCare24 통합 포트 제어 및 컴파일 매니저 (run_port.sh)
=================================================================
원하시는 작업을 번호로 선택하세요:

 [개발 서버 실행 (dev)]
   1) 🚀 모든 포트 일괄 기동 (30010, 30011, 30012 백그라운드)
   2) 💻 수강생 웹 포털 개별 기동 (:30010 Next.js, 실시간 콘솔)
   3) 💻 관리자 & CS 개별 기동 (:30011 Vite, 실시간 콘솔)
   4) 💻 모바일 웹 시뮬레이터 개별 기동 (:30012 Vite, 실시간 콘솔)

 [컴파일 및 빌드 검증 (build)]
   5) 📦 모든 포트 일괄 컴파일 (Build All: Next.js + Vite 2종)
   6) 📦 수강생 웹 포털 개별 컴파일 (Build :30010)
   7) 📦 관리자 & CS 포털 개별 컴파일 (Build :30011)
   8) 📦 모바일 웹 시뮬레이터 개별 컴파일 (Build :30012)

 [관리 및 진단]
   9) 🔍 현재 포트 점유 상태 및 헬스체크 (Status)
  10) 🛑 모든 포트 서비스 일괄 종료 (Stop All)
   0) 🚪 종료 (Exit)
```

---

### 2.2. 개발 서버 기동 (dev 모드)

#### A. 모든 포트(30010, 30011, 30012) 일괄 백그라운드 기동
기존 프로세스를 안전하게 정리한 후 3대 서비스를 동시에 백그라운드로 띄우고 헬스체크 결과를 출력합니다:
```bash
./run_port.sh all
# 또는
npm run dev:all
```

#### B. 개별 포트 포그라운드 실시간 콘솔 기동 (터미널 실시간 로그)
```bash
# [방법 1] 포트 번호 지정
./run_port.sh 30010       # 수강생 웹 포털 (Next.js)
./run_port.sh 30011       # 관리자/CS 포털 (Vite)
./run_port.sh 30012       # 모바일 웹 앱 (Vite)

# [방법 2] 서비스명 지정
./run_port.sh user
./run_port.sh admin
./run_port.sh mobile

# [방법 3] 환경변수 오버라이드 지원 (0.0.0.0 및 커스텀 포트)
HOSTNAME=0.0.0.0 PORT=30010 ./run_port.sh 30010
```

#### C. 개별 포트 백그라운드(데몬) 기동 (`-d` / `--daemon`)
터미널을 점유하지 않고 `logs/` 디렉터리에 분리 기록하며 백그라운드로 실행합니다:
```bash
./run_port.sh 30010 -d
./run_port.sh 30011 -d
./run_port.sh 30012 -d
```

---

### 2.3. 컴파일 및 프로덕션 빌드 검증 (`compile` / `build`)

Next.js 번들링 및 Vite/TypeScript의 타입체크 및 정적 빌드를 검증합니다:

```bash
# 1. 3개 서비스 전체 일괄 컴파일 / 빌드
./compile.sh all
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
# 개발 서버 관련
npm run dev:all          # 3대 포트 일괄 백그라운드 기동
npm run dev:user         # 수강생 포털 (:30010) 기동
npm run dev:admin        # 관리자 포털 (:30011) 기동
npm run dev:mobile       # 모바일 앱 (:30012) 기동
npm run port             # run_port.sh 대화형 CLI 메뉴 실행

# 컴파일/빌드 검증 관련
npm run compile          # 전체 3대 서비스 일괄 컴파일 (build all)
npm run compile:user     # 수강생 포털 Next.js 컴파일
npm run compile:admin    # 관리자 포털 Vite/tsc 컴파일
npm run compile:mobile   # 모바일 앱 Vite/tsc 컴파일

# 기존 서버 라이프사이클 관리
npm run start            # bash start_server.sh
npm run stop             # bash stop_server.sh
npm run restart          # bash restart_server.sh

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
