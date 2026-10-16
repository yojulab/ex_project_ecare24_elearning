# eCare24 UI inspect 시스템 고도화 및 규격 통일 리포트

## 1. 개요 및 요구사항 반영 결과 요약

의뢰자-에이전트 간 정밀 소통을 지원하는 UI 태그 뱃지 인스펙션 시스템에 대해 요청하신 4대 개선 사항을 완벽히 적용하고 실증 검증을 마쳤습니다.

| 요구사항 항목 | 개선 전 | 개선 후 | 검증 상태 |
| :--- | :--- | :--- | :---: |
| **1. 적용 사항 리포트 제공** | 별도 문서 없음 | 본 상세 리포트 및 전/후 비교표, 실제 적용 파일 명세 제공 | **완료 ✓** |
| **2. 용어 통일 ('UI inspect')** | 'UI 태그', '태그 ON', '인스펙션' 혼용 | **'UI inspect'**, **'UI inspect ON'**으로 전면 통일 | **완료 ✓** |
| **3. 뱃지 사이즈 1단계 축소** | 폰트 11px/10px, 패딩 4px 7px (다소 큼) | **폰트 9.5px, 패딩 2.5px 5.5px, 라운드 4px**로 콤팩트화 | **완료 ✓** |
| **4. 관리자 좌측 메뉴 뱃지 위치 일치** | 우측 끝 세로 중앙에 변칙 부착 | **타 뱃지와 동일하게 메뉴 좌상단 핀(`top: -6px; left: -4px;`) 위치로 일치화** | **완료 ✓** |

---

## 2. 세부 변경 내역 (Before vs After)

### 2-1. 용어 통일 (`UI inspect`)
화면 우측 하단 플로팅 토글 버튼(FAB), 마우스 호버 툴팁, 활성화/비활성화 토스트 알림, 클립보드 복사 안내문, 시스템 룰 문서의 모든 명칭을 **`UI inspect`**로 완전 통일했습니다.

| 위치 / 컴포넌트 | 변경 전 | 변경 후 (통일 규격) |
| :--- | :--- | :--- |
| **수강생 포털 FAB 버튼 (기본)** | `UI 인스펙터 [Alt + I]: OFF` | `🏷️ UI inspect (Alt+I)` |
| **수강생 포털 FAB 버튼 (활성)** | `UI 인스펙터 [Alt + I]: ON (뱃지 클릭시 ID 복사)` | `🏷️ UI inspect ON (Alt+I)` |
| **관리자 포털 FAB 버튼 (기본)** | `UI 인스펙터 [Alt + I]: OFF` | `🏷️ UI inspect (Alt+I)` |
| **관리자 포털 FAB 버튼 (활성)** | `UI 인스펙터 [Alt + I]: ON (뱃지 클릭시 ID 복사)` | `🏷️ UI inspect ON (Alt+I)` |
| **모바일 포털 헤더 버튼** | `UI ID` | `🏷️ UI inspect` / `🏷️ UI inspect ON` |
| **FAB 버튼 툴팁 (Title)** | `클릭하거나 Alt+I 단축키를 눌러 화면 요소별 일련번호 뱃지를 표시/숨김 토글합니다.` | `단축키 Alt+I 로 UI inspect 모드를 켜고 끌 수 있습니다` |
| **활성화 토스트 알림** | `🔍 UI 일련번호 뱃지 활성화 (Alt+I로 닫기)` | `🔍 UI inspect 활성화 (클릭 시 4대 정보 복사)` |
| **비활성화 토스트 알림** | `UI 일련번호 뱃지 숨김` | `UI inspect 비활성화 (숨김)` |
| **클립보드 복사 토스트** | `📋 [일련번호] 정보 복사 완료! (일련번호/페이지/URI/항목명)` | `📋 [일련번호] 4대 정보 복사 완료! (일련번호/페이지/URI/항목명)` |
| **콜센터 단축키 안내 툴팁** | `Alt+I(UI인스펙터)` | `Alt+I(UI inspect)` |

---

### 2-2. 뱃지 사이즈 1단계 축소 (Compact Sizing)
기존 10~11px 폰트와 넓은 패딩으로 인해 작은 버튼이나 텍스트를 일부 가리던 현상을 해소하기 위해 1단계 콤팩트 규격으로 최적화했습니다.

| 속성 (CSS Property) | 이전 규격 (Before) | 개선 규격 (After - 통일) | 시각적 효과 |
| :--- | :--- | :--- | :--- |
| **`font-size`** | `10px` ~ `11px` | **`9.5px !important`** | 글자 크기를 컴팩트하게 정돈하여 본문 가림 최소화 |
| **`padding`** | `2px 6px` ~ `4px 7px` | **`2.5px 5.5px !important`** | 뱃지 전체 면적 약 20% 축소 |
| **`line-height`** | `1.2` ~ `normal` | **`1 !important`** | 뱃지 세로 높이 정밀 고정 |
| **`border-radius`** | `4px` | **`4px`** | 가독성 높은 둥근 모서리 유지 |
| **`box-shadow`** | `0 2px 6px rgba(0,0,0,0.25)` | `0 2px 6px rgba(0,0,0,0.25)` | 시인성 높은 은은한 드롭 섀도 유지 |

---

### 2-3. 관리자 좌측 메뉴 뱃지 위치 일치화 (Top-Left Pin Alignment)
관리자 포털의 좌측 네비게이션, 사이드바, 메뉴 아이템에서 우측 끝이나 세로 중앙에 변칙 부착되던 문제를 해결하고, 모든 UI 요소와 동일하게 **좌상단 핀(`top: -6px; left: -4px;`)**으로 위치를 강제 고정했습니다.

```css
/* 관리자 좌측 메뉴 및 내비게이션 뱃지 위치 일치화 (우측/중앙 변칙 방지, 좌상단 핀 고정) */
nav .ui-serial-badge,
aside .ui-serial-badge,
.sidebar .ui-serial-badge,
.ant-menu-item .ui-serial-badge,
[data-serial-id*="COL01"] .ui-serial-badge,
[data-serial-id*="NAV"] .ui-serial-badge {
  top: -6px !important;
  left: -4px !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
}

nav .ui-serial-badge:hover,
aside .ui-serial-badge:hover,
.sidebar .ui-serial-badge:hover,
.ant-menu-item .ui-serial-badge:hover,
[data-serial-id*="COL01"] .ui-serial-badge:hover,
[data-serial-id*="NAV"] .ui-serial-badge:hover {
  transform: scale(1.1) !important;
}
```

---

## 3. 적용 대상 프로젝트별 수정 파일 일람

| 프로젝트 영역 | 대상 파일 경로 | 적용 내용 |
| :--- | :--- | :--- |
| **공통 유틸리티** | [packages/utils/src/uiTagHelper.ts](file:///apps/ex_project_ecare24_elearning/packages/utils/src/uiTagHelper.ts) | • 토스트 문구 `🔍 UI inspect 활성화 (클릭 시 4대 정보 복사)`, `UI inspect 비활성화 (숨김)`, `📋 [...] 4대 정보 복사 완료!` 반영 |
| **수강생 웹 포털** | [frontend_user/src/app/globals.css](file:///apps/ex_project_ecare24_elearning/frontend_user/src/app/globals.css) | • `.ui-serial-badge` 폰트 9.5px, 패딩 2.5px 5.5px 적용<br>• `nav`, `header`, `aside` 좌상단 핀 위치 강제 규격 추가 |
| **수강생 웹 포털** | [frontend_user/src/app/layout.tsx](file:///apps/ex_project_ecare24_elearning/frontend_user/src/app/layout.tsx) | • FAB 버튼 `🏷️ UI inspect (Alt+I)` / `🏷️ UI inspect ON (Alt+I)` 통일<br>• title 툴팁 통일 |
| **관리자/CS 포털** | [frontend_admin/src/index.css](file:///apps/ex_project_ecare24_elearning/frontend_admin/src/index.css) | • `.ui-serial-badge` 폰트 9.5px, 패딩 2.5px 5.5px 적용<br>• 관리자 좌측 메뉴/네비/컬럼 뱃지 좌상단 핀 위치 고정 및 우측/중앙 변칙 방지 규칙 탑재 |
| **관리자/CS 포털** | [frontend_admin/src/App.tsx](file:///apps/ex_project_ecare24_elearning/frontend_admin/src/App.tsx) | • FAB 버튼 `🏷️ UI inspect (Alt+I)` / `🏷️ UI inspect ON (Alt+I)` 통일<br>• title 툴팁 통일 |
| **관리자/CS 포털** | [frontend_admin/src/features/callcenter/CallCenterScreen.tsx](file:///apps/ex_project_ecare24_elearning/frontend_admin/src/features/callcenter/CallCenterScreen.tsx) | • 툴팁 단축키 안내 문구 `Alt+I(UI inspect)`로 용어 정규화 |
| **모바일 시뮬레이터** | [mobileApp/src/index.css](file:///apps/ex_project_ecare24_elearning/mobileApp/src/index.css) | • `.ui-serial-badge` 폰트 9.5px, 패딩 2.5px 5.5px 적용<br>• `header`, `nav` 뱃지 좌상단 핀 위치 일치화 |
| **모바일 시뮬레이터** | [mobileApp/src/components/SilverHeader.tsx](file:///apps/ex_project_ecare24_elearning/mobileApp/src/components/SilverHeader.tsx) | • 헤더 토글 버튼 라벨 `🏷️ UI inspect` / `🏷️ UI inspect ON` 및 툴팁 통일 |
| **하네스 시스템 룰** | [.agents/rules/ui-tagging-inspection.md](file:///apps/ex_project_ecare24_elearning/.agents/rules/ui-tagging-inspection.md) | • UI inspect 표준 용어, 9.5px 폰트 규격, 토스트 문구 및 좌상단 핀 위치 원칙 반영 |

---

## 4. 4대 핵심 정보 클립보드 복사 검증

뱃지 클릭 시 클립보드에 복사되는 데이터 포맷은 의뢰자-에이전트 간 피드백에 최적화된 아래 형식을 엄격히 유지합니다:

```text
- 일련번호: P01-SEC03-BTN02
- 페이지명: 한국돌봄종사자양성교육원 메인 홈
- URI: http://localhost:30010/curriculum
- 항목명: 16대 질환 무료 수강
```

클릭 시 뱃지가 1.2초간 녹색 **`[Copied! ✓]`**로 전환되며 화면 하단에 `📋 [P01-SEC03-BTN02] 4대 정보 복사 완료! (일련번호/페이지/URI/항목명)` 토스트가 팝업됩니다.

---

## 5. 결론 및 향후 유지보수 지침

1. 향후 신규 추가되는 모든 화면 컴포넌트에서도 `UiBadge` 컴포넌트를 감쌀 때 좌상단 핀 위치를 기본으로 사용합니다.
2. 단축키 `Alt + I`는 전체 워크스페이스(수강생 포털, 관리자 포털, 모바일 앱)에서 동일하게 동작하며, 언제든지 FAB 버튼 클릭 또는 단축키로 활성화/비활성화가 가능합니다.
3. 모든 문서, 소스코드, 주석, UI 버튼 텍스트에서 **`UI inspect`** 및 **`UI inspect ON`** 명칭을 공식 표준 용어로 유지합니다.
