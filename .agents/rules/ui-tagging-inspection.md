# 의뢰자 소통용 UI 일련번호 태깅 & 인스펙션 뱃지 시스템 규격
## (Client-Agent UI Tagging & Inspection System)

- **적용 대상**: `frontend_user/`, `frontend_admin/`, `mobileApp/` 및 모든 프로토타입/와이어프레임 화면
- **적용 목적**: 의뢰자(클라이언트/기획자)와 AI 에이전트/개발자 간의 피드백 소통 시, 모호한 묘사 대신 **화면(Page)과 UI 요소(Tag/Element)의 고유 일련번호**를 기반으로 100% 오차 없는 정밀한 커뮤니케이션을 실현함.

---

## 1. 일련번호 부여 규칙 (Serial Numbering Convention)

모든 페이지 및 대화형 UI 요소는 아래 표준 포맷에 따라 유일한 식별 코드를 부여합니다.

### 1-1. 전체 식별자 구조
```text
[페이지코드]-[섹션코드]-[태그/요소코드]
예시: P01-SEC03-BTN02
```

### 1-2. 코드 구성 규칙

| 단위 | 코드 체계 | 규칙 및 예시 |
| :--- | :--- | :--- |
| **페이지 (Page)** | `P{01~99}-{도메인}` | - `P01-USER-HOME`: 수강생 메인 홈<br>- `P02-USER-COURSE-DETAIL`: 16대 질환 상세 및 4단계 수강<br>- `P03-USER-EXAM-CBT`: 디지털 OMR CBT 시험 화면<br>- `P04-ADMIN-CALLCENTER`: 콜센터 3분할 원스크린 포털<br>- `P05-ADMIN-CERT-REGISTRY`: 민간자격증 대장 및 직능원 보고 |
| **섹션 (Section)** | `SEC{01~99}-{영역}` | - `SEC01-HEADER`: 상단 글로벌 헤더<br>- `SEC02-HERO`: 메인 비주얼 배너<br>- `SEC03-DISEASE-GRID`: 16대 질환군 카드 그리드<br>- `SEC04-OMR-PANEL`: 우측 종이 감성 OMR 카드 영역<br>- `SEC05-CTI-PANEL`: 콜센터 좌측 1열 CTI 고객정보 패널 |
| **요소/태그 (Tag)** | `{타입약어}{01~99}` | - `BTN01`: 버튼 (Button)<br>- `INP01`: 입력창 (Input Text)<br>- `SEL01`: 선택박스 (Select / Dropdown)<br>- `CRD01`: 카드 컴포넌트 (Card)<br>- `MOD01`: 모달/팝업 (Modal / Dialog)<br>- `BDG01`: 뱃지/라벨 (Badge)<br>- `TAB01`: 탭 요소 (Tab Item) |

---

## 2. 단축키 인스펙션 뱃지 기능 규격

모든 프론트엔드 빌드 시 아래 인스펙션 오버레이 메커니즘을 내장합니다.

### 2-1. 단축키 토글 (Toggle Shortcut) 및 FAB 버튼
- **전역 단축키**: **`Alt + I`** (UI inspect 모드 토글) 또는 **`Ctrl + Shift + T`**
- **플로팅 FAB 버튼 규격**:
  - 기본 상태(OFF): `🏷️ UI inspect (Alt+I)`
  - 활성화 상태(ON): `🏷️ UI inspect ON (Alt+I)`
  - 툴팁 안내: `단축키 Alt+I 로 UI inspect 모드를 켜고 끌 수 있습니다`
- **토스트 알림 규격**:
  - 활성화: `🔍 UI inspect 활성화 (클릭 시 4대 정보 복사)`
  - 비활성화: `UI inspect 비활성화 (숨김)`

### 2-2. 뱃지 시각 스타일 및 위치 규격 (Badge Styling & Positioning)
- **위치 일관성 원칙**: 메뉴, 내비게이션, 본문 카드 등 모든 컴포넌트에서 **좌상단(Top-Left Pin: `top: -6px; left: -4px;`)**으로 위치 통일 (우측 끝 세로 중앙 등 변칙 배치 절대 금지).
- **디자인 규격**:
  - **폰트**: 9.5px (ui-monospace, 700 bold)
  - **패딩**: 2.5px 5.5px (컴팩트 1단계 축소 규격)
  - **모서리**: border-radius: 4px
  - **배경/테두리**: 고대비 다크 바이올렛/인디고 배경 (`#4f46e5`), 1px 반투명 화이트 보더
- **마우스 호버**: 스케일 1.1배 확대 및 툴팁 노출.

### 2-3. 원클릭 클립보드 복사 (Click to Copy)
- **동작**:
  1. 의뢰자가 수정하고 싶은 요소의 일련번호 뱃지를 마우스로 클릭/터치.
  2. 클립보드에 **4대 필수 정보(일련번호, 페이지명, URI, 항목명)**가 정돈된 포맷으로 즉시 복사됨 (`navigator.clipboard.writeText`).
     - 페이지명은 자동으로 `{화면명} ({화면코드}) - {서비스명}` 형태로 결합됩니다.
     - SPA 화면 전환 시 URL hash(`#tab=...`)가 실시간 동기화되어 URI에 정확히 남습니다.
     ```text
     - 일련번호: P41-SEC01-RESUME
     - 페이지명: 홈 대시보드 (P-41) - eCare24 스마트러닝
     - URI: https://third.axfoundly.com/#tab=home
     - 항목명: 모바일 강의 이어보기 카드
     ```
     또는 범용 표준 예시:
     ```text
     - 일련번호: S03-SEC03-CRD01
     - 페이지명: 홈 대시보드 (S-03) - WorkshopSync
     - URI: https://venus.axfoundly.com/#tab=home
     - 항목명: 내 미션 현황 카드
     ```
  3. 뱃지 라벨이 1.2초간 녹색 **`[Copied! ✓]`**로 바뀌며 하단에 상세 토스트 알림 발생(`📋 [일련번호] 4대 정보 복사 완료! (일련번호/페이지/URI/항목명)`).

---

## 3. 의뢰자-에이전트 협업 소통 시나리오

```
[의뢰자 (클라이언트)]
  1. Alt + I 를 눌러 화면의 인스펙션 뱃지를 켠다.
  2. 수정하고 싶은 카드의 뱃지를 클릭한다 -> 일련번호, 페이지명, URI, 항목명이 클립보드 자동 복사.
  3. 채팅창에 붙여넣기(Ctrl+V)하여 요청:
     - 일련번호: P41-SEC01-RESUME
     - 페이지명: 홈 대시보드 (P-41) - eCare24 스마트러닝
     - URI: https://third.axfoundly.com/#tab=home
     - 항목명: 모바일 강의 이어보기 카드
     "위 카드의 '학습 이어하기' 버튼 색상을 에메랄드로 변경하고 완료율 게이지를 추가해주세요."

[AI 에이전트]
  1. 'P41-SEC01-RESUME' 및 제공된 URI(#tab=home)/페이지명을 통해 해당 파일/엘리먼트를 즉시 추적.
  2. 오차 없이 정확한 파일의 해당 엘리먼트를 특정하여 0.1초 만에 수정 완료.
```

---

## 4. 프론트엔드 공통 인스펙션 스크립트 규격 (`uiTagHelper.ts` / `ui-tagger.js`)

개발 단계에서 모든 웹 화면에 주입되는 경량 스크립트 표준:

```javascript
// ui-tagger.js — 의뢰자 소통용 UI 일련번호 인스펙션 엔진
(function() {
  let isInspectMode = false;
  
  // 1. 단축키 리스너 (Alt + I 또는 Ctrl + Shift + T)
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && e.key.toLowerCase() === 'i') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't')) {
      e.preventDefault();
      toggleInspector();
    }
  });

  function toggleInspector() {
    isInspectMode = !isInspectMode;
    document.body.classList.toggle('ui-inspect-active', isInspectMode);
    showToast(isInspectMode ? '🔍 UI inspect 활성화 (클릭 시 4대 정보 복사)' : 'UI inspect 비활성화 (숨김)');
  }

  // 2. 뱃지 클릭 시 4대 정보 클립보드 복사 이벤트 위임
  document.addEventListener('click', (e) => {
    const badge = e.target.closest('.ui-serial-badge');
    if (!badge) return;
    e.preventDefault();
    e.stopPropagation();

    const serialId = badge.getAttribute('data-serial-id') || badge.innerText;
    const pageName = document.title || '페이지';
    const uri = window.location.href;
    const container = badge.parentElement;
    let itemName = badge.getAttribute('data-item-name') || container?.getAttribute('data-item-name') || '';
    if (!itemName && container) {
      const clone = container.cloneNode(true);
      clone.querySelectorAll('.ui-serial-badge').forEach(b => b.remove());
      itemName = (clone.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 40);
    }
    if (!itemName) itemName = serialId;

    const copyText = [
      `- 일련번호: ${serialId}`,
      `- 페이지명: ${pageName}`,
      `- URI: ${uri}`,
      `- 항목명: ${itemName}`
    ].join('\n');

    navigator.clipboard.writeText(copyText).then(() => {
      const originalText = badge.innerText;
      badge.innerText = 'Copied! ✓';
      badge.classList.add('copied');
      setTimeout(() => {
        badge.innerText = originalText;
        badge.classList.remove('copied');
      }, 1200);
      showToast(`📋 [${serialId}] 4대 정보 복사 완료! (일련번호/페이지/URI/항목명)`);
    });
  });

  function showToast(msg) {
    let toast = document.getElementById('ui-tagger-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ui-tagger-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.className = 'ui-toast-show';
    setTimeout(() => { toast.className = ''; }, 2200);
  }
})();
```

### 4-1. 전용 스타일시트 규격
```css
/* 기본 상태는 숨김 */
.ui-serial-badge {
  display: none;
  position: absolute;
  top: -6px;
  left: -4px;
  z-index: 99999;
  background: #4f46e5;
  color: #ffffff;
  font-size: 9.5px;
  font-family: monospace;
  font-weight: 700;
  padding: 2.5px 5.5px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  transition: all 0.2s ease;
}
.ui-serial-badge:hover {
  transform: scale(1.1);
  background: #3730a3;
}
.ui-serial-badge.copied {
  background: #10b981 !important;
}

/* Alt + I 활성화 시 전체 노출 */
body.ui-inspect-active .ui-serial-badge {
  display: inline-flex !important;
  animation: badgeFadeIn 0.25s ease-out;
}
@keyframes badgeFadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 토스트 알림 */
#ui-tagger-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 24, 39, 0.95);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 100000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}
#ui-tagger-toast.ui-toast-show {
  opacity: 1;
}
```

---

## 5. 하네스 에이전트 준수 가이드라인

1. **Silver UX Specialist**:
   - `frontend_user/` 및 `mobileApp/` 컴포넌트 마크업 시 모든 주요 태그에 `data-serial-id="P01-SEC01-BTN01"` 및 일련번호 뱃지 마크업을 기본 구조로 반영하도록 스펙을 설계한다.
2. **Callcenter CS Specialist**:
   - `frontend_admin/`의 3분할 패널 및 CTI 단축키 요소에 `data-serial-id="P04-SEC01-INP01"` 등의 일련번호 앵커를 설계한다.
3. **Quality & E2E Assurer**:
   - Playwright 자동화 테스트 작성 시 복잡하고 깨지기 쉬운 CSS 셀렉터 대신 `data-serial-id` 속성을 1순위 테스트 셀렉터로 채택하여 테스트 안정성을 극대화한다.
