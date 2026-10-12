# [업무지시서] ecare24 : 환자 질환별 전문간병사 자격과정 통합 플랫폼 구축

- **문서 번호**: ECARE24-SOW-2026-001 (Rev. 1.2)
- **작성일자**: 2026. 10. 12
- **문서 구분**: 시스템 구축 업무지시서 (Statement of Work / PRD & Architecture Spec)
- **프로젝트 성격**: 기획 및 상세 아키텍처 수립 단계 (**※ 본 단계에서는 소스코드 개발을 진행하지 않음**)

---

## 1. 프로젝트 개요 및 배경

### 1.1 프로젝트 명칭
- **국문**: ecare24 환자 질환별 전문간병사 자격과정 웹·앱 통합 플랫폼
- **영문**: ecare24 Specialized Caregiver Certification & LMS Platform

### 1.2 추진 배경 및 핵심 목적
1. **기존 간병 시장의 한계 극복**:
   - 기존의 단순 가사 보조 및 범용 간병 체계로는 중증·특수 질환 환자(뇌졸중, 만성폐쇄성폐질환, 인공호흡기 의존, 중증 치매 등)에 대한 전문적이고 안전한 케어가 불가능함.
2. **핵심 차별화 전략 ('환자 질환별 전문간병사')**:
   - 총 **16개 질환군**을 표준 편성하여, 각 질환군별 **[이론 심화 + 실기/실습 + 모의고사 + 자격시험 응시]**가 유기적으로 연계된 전문 에듀테크 시스템 구축.
   - 공신력 있는 **민간자격 등록 및 디지털 자격증 발급** 인프라 구축.
3. **미디어 융합 시너지**:
   - 공식 미디어 채널인 **'간병24TV'**와의 연계를 통해 실시간 콘텐츠 공급, 마케팅 유입 퍼널, 현장 임상 케어 노하우 공유 및 수강생 락인(Lock-in) 효과 극대화.
4. **사용자 경험(UX) 및 다중 프론트엔드 체계 분리**:
   - 주 수강생층인 50~60대 중장년 간병인을 위한 **초직관적 실버 UX(Silver UX)** 설계.
   - 대고객 수강 포털(`frontend_user/`)과 총괄 관리자 및 **콜센터 상담원 전용 CS 포털(`frontend_admin/`)**을 엄격히 분리하여 업무 효율성 극대화.

### 1.3 업무 지시 원칙
- 본 문서는 웹/앱 플랫폼 구축을 위한 **상세 요구사항 명세서 및 기술 아키텍처 가이드라인**입니다.
- **본 단계에서는 소스코드 개발을 진행하지 않으며**, 개발팀, 기획팀, 인프라팀이 상호 합의하고 즉각 스프린트에 착수할 수 있도록 구체적인 스펙과 작업 분할 구조(WBS)를 정의합니다.

---

## 2. 프로젝트 핵심 비즈니스 요구사항

```
+----------------------------------------------------------------------------------------------------+
|                                    ecare24 통합 에코시스템 구조도                                   |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ 미디어 채널 ]               [ 16대 질환군 전문 교육 ]                 [ 자격검정 / 인증 ]         |
|  간병24TV (YouTube) ---------> 이론 심화 교안 (PDF/E-Book) ------------> 단원별/종합 모의고사       |
|   - 숏폼 꿀팁 케어             실기 동영상 강의 (VOD/Live)                온라인 자격시험(CBT)        |
|   - 질환별 케어 특강           임상 실기 + 현장 실습일지                  민간자격증 발급/조회        |
|         |                              |                                      |                    |
|         +------------------------------+--------------------------------------+                    |
|                                        |                                                           |
|         +------------------------------+--------------------------------------+                    |
|         |                                                                     |                    |
|         v                                                                     v                    |
|  [ 대고객 서비스 영역 ]                                              [ 내부 운영 & 지원 영역 ]       |
|  - 수강생 웹 포털 (`frontend_user/`)                                  - 통합 관리자/콜센터 (`frontend_admin/`) |
|  - 스마트러닝 모바일앱 (`mobileApp/`)                                  - 백엔드 코어 API (`backend/`)       |
+----------------------------------------------------------------------------------------------------+
```

### 2.1 [핵심 과업 1] 16개 질환군 분류 및 4단계 심화 커리큘럼 구조

플랫폼은 16개 주요 질환군을 표준 카테고리로 편성하고, 각 질환군별로 독립된 자격 인증 트랙을 제공해야 합니다.

#### 16개 질환군 분류 체계
1. **신경계 질환군** (뇌졸중/중풍, 파킨슨병, 뇌손상, 척수손상 등)
2. **호흡기계 질환군** (COPD, 만성기관지염, 기관절개관(T-tube) 관리, 산소요법 등)
3. **심혈관계 질환군** (심부전, 협심증, 심근경색 후유증, 혈관질환 케어)
4. **근골격계 및 재활 질환군** (인공관절 치환술 후 간병, 고관절 골절, 척추질환 재활)
5. **소화기·간담도 질환군** (경관유동식, 위루관(PEG) 관리, 간경변, 인공항문(장루) 케어)
6. **비뇨기·신장 질환군** (만성신부전, 혈액/복막투석 간병, 유치도뇨관(Foley) 관리)
7. **내분비·대사 질환군** (인슐린 의존성 당뇨, 당뇨발 예방/소독 케어, 중증 대사증후군)
8. **종양·암 질환군** (항암화학요법 부작용 케어, 방사선치료 간병, 호중구감소증 면역관리)
9. **인지·정신·치매 질환군** (알츠하이머, 혈관성 치매, 섬망, 행동심리증상(BPSD) 대처)
10. **감염성 질환군** (CRE/VRE 등 격리환자 간병, 결핵, 옴/욕창 감염병 예방격리)
11. **중환자·집중케어 질환군** (ICU 퇴원환자 간병, 인공호흡기(Home-Vent) 의존 환자 케어)
12. **외상·중증 화상 질환군** (교통사고/낙상 중증외상, 피부이식 및 흉터 드레싱 관리)
13. **노인성 복합만성 질환군** (다약제 복용 관리, 다발성 노인증후군, 와상환자 토탈케어)
14. **호스피스·완화의료 질환군** (임종기 돌봄, 통증 조절 보조, 영적·정서적 지지)
15. **소아·청소년 희귀난치 질환군** (소아마비, 발달장애, 희귀 유전대사질환 특수간병)
16. **응급기도·연하장애 질환군** (석션(Suction) 간호보조, 연하곤란(삼킴장애) 식이보조)

#### 질환별 4단계 학습 편성 구조
각 질환군 과정은 아래 4단계를 필수 이수해야 자격증 취득 요건을 만족합니다.
- **Step 1. 이론 심화 교안 (E-Book / PDF 뷰어)**:
  - 병태생리, 활력징후 이상 판별, 질환별 위험 징후(Red Flag) 감지 및 응급 프로토콜.
  - 전용 뷰어 탑재 (DRM 캡처 방지, 워터마크, 목차 이동, 형광펜/메모).
- **Step 2. 실기·실습 심화 강의 (VOD / Live 스트리밍)**:
  - 체위 변경, 튜브/카테터 위생, 흡인(석션) 보조, 연하 재활 보조 4K 실습 영상.
  - 학습 진도율 트래킹 (배속 제한 1.5배 이내, 스킵 방지, 이어보기).
  - 현장 실습일지 작성 및 지도자 서명 첨부 기능.
- **Step 3. 단원별 & 종합 모의고사 (Mock Exam)**:
  - CBT(Computer-Based Test) 환경 지원.
  - 문제 은행 랜덤 출제, 타이머 설정, 즉시 오답노트 및 연관 해설 강의 링크 제공.
- **Step 4. 정규 자격시험 응시 (Certification Exam)**:
  - 객관식 필기 및 실기 시뮬레이션 문항 출제.
  - 응시 자격 자동 판정 (강의 진도율 80% 이상 + 실습일지 승인 완료 시 응시 활성화).
  - 부정행위 방지 (시험 창 이탈 감지, 중복 로그인 차단, 웹캠 인증 옵션).

---

### 2.2 [핵심 과업 2] 민간자격 등록 및 관리 시스템 연계

한국직업능력연구원(민간자격정보서비스, pqi.or.kr) 등록 요건 및 자격기본법 규정에 부합하는 관리 인프라를 전산화합니다.

1. **민간자격 관리규정 전산 반영**:
   - 자격 종목 명칭: **"환자질환별전문간병사 (16개 분야별 각 종목)"**
   - 주무부처 소관 및 자격등록번호 부여 체계 구현.
2. **응시 자격 심사 및 이력 관리 엔진**:
   - 필수 이수 시간(예: 이론 40시간 + 실기 20시간 + 실습 20시간) 충족 여부 자동 판정.
   - 본인 인증 (휴대폰 PASS, 카카오/네이버 간편인증 연동).
3. **자격검정 채점 및 합격자 사후 관리**:
   - 과락 기준(과목별 40점 미만 과락, 전과목 평균 60점 이상 합격 등) 자동 계산.
   - 불합격자 재응시 유예 기간 및 재응시권 발급 로직.
4. **디지털 자격증 발급 및 공적 검증**:
   - 고유 등록번호 발급 (`EC24-2026-NEURO-XXXXX`).
   - 위·변조 방지 2D QR 코드 삽입 (스캔 시 ecare24 자격조회 페이지로 연결되어 진위 검증).
   - 모바일 자격증 카드(앱 내 지갑 기능) 및 고해상도 PDF 자격인증서 출력 지원.
   - 보수교육 주기(2년 단위) 알림 및 자격 갱신 관리.

---

### 2.3 [핵심 과업 3] '간병24TV' 미디어 융합 및 시너지 극대화

유튜브 채널 '간병24TV'를 브랜드 마케팅 허브로 삼아 교육 플랫폼과 유기적으로 결합합니다.

1. **간병24TV 콘텐츠 인-앱/웹 스트리밍 연동**:
   - YouTube Data API v3 연동: 최신 영상 자동 동기화, 16개 질환군별 자동 카테고라이징.
   - **'1분 케어 쇼츠' 큐레이션**: 간병 현장에서 즉시 확인 가능한 숏폼 비디오 전용 뷰어.
2. **유입 마케팅 퍼널 (Free-to-Paid Funnel)**:
   - 간병24TV 무료 영상 시청 중 '해당 질환 심화 교안 1장 무료 다운로드' 팝업 유도.
   - '전문간병사 취득 시 기대 수익/취업률 계산기' 인터랙티브 콘텐츠 연계.
3. **라이브 Q&A 및 전문가 특강**:
   - 간병24TV 라이브 스트리밍과 연동된 실시간 채팅 및 질의응답 세션.
   - 의사, 전문간호사, 스타 전문간병사의 월간 라이브 케어 컨퍼런스 송출.
4. **수강생 커뮤니티 & 실전 케어 Q&A**:
   - "간병24TV 현장 고민상담소" 게시판: 환자 질환 상태별 간병 팁 상호 공유 및 전문가 피드백.

---

## 3. 사용자 경험(UX) 관점 디자인 원칙 및 인터페이스 설계 가이드라인

ecare24는 주요 수강생(50~60대 중장년 간병인), 환자 보호자, 콜센터 상담원, 총괄 관리자 등 상이한 사용자의 페르소나를 정밀 분석하여 맞춤형 UX 원칙을 적용합니다.

### 3.1 4대 핵심 사용자 페르소나 및 UX 목표

| 페르소나 | 주요 연령 / 특성 | 핵심 요구사항 및 심리적 허들 | UX 설계 핵심 목표 |
| :--- | :--- | :--- | :--- |
| **전문간병 수강생** | 50~60대 중장년, 요양보호사 | 노안으로 작은 글씨 기피, 복잡한 UI 및 뎁스(Depth) 조작 어려움 | **실버 친화적 초직관 UI, 고대비, 원클릭 이어보기, 오디오 음성 지원** |
| **환자 보호자** | 30~50대 직장인/가족 | 환자의 중증 질환으로 인한 불안감, 전문성 검증 욕구 급박 | **16개 질환별 자격증 진위 즉시 조회, 3초 검증 뱃지, 간병24TV 신뢰도 노출** |
| **콜센터 상담원** | 20~40대 전문 CS 상담사 | 전화 인입 시 수강생/환자 정보 및 진도율, 자격 여부를 5초 내 파악 필요 | **3분할 원스크린 대시보드, CTI 연동, 상담 티켓 메모 템플릿, 단축키 지원** |
| **교육/자격 관리자** | 30~50대 운영 매니저 | 대량 시험 채점, 직능원 보고 서류 취합, 부정행위 모니터링 부담 | **일괄 승인 워크플로우, 엑셀 1클릭 내보내기, 실시간 이상징후 알림** |

---

### 3.2 수강생 포털(`frontend_user`) & 모바일앱(`mobileApp`) UX 원칙

#### Principle 1. 실버 에이지(Silver Age) 접근성 극대화 (WCAG AAA 준수)
- **타이포그래피 및 가독성**:
  - 기본 본문 텍스트: 최소 **16px ~ 18px** 이상 적용.
  - 헤드라인 및 주요 CTA 버튼: **20px ~ 24px**, 볼드(Semi-bold/Bold) 가중치.
  - 가독성이 검증된 시스템 폰트(Pretendard, Apple SD 산돌고딕 Neo) 적용.
- **시력 보조 편의 기능**:
  - 상단 내비게이션 바에 영구 고정된 **[글자 크기 조절 (가- / 가 / 가+)]** 토글 버튼 제공.
  - 눈의 피로를 낮추는 **고대비 모드(High Contrast)** 및 다크 모드 1클릭 전환.
- **터치 영역 및 오조작 방지**:
  - 모바일 터치 타깃 최소 **48x48dp (웹 44x44px)** 이상 확보.
  - 인접 버튼 간 여백(Padding)을 12px 이상 두어 터치 오작동 원천 차단.

#### Principle 2. 4단계 '원클릭 패스(One-Click Pass)' 학습 동선
- **진도율 시각화 프로그레스**:
  - 16개 질환군 메인 카드 진입 시 복잡한 탭 구조 대신, `[1.교안] → [2.실기] → [3.모의고사] → [4.자격시험]`이 가로형 스텝 바(Step Indicator)로 한눈에 보임.
  - 완료된 단계는 녹색 체크 뱃지, 진행 중 단계는 펄스(Pulse) 애니메이션 강조.
- **'이어보기(Resume)' 플로팅 바**:
  - 앱/웹 진입 시 하단에 "내가 마지막으로 공부하던 [신경계 - 뇌졸중 실기 12분] 바로 이어듣기" 플로팅 배너 원클릭 제공.
- **오디오북/음성 듣기(TTS) 모드**:
  - 이동 중이거나 안구 피로도가 높은 간병사를 위해 교안 텍스트를 읽어주는 음성 플레이어 기능 탑재.

#### Principle 3. CBT 시험 스트레스 제로(Zero-Stress) 인터페이스
- **종이 감성 디지털 OMR 카드**:
  - 화면 우측(모바일은 하단 슬라이드업)에 실제 국가시험 OMR 카드 형태의 직관적인 번호 마킹판 제공.
  - 마킹되지 않은 문항 수를 붉은색 숫자로 카운트다운하여 미응시 제출 방지.
- **실시간 자동 임시 저장**:
  - 답안 선택 즉시 로컬 스토리지 및 서버에 3초 주기 자동 저장되어 모바일 통신 장애 시에도 100% 답안 복구.
- **남은 시간 음성 안내 옵션**:
  - 시험 종료 10분 전, 5분 전 화면 점멸 경고 및 부드러운 음성 안내.

#### Principle 4. 간병24TV 숏폼(Shorts) 스와이프 & 1초 유입 퍼널
- **세로형 풀스크린 스와이프**:
  - 틱톡/유튜브 숏츠와 동일한 상하 스와이프 UX로 1분 케어 꿀팁 감상.
  - 화면 하단에 고정된 반투명 CTA 칩: `[이 질환 심화 교안 무료받기]` 클릭 시 로그인/수강신청 모달로 즉시 연결.

---

### 3.3 관리자 & 콜센터 CS 포털(`frontend_admin`) UX 원칙

콜센터 상담원과 운영 관리자가 별도의 시스템 전환 없이 전화 상담과 자격 관리를 동시에 수행할 수 있도록 설계합니다.

```
+----------------------------------------------------------------------------------------------------+
|                         frontend_admin 콜센터/상담원 3분할 원스크린 레이아웃                          |
+----------------------------------------------------------------------------------------------------+
| [상단 글로벌 바] 검색창(회원명/전화번호/등록번호) | CTI 상태: [대기중/통화중] | 상담원 프로필 | 단축키 가이드 |
+----------------------------------+----------------------------------+------------------------------+
| 1열: 회원/환자 통합 프로필 (30%)   | 2열: 16대 질환 수강/자격 현황 (40%) | 3열: 실시간 상담 티켓/메모 (30%) |
+----------------------------------+----------------------------------+------------------------------+
| - 이름, 생년월일, 연락처         | - 현재 수강 중인 질환군 과정      | - 통화 유형 선택 (수강/자격/환자) |
| - 간병 경력 (요양보호사 등)       | - 4단계 진도율 실시간 바         | - 상담 템플릿 원클릭 입력       |
| - PASS 본인인증 여부             | - CBT 모의고사 응시 횟수/점수     | - 자격증 재발행/알림톡 발송      |
| - 인입 전화번호 자동 매칭(CTI)    | - 취득 자격증 진위 및 고유번호    | - 상담 완료 및 티켓 저장 (Alt+S) |
| - 최근 상담 히스토리 요약        | - 보수교육 이수/갱신 주기        | - 다음 예약 상담 일정 설정      |
+----------------------------------+----------------------------------+------------------------------+
```

1. **원스크린 3분할(Split-View) 인터페이스**:
   - 화면 전환(페이지 이동) 없이 한 화면에서 고객 정보 확인, 학습 진도 파악, 상담 내용 작성을 100% 완결.
2. **CTI(전화 교환망) 연동 팝업 프리**:
   - 전화 인입 시 별도 팝업창이 뜨는 대신, 좌측 1열 패널에 발신자 번호와 일치하는 수강생 정보가 0.5초 내 자동 로딩.
3. **상담 템플릿 및 키보드 단축키(Hotkeys) 지원**:
   - `Alt + 1`: 수강료 환불 안내 템플릿
   - `Alt + 2`: 자격시험 응시자격 미달 안내 템플릿
   - `Alt + 3`: 모바일 자격증 QR 재발송 알림톡 전송
   - `Alt + S`: 상담 저장 및 다음 호 대기 전환
4. **자격증 공적 진위 실시간 뱃지**:
   - 수강생이 자격증 번호를 문의할 때, 녹색 `[정상 인증 / 보건복지부-직능원 등록]` 또는 황색 `[보수교육 대상]` 뱃지를 직관적으로 표시.

---

## 4. 시스템 기술 아키텍처 및 폴더 구조 명세

### 4.1 기술 스택 정의

| 구분 | 주요 기술 | 상세 사양 및 목적 |
| :--- | :--- | :--- |
| **frontend_user** | React, TypeScript, Next.js / Vite | 수강생 전용 웹 포털. 실버 UX, 고대비, 반응형 UI (Tailwind CSS, TanStack Query). |
| **frontend_admin** | React, TypeScript, Vite / Next.js | 통합 관리자 및 **콜센터 CS 포털**. Ant Design / Shadcn UI, CTI 연동, 3분할 레이아웃. |
| **backend** | Node.js, NestJS, TypeScript | RESTful API, 자격증 발급 엔진, 결제 연동, 진도율 산출, 콜센터 티켓 API. Clean Architecture. |
| **mobileApp** | React Native, TypeScript (Expo or RN CLI) | 모바일 수강생 앱(iOS / Android). 오프라인 다운로드, 푸시 알림(FCM), 모바일 자격증 지갑. |
| **Database** | PostgreSQL 16+ | ACID 트랜잭션, JSONB 지원(시험 문항/답안), 전문 검색(Full-Text Search), 상담 이력 저장. |
| **Configuration** | `.env` 환경 변수 관리 | 루트 및 각 프로젝트별 환경 변수 격리 및 `.env.example` 템플릿 기반 보안 강화. |
| **Tooling/Debug** | VS Code (.vscode) | 멀티 프로젝트 통합 `launch.json`, `tasks.json` 구성으로 4개 타겟 원클릭 디버깅 보장. |
| **E2E/Automation** | Playwright (Headless Mode) | 중요 화면 자동 스크린샷 캡처(16개 질환군 상세, 모의고사, 자격증, 콜센터 화면), CI/CD 무인 검증. |

---

### 4.2 디렉토리 구조 규격 (폴더 분리)

루트 디렉토리 기준 `frontend_user/`, `frontend_admin/`, `backend/`, `mobileApp/`으로 명확히 분리합니다.

```
ecare24/
├── .env.example                           # [루트] 공통 개발 환경 변수 템플릿 (Docker 등)
├── .gitignore                             # 각 폴더별 .env 파일 커밋 방지 규칙 포함
│
├── .vscode/                               # [필수] VS Code 통합 디버깅 및 태스크 설정
│   ├── launch.json                        # backend, frontend_user, frontend_admin, mobileApp 디버그 프로파일
│   ├── tasks.json                         # 빌드, Docker 실행, DB 마이그레이션 태스크
│   └── settings.json                      # 포맷터(Prettier), 린터(ESLint) 공통 룰
│
├── frontend_user/                         # [Web-User] 수강생 학습 포털 (실버 친화 UX)
│   ├── .env.example                       # frontend_user 환경 변수 템플릿
│   ├── public/                            # 정적 에셋 (파비콘, 로고 등)
│   ├── src/
│   │   ├── api/                           # TanStack Query & Axios API 클라이언트
│   │   ├── components/                    # 재사용 UI 컴포넌트 (글자크기 조절기, 고대비 토글, 교안 뷰어)
│   │   ├── features/                      # 도메인별 기능 모듈
│   │   │   ├── diseases-16/               # 16대 질환군 커리큘럼 탐색 모듈
│   │   │   ├── lms-player/                # VOD/교안 수강 뷰어 (오디오 TTS 모드)
│   │   │   ├── exam-cbt/                  # 디지털 OMR 카드 CBT 모의고사 엔진
│   │   │   ├── certification/             # 민간자격증 발급/조회/인쇄
│   │   │   └── tv24/                      # 간병24TV 숏폼 스와이프 플레이어
│   │   ├── pages/                         # 라우트 페이지
│   │   ├── hooks/                         # 커스텀 React 훅
│   │   └── stores/                        # 전역 상태 (Zustand: 폰트 크기, 접근성 설정 등)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend_admin/                        # [Web-Admin] 통합 관리자 & 콜센터 CS 포털 (신규 추가)
│   ├── .env.example                       # frontend_admin 환경 변수 템플릿
│   ├── public/                            # 관리자 에셋
│   ├── src/
│   │   ├── api/                           # 관리자 및 CTI 전용 API 클라이언트
│   │   ├── components/                    # 관리자 공통 컴포넌트 (데이터 테이블, 모달, 차트)
│   │   ├── features/
│   │   │   ├── callcenter/                # [콜센터] 3분할 원스크린 상담, CTI 연동, 상담 티켓 메모
│   │   │   ├── curriculum-mgr/            # [과정관리] 16개 질환군 콘텐츠 및 교안 업로드 관리
│   │   │   ├── question-bank/             # [시험관리] CBT 문제은행 등록 및 난이도 관리
│   │   │   ├── cert-registry/             # [자격관리] 직능원 보고용 대장, QR 검증, 일괄 발급
│   │   │   └── tv24-mgr/                  # [미디어관리] 간병24TV YouTube 동기화 및 숏폼 핀 고정
│   │   ├── pages/                         # 관리자 라우트 페이지
│   │   └── stores/                        # 상담원 세션 및 CTI 상태 관리
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                               # [API] NestJS / TypeScript 엔터프라이즈 백엔드
│   ├── .env.example                       # Backend 환경 변수 템플릿 (DB, JWT, AWS, PG, CTI)
│   ├── src/
│   │   ├── common/                        # 가드, 인터셉터, 필터, 유틸
│   │   ├── config/                        # 환경설정 모듈 (@nestjs/config, Joi 유효성 검증)
│   │   ├── database/                      # TypeORM/Prisma 마이그레이션 및 시드 데이터
│   │   └── modules/                       # 도메인별 비즈니스 로직 모듈
│   │       ├── auth/                      # 인증/인가 (JWT, PASS 본인인증)
│   │       ├── users/                     # 회원 및 간병사 프로필
│   │       ├── diseases/                  # 16개 질환군 마스터 데이터 관리
│   │       ├── courses/                   # 이론 교안, 동영상 강의, 실습 과제 관리
│   │       ├── exams/                     # 문제은행, 모의고사, CBT 자격시험 채점 엔진
│   │       ├── certificates/              # 민간자격 등록번호 발급, 검증, PDF 렌더링
│   │       ├── media-tv24/                # 유튜브 API 연동, 동영상 메타데이터 캐싱
│   │       ├── payments/                  # PG 연동 (수강신청 결제)
│   │       └── counseling/                # [신규] 콜센터 CTI 상담 티켓 및 통화 이력 관리
│   ├── package.json
│   └── tsconfig.json
│
├── mobileApp/                             # [Mobile] React Native 기반 스마트러닝 모바일 앱
│   ├── .env.example                       # mobileApp 환경 변수 템플릿
│   ├── android/                           # 안드로이드 네이티브 프로젝트
│   ├── ios/                               # iOS 네이티브 프로젝트
│   ├── src/
│   │   ├── assets/                        # 이미지, 아이콘, 폰트
│   │   ├── components/                    # 모바일 전용 컴포넌트 (실버 터치 타겟)
│   │   ├── screens/                       # 앱 화면
│   │   │   ├── HomeScreen.tsx             # 홈 (16개 질환군 그리드 + 간병24TV 핫클립)
│   │   │   ├── CourseDetailScreen.tsx     # 질환별 4단계 상세 화면 (원클릭 이어보기)
│   │   │   ├── VideoPlayerScreen.tsx      # 모바일 최적화 스트리밍 화면
│   │   │   ├── ExamScreen.tsx             # 모바일 CBT 디지털 OMR 화면
│   │   │   ├── WalletCertScreen.tsx       # 모바일 자격증 지갑 카드
│   │   │   └── TV24ShortsScreen.tsx       # 틱톡/릴스 형태 세로형 간병 쇼츠 스와이프
│   │   ├── navigation/                    # React Navigation (Stack / Tab)
│   │   └── services/                      # 오프라인 캐싱, FCM 푸시 서비스
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                                 # [E2E & Automation] Playwright 테스트 슈트
│   ├── .env.example                       # Playwright 환경 변수 템플릿
│   ├── playwright.config.ts               # Headless 모드, 뷰포트, 스크린샷 저장소 설정
│   ├── snapshots/                         # 기준(Baseline) 화면 스냅샷 저장소
│   │   ├── user-web/                      # 수강생 웹 16개 질환군, OMR CBT, 자격증
│   │   ├── admin-web/                     # 콜센터 3분할 상담화면, 자격증 대장
│   │   └── mobile/                        # 모바일 뷰 캡처본
│   └── specs/                             # 자동화 시나리오
│       ├── capture-16-diseases.spec.ts    # 16개 질환군 상세 화면 자동 캡처
│       ├── exam-process.spec.ts           # 디지털 OMR CBT 시험 응시 플로우 검증
│       ├── certificate-render.spec.ts     # 자격증 발급 및 QR코드 렌더링 화면 캡처
│       ├── callcenter-cs.spec.ts          # 콜센터 3분할 대시보드 화면 캡처
│       └── tv24-integration.spec.ts       # 간병24TV 영상 목록 및 연동 검증
│
├── docs/                                  # 프로젝트 산출물 문서
│   └── TASK_SPECIFICATION_ECARE24.md      # 본 업무지시서
├── docker-compose.yml                     # PostgreSQL 및 Redis 로컬 개발 환경 컨테이너
└── README.md
```

---

## 5. 데이터베이스(PostgreSQL) 상세 스키마 설계

### 5.1 핵심 엔티티 관계도 (ERD Conceptual Map)

```
[users] 1:1 [caregiver_profiles]
   |
   +--- 1:N ---> [course_enrollments] N:1 [courses] N:1 [disease_categories (16)]
   |                    |                      |
   |                    |                      +--- 1:N ---> [curriculum_steps (4단계)]
   |                    |                                       |
   |                    +--- 1:N ---> [step_progress]           +--- 1:N ---> [materials/videos]
   |                    |
   |                    +--- 1:N ---> [exam_attempts] N:1 [exam_papers]
   |                                         |
   |                                         v
   +--- 1:N ---> [certificates] (민간자격 발급)
   |
   +--- 1:N ---> [counseling_tickets] 1:N [counseling_logs] (콜센터 상담 이력)
```

### 5.2 주요 DDL 명세 (Table Specifications)

#### (1) 16대 질환군 카테고리 (`disease_categories`)
```sql
CREATE TABLE disease_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- 예: 'NEUROLOGY', 'RESPIRATORY'
    name_ko VARCHAR(100) NOT NULL,          -- 예: '신경계 질환군', '호흡기계 질환군'
    description TEXT,
    icon_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### (2) 교육 과정 마스터 (`courses`)
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT REFERENCES disease_categories(id),
    title VARCHAR(200) NOT NULL,
    target_disease VARCHAR(100) NOT NULL,   -- 세부 질환명 (예: '뇌졸중 후유증 간병')
    summary TEXT,
    price INT DEFAULT 0,
    required_hours INT NOT NULL,            -- 필수 이수시간 (예: 60시간)
    is_qualification_track BOOLEAN DEFAULT TRUE, -- 자격증 연계 과정 여부
    qualification_name VARCHAR(150),        -- 민간자격 명칭
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### (3) 4단계 커리큘럼 구성 (`curriculum_steps`)
```sql
CREATE TYPE step_type_enum AS ENUM ('THEORY_TEXT', 'PRACTICAL_VIDEO', 'MOCK_EXAM', 'FINAL_EXAM');

CREATE TABLE curriculum_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    step_number INT NOT NULL,               -- 1: 이론교안, 2: 실기영상, 3: 모의고사, 4: 자격시험
    step_type step_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    content_url VARCHAR(500),               -- PDF 교안 URL 또는 스트리밍 링크
    audio_tts_url VARCHAR(500),             -- [UX] 실버 사용자용 교안 음성 오디오 링크
    duration_minutes INT DEFAULT 0,
    pass_score INT DEFAULT 0,               -- 시험 단계인 경우 합격 기준 점수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### (4) CBT 문제은행 및 문항 (`exam_questions`)
```sql
CREATE TYPE question_type_enum AS ENUM ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'CASE_STUDY');

CREATE TABLE exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT REFERENCES disease_categories(id),
    question_type question_type_enum DEFAULT 'MULTIPLE_CHOICE',
    title TEXT NOT NULL,
    explanation TEXT,                       -- 해설 내용
    points INT DEFAULT 5,
    options JSONB,                          -- 객관식 보기 [{"no": 1, "text": "..."}, ...]
    correct_answer VARCHAR(100) NOT NULL,   -- 정답
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### (5) 민간자격증 발급 대장 (`certificates`)
```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_no VARCHAR(100) UNIQUE NOT NULL, -- 'EC24-2026-NEURO-XXXX'
    registry_no VARCHAR(100) NOT NULL,           -- 민간자격등록번호 (직능원 등록번호)
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    qualification_name VARCHAR(150) NOT NULL,
    grade VARCHAR(50) DEFAULT '전문간병사 1급',
    score INT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,        -- 유효기간 (2년 뒤 갱신 등)
    qr_verify_token VARCHAR(255) UNIQUE NOT NULL,
    pdf_file_url VARCHAR(500),
    is_valid BOOLEAN DEFAULT TRUE
);
```

#### (6) 콜센터 상담 티켓 및 이력 (`counseling_tickets`, `counseling_logs`) - [신규]
```sql
CREATE TYPE ticket_status_enum AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE call_category_enum AS ENUM ('COURSE_INQUIRY', 'CERT_VERIFICATION', 'PATIENT_MATCHING', 'REFUND', 'TECHNICAL');

CREATE TABLE counseling_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),       -- 상담 대상 수강생/환자
    agent_id UUID REFERENCES users(id),      -- 상담원 계정
    inbound_caller_number VARCHAR(50),       -- CTI 인입 번호
    category call_category_enum NOT NULL,
    status ticket_status_enum DEFAULT 'OPEN',
    subject VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE counseling_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES counseling_tickets(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES users(id),
    content TEXT NOT NULL,                  -- 상담 상세 메모
    call_duration_seconds INT DEFAULT 0,
    recording_file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6. 주요 환경 변수 (`.env`) 관리 체계 및 규격 명세

보안성 확보와 환경(로컬 개발, 스테이징, 상용)별 격리를 위해 모든 주요 설정값은 `.env` 파일로 관리하며, 저장소에는 템플릿인 `.env.example`만 커밋합니다.

### 6.1 백엔드 환경 변수 명세 (`backend/.env.example`)
```bash
# [서버 & DB]
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:19006
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ecare24_admin
DB_PASSWORD=ecare24_secure_password
DB_DATABASE=ecare24_db

# [보안 & 인증]
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_long
JWT_EXPIRES_IN=2h
CERT_HMAC_SECRET=hmac_secret_for_certificate_qr_verification_2026
CERT_REGISTRY_AUTHORITY_CODE=PQI-2026-ECARE24

# [간병24TV & YouTube API]
YOUTUBE_API_KEY=AIzaSyD_EXAMPLE_YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID_TV24=UC_EXAMPLE_CARE24TV_CHANNEL_ID

# [AWS S3 & CDN]
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET_NAME=ecare24-media-storage
CDN_BASE_URL=https://cdn.ecare24.kr

# [CTI 콜센터 연동]
CTI_SERVER_HOST=cti.ecare24.kr
CTI_API_SECRET=cti_secret_key_2026
```

### 6.2 수강생 웹 포털 환경 변수 명세 (`frontend_user/.env.example`)
```bash
# [API 엔드포인트]
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyD_EXAMPLE_YOUTUBE_API_KEY
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UC_EXAMPLE_CARE24TV_CHANNEL_ID
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.ecare24.kr
NEXT_PUBLIC_CERT_VERIFY_URL=http://localhost:3000/verify
NEXT_PUBLIC_APP_ROLE=USER_PORTAL
```

### 6.3 관리자 & 콜센터 포털 환경 변수 명세 (`frontend_admin/.env.example`) - [신규]
```bash
# [API 엔드포인트]
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_PORT=3001
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.ecare24.kr

# [콜센터 CTI WebSocket & WebRTC]
NEXT_PUBLIC_CTI_WS_URL=wss://cti.ecare24.kr/ws
NEXT_PUBLIC_CALL_AUTO_RECORDING=true
NEXT_PUBLIC_APP_ROLE=ADMIN_CALLCENTER
```

### 6.4 모바일 앱 환경 변수 명세 (`mobileApp/.env.example`)
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api/v1
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_CDN_BASE_URL=https://cdn.ecare24.kr
EXPO_PUBLIC_DEEP_LINK_SCHEME=ecare24://
EXPO_PUBLIC_FCM_PROJECT_ID=ecare24-push-firebase
```

### 6.5 Playwright 자동화 테스트 환경 변수 명세 (`tests/.env.example`)
```bash
PLAYWRIGHT_USER_BASE_URL=http://localhost:3000
PLAYWRIGHT_ADMIN_BASE_URL=http://localhost:3001
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_SCREENSHOT_DIR=./tests/snapshots
```

---

## 7. VS Code 개발 및 디버그 환경 설정 명세 (`.vscode`)

모든 개발자가 4대 핵심 프로젝트(`backend`, `frontend_user`, `frontend_admin`, `mobileApp`)를 즉시 디버깅할 수 있도록 `.vscode/launch.json`을 표준화합니다.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend: NestJS API Debug",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "restart": true,
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "name": "Frontend User: React Web Chrome Debug",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend_user/src",
      "sourceMaps": true
    },
    {
      "name": "Frontend Admin: React Admin Chrome Debug",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}/frontend_admin/src",
      "sourceMaps": true
    },
    {
      "name": "mobileApp: React Native Debug (Android/iOS)",
      "type": "reactnativedirect",
      "request": "launch",
      "cwd": "${workspaceFolder}/mobileApp",
      "platform": "android"
    }
  ],
  "compounds": [
    {
      "name": "Fullstack: All Web + Admin + API Debug",
      "configurations": [
        "Backend: NestJS API Debug",
        "Frontend User: React Web Chrome Debug",
        "Frontend Admin: React Admin Chrome Debug"
      ]
    }
  ]
}
```

---

## 8. Playwright Headless 모드 자동화 & 주요 화면 캡처 명세

### 8.1 도입 목적
1. **수강생 웹(`frontend_user`) 무결성 검증**: 16개 질환군 카드, 실버 UX 폰트 스케일, 디지털 OMR CBT 시험 화면 자동 캡처.
2. **관리자·콜센터 포털(`frontend_admin`) 검증**: 3분할 콜센터 상담 대시보드, CTI 팝업, 자격증 대장 화면 캡처.
3. **직능원 심사용 증빙 자동 패키징**: 민간자격 심사 기관 제출용 고해상도 풀페이지 스크린샷 무인 일괄 추출.

### 8.2 `playwright.config.ts` 설정 규격
```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './specs',
  timeout: 30 * 1000,
  fullyParallel: true,
  reporter: [['html', { outputFolder: 'reports' }], ['list']],
  use: {
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'User Web (Chrome)',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PLAYWRIGHT_USER_BASE_URL || 'http://localhost:3000' },
    },
    {
      name: 'Admin Callcenter Web (Chrome)',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 }, baseURL: process.env.PLAYWRIGHT_ADMIN_BASE_URL || 'http://localhost:3001' },
    },
    {
      name: 'Mobile App View (Pixel 7)',
      use: { ...devices['Pixel 7'], baseURL: process.env.PLAYWRIGHT_USER_BASE_URL || 'http://localhost:3000' },
    }
  ],
});
```

---

## 9. 상세 기능 명세서 (Functional Specification)

### 9.1 수강생 포털 & 모바일앱 (`frontend_user`, `mobileApp`)
| 모듈명 | 기능 ID | 기능명 | 상세 내용 |
| :--- | :--- | :--- | :--- |
| **접근성 UX** | UX-01 | 글자 크기 3단계 조절 | 상단 고정 [가- / 가 / 가+] 토글을 통한 전 화면 폰트 스케일링 |
| | UX-02 | 고대비 모드 토글 | 시력 저하 사용자를 위한 흑백 고대비 테마 원클릭 전환 |
| **16대 질환군** | DIS-01 | 질환군 카드 탐색 | 16대 질환군별 직관적 일러스트 아이콘 및 4단계 스텝 바 노출 |
| | DIS-02 | 원클릭 이어보기 | 최근 학습하던 질환군 단계로 즉시 이동하는 플로팅 배너 |
| **학습 LMS** | LMS-01 | 심화 교안 & 오디오 TTS | 워터마크 PDF 뷰어 및 교안 텍스트 음성 자동 읽기 모드 지원 |
| | LMS-02 | 실기 VOD 플레이어 | 1.5배속 제한, 80% 진도율 체크, 스킵 방지 스트리밍 |
| | LMS-03 | 실습 일지 작성 | 모바일 카메라 사진 첨부 및 현장 지도자 확인증 업로드 |
| **디지털 CBT** | EXAM-01 | 디지털 OMR 모의고사 | 종이 OMR 감성 카드 UI, 미응답 문항 카운트다운, 3초 자동저장 |
| | EXAM-02 | 정규 자격시험 응시 | 1회 응시 제한, 브라우저 이탈 방지, 즉시 자동 채점 |
| **자격증 센터** | CERT-01 | 디지털 자격증 & 지갑 | 고유등록번호, QR코드 진위인증, 모바일 지갑 카드 저장 |
| **간병24TV** | TV-01 | 숏폼 스와이프 플레이어 | 상하 스와이프 릴스 UI, 1초 교안 다운로드 유입 퍼널 |

### 9.2 통합 관리자 & 콜센터 CS 포털 (`frontend_admin`)
| 모듈명 | 기능 ID | 기능명 | 상세 내용 |
| :--- | :--- | :--- | :--- |
| **콜센터 CS** | CS-01 | 3분할 원스크린 대시보드 | 좌:고객정보/CTI, 중:16대 질환 수강진도/자격증, 우:상담메모 |
| | CS-02 | CTI 전화 인입 자동 팝업 | 발신 번호 매칭을 통한 수강생 프로필 및 진도율 0.5초 즉시 로딩 |
| | CS-03 | 상담 템플릿 & 단축키 | 환불, 응시자격, 자격증 재발송 템플릿 및 키보드 단축키(Alt+1~3) |
| | CS-04 | 알림톡 일괄 발송 | 모바일 자격증 QR 링크 및 강의 재수강 안내 카카오 알림톡 발송 |
| **과정 관리** | ADM-CRS-01 | 16개 질환군 편성 | 단계별 교안/VOD/오디오 파일 업로드 및 오픈 일정 관리 |
| **시험/평가** | ADM-EXM-01 | 문제은행 및 출제 | 16개 질환군별 문항 JSON 등록, 난이도 조절, 자동 무작위 시험지 구성 |
| **자격증 대장** | ADM-CRT-01 | 직능원 보고용 대장 관리 | 수검자 명부(성명, 생년월일, 취득일) 엑셀 일괄 다운로드 |
| | ADM-CRT-02 | 자격 진위 조회/갱신 | 자격증 고유번호 실시간 유효성 판정 및 보수교육 이력 관리 |
| **간병24TV** | ADM-TV-01 | YouTube 자동 연동 | 채널 재생목록 3시간 주기 동기화 및 메인 추천 숏폼 고정 |

---

## 10. AI-Driven WBS(작업 분할 구조도) 및 마일스톤 일정

본 프로젝트는 AI 에이전트 기반 **Spec-Driven Development 및 초고속 코드 생성 파이프라인을 전면 적용하여 총 4주(20영업일)** 초압축 스프린트로 진행합니다.

```
[ AI-Driven 마일스톤 로드맵 (4주 초압축 스프린트) ]

Week 1 (Sprint 1) : AI Spec-to-Code 스캐폴딩, frontend_user / frontend_admin 환경 원클릭 셋업
Week 2 (Sprint 2) : 16대 질환군 콘텐츠 엔진, 실버 UX 교안/LMS 및 간병24TV 파이프라인 구축
Week 3 (Sprint 3) : AI 문제은행 합성, 디지털 OMR CBT 엔진, 민간자격증 발급 & 콜센터 3분할 CS 구축
Week 4 (Sprint 4) : Playwright 무인 E2E 검증, 직능원 심사 증빙 추출 및 프로덕션 런칭
```

#### [Week 1 / Sprint 1] AI Spec-to-Code 스캐폴딩 및 기반 인프라 구축 (Day 1 ~ Day 5)
- **Day 1: AI 기반 DB 스키마 & Docker 인프라 원클릭 프로비저닝**
  - PostgreSQL 마이그레이션 스크립트, `counseling_tickets` 테이블 및 `docker-compose.yml` 자동 생성.
  - 루트 및 각 폴더별 `.env.example` 규격화 및 환경 변수 검증 모듈 세팅.
- **Day 2: Backend(NestJS) 도메인 모듈 초고속 AI 코드 생성**
  - 8대 도메인(auth, users, diseases, courses, exams, certificates, tv24, counseling) 보일러플레이트 일괄 생성.
- **Day 3: frontend_user, frontend_admin, mobileApp 레이아웃 스캐폴딩**
  - `frontend_user`: Tailwind 기반 실버 친화 반응형 레이아웃, 글자 크기 조절기 컴포넌트 생성.
  - `frontend_admin`: Shadcn/Ant Design 기반 콜센터 3분할 레이아웃 스캐폴딩.
  - `mobileApp`: React Native Expo/RN 기본 내비게이션 셋업.
- **Day 4: .vscode 4대 타겟 멀티 디버그 환경 연동**
  - `.vscode/launch.json`에 정의된 Backend(9229), User(3000), Admin(3001), mobileApp 원클릭 디버깅 검증.
- **Day 5: Swagger API 자동 문서화 및 프론트엔드 API 클라이언트 코드 생성**
  - TanStack Query 훅 및 TypeScript 인터페이스 자동 추출.

#### [Week 2 / Sprint 2] 16대 질환군 콘텐츠 엔진, 실버 UX LMS & 간병24TV 구축 (Day 6 ~ Day 10)
- **Day 6: 16개 질환군 표준 시드 데이터 & 교안 메타데이터 AI 대량 생성**
  - 질환군별 병태생리, 위험 징후, 필수 이수시간 JSON 데이터 AI 생성 및 임상 검수 적재.
- **Day 7: 심화 교안 뷰어(오디오 TTS 포함) & VOD 플레이어 구현**
  - 워터마크 PDF 뷰어, 교안 텍스트 음성 읽어주기 모드, 1.5배속 제한 동영상 플레이어 연동.
- **Day 8: '간병24TV' YouTube API 연동 & 숏폼 비디오 파이프라인**
  - 3시간 주기 YouTube 동기화 크론 및 웹/앱 숏폼(릴스형) 상하 스와이프 플레이어 구축.
- **Day 9: mobileApp 실버 UX 최적화 & 오프라인 캐싱**
  - 48dp 이상 터치 타깃, 원클릭 이어보기 플로팅 바, FCM 푸시 연동.
- **Day 10: 실기·실습 일지 등록 및 LMS 중간 점검**
  - 실습 일지 모바일 사진 첨부 및 지도자 확인증 업로드 모듈 연동.

#### [Week 3 / Sprint 3] CBT 자격검정 엔진, 민간자격증 발급 & 콜센터 CS 포털 (Day 11 ~ Day 15)
- **Day 11: 16개 질환군별 CBT 문제은행 AI 대량 합성 및 검수**
  - 질환군별 50문항 이상(객관식/케이스스터디/해설) JSONB 문제은행 시드 적재.
- **Day 12: 디지털 OMR 모의고사 & 정규 자격시험 UI 구현**
  - 종이 OMR 감성 번호판, 미응답 카운트다운, 3초 자동 임시저장, 이탈 경고 UI 구현.
- **Day 13: 자동 채점 엔진 및 과락 판정 알고리즘 완성**
  - 40점 과락 체크 및 60점 이상 합격 처리 DB 트랜잭션 로직 완성.
- **Day 14: 직능원 기준 민간자격증 발급 및 위·변조 방지 엔진**
  - 고유 자격등록번호(`EC24-2026-XXXX`), HMAC-SHA256 2D QR 코드 및 PDF 자격인증서 렌더링 구축.
- **Day 15: frontend_admin 콜센터 3분할 상담 대시보드 & CTI 연동**
  - CTI 인입 고객 매칭, 수강/자격 진도 실시간 조회, 상담 템플릿 메모 저장(Alt+S) 구현.

#### [Week 4 / Sprint 4] Playwright 무인 E2E 검증, 직능원 심사 서류 자동화 & 배포 (Day 16 ~ Day 20)
- **Day 16: Playwright Headless 모드 중요 화면 무인 자동 캡처 슈트 가동**
  - `frontend_user` 16개 질환군/CBT/자격증 및 `frontend_admin` 콜센터 대시보드 전수 자동 캡처.
- **Day 17: Visual Regression Testing & 크로스 브라우저/디바이스 검증**
  - 실버 UX 폰트 스케일링(가/가+) 및 고대비 모드 렌더링 무결성 100% 통과.
- **Day 18: 직능원 민간자격 등록 심사용 증빙 서류 자동 패키징**
  - 자동 캡처된 화면 보고서(HTML Report) 및 자격관리운영규정, 교육과정표 심사 패키지 일괄 생성.
- **Day 19: 스테이징 통합 리허설 및 모바일 앱 스토어 심사 빌드**
  - Docker 프로덕션 이미지 빌드, AWS 배포 파이프라인 가동, Android(AAB)/iOS(IPA) 패키징.
- **Day 20: 보안 감사(Audit) 및 프로덕션 공식 런칭**
  - 취약점 점검, 콜센터 CTI 부하 테스트, 간병24TV 채널 연계 마케팅 퍼널 가동 및 서비스 오픈.

---

## 11. 품질 기준, 비기능 요구사항 및 보안 지침

1. **보안 및 규정 준수 (Compliance & Privacy)**:
   - 개인정보보호법에 의거하여 주민등록번호 등 민감 식별자는 수집을 지양하며, 본인확인기관(KCB/NICE 등)의 CI(연계정보)/DI값을 암호화하여 저장.
   - 자격증 위·변조 방지를 위해 발급 토큰에 HMAC-SHA256 해시를 적용하고, QR 코드 스캔 시 공용 검증 API에서 유효성을 실시간 판정.
2. **콜센터 CTI 보안 및 개인정보 분리**:
   - 콜센터 상담원의 개인정보 열람 범위를 마스킹 처리(전화번호 중간 4자리 마스킹 등)하며, 상담 로그 및 녹취록은 AES-256 암호화 스토리지에 격리 보관.
3. **비디오 스트리밍 성능**:
   - 네트워크 대역폭에 따른 가변 해상도(HLS, Adaptive Bitrate Streaming) 적용으로 모바일 환경 데이터 소모 최소화.
4. **데이터 무결성 (PostgreSQL Transactions)**:
   - 시험 응시 답안 제출 및 자격증 발급 로직은 반드시 DB 트랜잭션(`SERIALIZABLE` 또는 `READ COMMITTED` 락)으로 처리하여 동시성 이슈 및 중복 발급 원천 차단.
5. **접근성 및 테스트 자동화 (Playwright)**:
   - 릴리즈 배포 전 16개 질환군 코어 페이지, 실버 UX 폰트 조절 화면, 콜센터 3분할 화면이 100% 정상 렌더링되는지 Headless 스크린샷 비교 테스트(Visual Regression Testing)를 통과해야 함.

---

## 12. 최종 산출물 및 제출 규격

개발 착수 시 각 파트별로 제출해야 할 최종 산출물 목록은 다음과 같습니다.

1. **공통/기획**:
   - 16개 질환군 표준 커리큘럼 분류표 및 민간자격 관리규정집
   - 실버 UX 및 콜센터 3분할 화면설계서(Figma 링크)
   - 프로젝트별 `.env.example` 규격 문서
2. **백엔드 (`backend/`)**:
   - PostgreSQL DDL 스크립트(콜센터 상담 테이블 포함) 및 마이그레이션 파일
   - Swagger / OpenAPI 규격서 (`http://localhost:4000/api-docs`)
3. **프론트엔드 & 모바일 앱 (`frontend_user/`, `frontend_admin/`, `mobileApp/`)**:
   - 수강생 웹 포털 소스코드 (`frontend_user/`, Port 3000)
   - 통합 관리자 및 콜센터 포털 소스코드 (`frontend_admin/`, Port 3001)
   - React Native 모바일 앱 빌드 아티팩트 (APK/AAB, IPA)
4. **품질/자동화 (`tests/`)**:
   - Playwright 테스트 스크립트 및 16개 질환군/콜센터 캡처 이미지 리포트
   - `.vscode/launch.json` 4대 타겟 디버그 구동 검증 리포트
