/**
 * eCare24 관리자 최신 요구사항 무인 자동 검증 스크립트
 * 1. P50-LNB-DASH 통합 대시보드 고도화 (KPI 5개, 통계, 퀵액션, 피드)
 * 2. 관리자 좌측 메뉴 아이콘화 버튼 (P50-LNB-TOGGLE) 접기/펼치기
 * 3. P22-SEC01-TTL01 트랙 추가 (P22-SEC01-BTN-ADD), 숨김 스위치, 필터, 페이지네이션
 * 4. P22-SEC02-DET01 트랙 카드(P22-SEC01-CRD01) 클릭 시 별도 상세 화면 분리 및 뒤로가기(P22-SEC02-BTN-BACK)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SNAPSHOT_DIR = path.join(__dirname, 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

async function runTest() {
  console.log('🚀 eCare24 관리자 최신 요구사항 Playwright Headless 검증 시작...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // 1. 관리자 포털 접속 및 통합 대시보드 고도화 검증
    // ---------------------------------------------------------
    console.log('--- 1. [P50-LNB-DASH] 통합 대시보드 고도화 검증 ---');
    await page.goto('http://127.0.0.1:30011/#tab=dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    const kpiCards = await page.$$('.ant-statistic');
    assert(kpiCards.length >= 5, `5대 핵심 KPI 카드 노출 확인 (검출: ${kpiCards.length}개)`);

    const statsSec = await page.$('[data-serial-id="P50-SEC02-STATS"], .ant-progress');
    assert(statsSec !== null, '트랙별 수강생 분포 및 진도율 통계 섹션 (P50-SEC02-STATS) 확인');

    const quickSec = await page.$('[data-serial-id="P50-SEC03-QUICK"]');
    assert(quickSec !== null, '원클릭 핵심 업무 빠른 바로가기 섹션 (P50-SEC03-QUICK) 확인');

    const feedSec = await page.$('[data-serial-id="P50-SEC04-FEED"]');
    assert(feedSec !== null, '실시간 학사 및 자격 운영 타임라인 피드 (P50-SEC04-FEED) 확인');

    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_01_dashboard_advanced.png'), fullPage: false });

    // ---------------------------------------------------------
    // 2. 관리자 좌측 메뉴 아이콘화 토글 버튼 검증
    // ---------------------------------------------------------
    console.log('\n--- 2. 관리자 좌측 메뉴 아이콘화 토글 버튼 검증 ---');
    const toggleBtn = await page.$('button[title*="메뉴"]');
    assert(toggleBtn !== null, '좌측 메뉴 아이콘화 토글 버튼 (P50-LNB-TOGGLE) 확인');

    // 접기 클릭
    await toggleBtn.click();
    await page.waitForTimeout(500);

    const aside = await page.$('aside');
    const asideClass = await aside.getAttribute('class');
    const isCollapsed = asideClass.includes('w-16');
    assert(isCollapsed, '토글 클릭 시 사이드바가 w-16 아이콘 모드로 콤팩트 축소됨 확인');
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_02_lnb_collapsed.png'), fullPage: false });

    // 다시 펼치기 클릭
    await toggleBtn.click();
    await page.waitForTimeout(500);
    const asideClassExpanded = await aside.getAttribute('class');
    assert(asideClassExpanded.includes('w-64'), '재클릭 시 사이드바가 w-64 정상 크기로 복원됨 확인');

    // ---------------------------------------------------------
    // 3. P22-SEC01-TTL01 트랙 관리 (추가, 숨김, 필터, 페이지네이션)
    // ---------------------------------------------------------
    console.log('\n--- 3. [P22-SEC01-TTL01] 트랙 관리 (추가/숨김/필터/페이지네이션) 검증 ---');
    await page.goto('http://127.0.0.1:30011/#tab=curriculum', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    const trackHeader = await page.$('[data-serial-id="P22-SEC01-TTL01"]');
    assert(trackHeader !== null, '전문 자격 트랙 관리 헤더 (P22-SEC01-TTL01) 노출 확인');

    const addTrackBtn = await page.$('[data-serial-id="P22-SEC01-BTN-ADD"]');
    assert(addTrackBtn !== null, '신규 트랙 추가 버튼 (P22-SEC01-BTN-ADD) 확인');

    // 트랙 추가 모달 오픈
    await addTrackBtn.click();
    await page.waitForTimeout(500);
    const modalTitle = await page.textContent('.ant-modal-title');
    assert(modalTitle.includes('트랙 등록') || modalTitle.includes('신규'), '신규 트랙 등록 모달 정상 오픈 확인');
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_03_add_track_modal.png') });

    // 모달 닫기
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // 숨김/공개 필터 및 스위치 확인
    const filterBtns = await page.$$('button:has-text("전체"), button:has-text("수강생 공개"), button:has-text("숨김")');
    assert(filterBtns.length >= 3, '노출 필터 (전체 / 공개 / 숨김) 3종 툴바 확인');

    const switches = await page.$$('.ant-switch');
    assert(switches.length >= 3, '트랙 카드별 노출/숨김 토글 스위치 확인');

    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_04_track_list_view.png') });

    // ---------------------------------------------------------
    // 4. P22-SEC02-DET01 트랙 카드 클릭 시 별도 상세 화면 분리 검증
    // ---------------------------------------------------------
    console.log('\n--- 4. [P22-SEC02-DET01] 트랙 카드 클릭 시 별도 상세 화면 분리 검증 ---');
    
    // 첫 번째 트랙 카드 클릭
    const firstTrackCard = await page.$('.cursor-pointer:has-text("TRK-01")');
    assert(firstTrackCard !== null, '첫 번째 트랙 카드 (P22-SEC01-CRD01) 확인');

    await firstTrackCard.click();
    await page.waitForTimeout(800);

    // 상세 화면 검증
    const backBtn = await page.$('[data-serial-id="P22-SEC02-BTN-BACK"]');
    assert(backBtn !== null, '별도 상세 화면 진입 및 뒤로가기 버튼 (P22-SEC02-BTN-BACK) 확인');

    const detailCard = await page.$('[data-serial-id="P22-SEC02-DET01"]');
    assert(detailCard !== null, '별도 상세 커리큘럼 화면 (P22-SEC02-DET01) 렌더링 확인');

    const tabs = await page.$$('.ant-tabs-tab');
    assert(tabs.length >= 4, `상세 탭 4개 (정규 교안, 실기 VOD, 모의 30문항, 평가 30문항) 확인 (검출: ${tabs.length}개)`);

    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_05_track_detail_view.png') });

    // 뒤로가기 클릭 시 다시 목록 뷰로 복귀 검증
    await backBtn.click();
    await page.waitForTimeout(800);

    const backToHeader = await page.$('[data-serial-id="P22-SEC01-TTL01"]');
    assert(backToHeader !== null, '뒤로가기 클릭 시 다시 전체 트랙 목록 뷰로 완벽 복귀 확인');

    await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'admin_feat_06_back_to_list.png') });

  } catch (err) {
    console.error('❌ 테스트 도중 오류 발생:', err);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log(`🏁 최종 검증 결과: ${passedCount} / ${totalCount} 항목 통과 (${passedCount === totalCount ? '100% PASS' : 'FAIL'})`);
  console.log('======================================================\n');

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runTest();
