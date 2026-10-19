const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. /courses/1 이동');
  await page.goto('http://localhost:30010/courses/1', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // 팝업 오버레이 모두 제거
  await page.evaluate(() => {
    document.querySelectorAll('.fixed.inset-0, [role="dialog"]').forEach(el => el.remove());
  });
  await page.waitForTimeout(500);

  // Step 1 스크린샷 (문구형 교안)
  await page.screenshot({ path: 'tests/snapshots/23_courses_step1_text_curriculum.png' });
  console.log('✓ 23_courses_step1_text_curriculum.png 저장 완료');

  // 1. Step 2 클릭
  console.log('2. Step 2 클릭');
  const step2Btn = await page.waitForSelector('[data-serial-id="P02-SEC02-STP02"] button', { timeout: 5000 });
  await step2Btn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/snapshots/24_courses_step2_heygen_video.png' });
  console.log('✓ 24_courses_step2_heygen_video.png 저장 완료');

  // 2. Step 4 클릭 (실제 시험)
  console.log('3. Step 4 클릭');
  const step4Btn = await page.waitForSelector('[data-serial-id="P02-SEC02-STP04"] button', { timeout: 5000 });
  await step4Btn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tests/snapshots/25_courses_step4_real_exam.png' });
  console.log('✓ 25_courses_step4_real_exam.png 저장 완료');

  // 3. 실시간 제출 및 합격증
  console.log('4. 시험 제출');
  const submitBtn = await page.waitForSelector('button:has-text("답안 최종 제출")', { timeout: 5000 });
  await submitBtn.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'tests/snapshots/26_courses_step4_realtime_passed_cert.png' });
  console.log('✓ 26_courses_step4_realtime_passed_cert.png 저장 완료 (실시간 합격증)');

  await browser.close();
  console.log('🎉 모든 추가 캡처 100% 완료!');
}

run().catch(err => {
  console.error('캡처 에러:', err);
  process.exit(1);
});
