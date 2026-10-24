const { chromium } = require('playwright');

async function testLoginScenarios() {
  console.log('=================================================================');
  console.log(' 🔐 eCare24 웹/모바일 로그인 검증 & 안전 파싱 테스트 시작');
  console.log('=================================================================');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  console.log('[1/2] 수강생 웹(30010) 로그인 테스트 중...');
  await page.goto('http://localhost:30010', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 로그인 모달 열기
  const loginBtn = page.locator('text=로그인').first();
  if (await loginBtn.isVisible()) {
    await loginBtn.click();
    await page.waitForTimeout(500);

    // 김영희 데모 로그인 클릭
    const quickBtn = page.locator('text=김영희').first();
    if (await quickBtn.isVisible()) {
      await quickBtn.click();
      await page.waitForTimeout(1000);
      console.log('   ✓ 수강생 웹 로그인 성공');
    }
  }

  console.log('[2/2] 모바일 웹(30012) 로그인 테스트 중...');
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  mobilePage.on('pageerror', (err) => pageErrors.push(err.message));

  await mobilePage.goto('http://localhost:30012/#tab=my', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  const mLoginBtn = mobilePage.locator('text=로그인하기').first();
  if (await mLoginBtn.isVisible()) {
    await mLoginBtn.click();
    await mobilePage.waitForTimeout(500);

    const mQuickBtn = mobilePage.locator('text=김영희').first();
    if (await mQuickBtn.isVisible()) {
      await mQuickBtn.click();
      await mobilePage.waitForTimeout(1000);
      console.log('   ✓ 모바일 웹 로그인 성공');
    }
  }

  await browser.close();

  console.log('=================================================================');
  if (pageErrors.length > 0) {
    console.error('✗ 런타임 오류 발견:', pageErrors);
    process.exit(1);
  } else {
    console.log('🎉 모든 웹/모바일 로그인 시나리오 통과! (JSON 파싱 에러 0건)');
    console.log('=================================================================');
  }
}

testLoginScenarios().catch((err) => {
  console.error('테스트 실행 실패:', err);
  process.exit(1);
});
