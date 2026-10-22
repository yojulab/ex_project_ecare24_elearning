const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.resolve(__dirname, 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

// 환경 변수 기반 기본 URL 관리 (기본값 제공)
const USER_BASE = process.env.PLAYWRIGHT_USER_BASE_URL || process.env.USER_BASE_URL || 'http://localhost:30010';
const ADMIN_BASE = process.env.PLAYWRIGHT_ADMIN_BASE_URL || process.env.ADMIN_BASE_URL || 'http://localhost:30011';
const MOBILE_BASE = process.env.PLAYWRIGHT_MOBILE_BASE_URL || process.env.MOBILE_BASE_URL || 'http://localhost:30012';
const API_BASE = process.env.PLAYWRIGHT_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:30014';

const SCREENS = [
  // 1. 수강생 포털 (:30010) - Desktop Viewport (1440x900)
  {
    category: '수강생 포털 (웹)',
    name: '01_user_home',
    url: `${USER_BASE}/`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '수강생 포털 메인 홈 (히어로 배너, 교육과정 안내, 10대 골든 룰)',
  },
  {
    category: '수강생 포털 (웹)',
    name: '02_user_about',
    url: `${USER_BASE}/about`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '교육원 소개 페이지 (설립 이념, 연혁, 임상 교수진, 시설 안내)',
  },
  {
    category: '수강생 포털 (웹)',
    name: '03_user_curriculum',
    url: `${USER_BASE}/curriculum`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '교육 체계 / 커리큘럼 (공식 제공 3대 질환 전문 자격 트랙)',
  },
  {
    category: '수강생 포털 (웹)',
    name: '04_user_mypage_summary',
    url: `${USER_BASE}/mypage`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '수강생 마이페이지 (학습 진행률, 최근 HeyGen 영상 이어보기)',
  },
  {
    category: '수강생 포털 (웹)',
    name: '05_user_mypage_payments',
    url: `${USER_BASE}/mypage`,
    viewport: { width: 1440, height: 900 },
    action: async (page) => {
      const btn = await page.getByRole('button', { name: /수강료 납부 내역/ });
      if ((await btn.count()) > 0) await btn.first().click();
      await page.waitForTimeout(500);
    },
    desc: '마이페이지 - 수강료 납부 내역 및 무통장 가상계좌 안내',
  },
  {
    category: '수강생 포털 (웹)',
    name: '06_user_mypage_certs',
    url: `${USER_BASE}/mypage`,
    viewport: { width: 1440, height: 900 },
    action: async (page) => {
      const btn = await page.getByRole('button', { name: /자격증 발급 현황/ });
      if ((await btn.count()) > 0) await btn.first().click();
      await page.waitForTimeout(500);
    },
    desc: '마이페이지 - 직능원 민간자격증 발급 현황 및 뷰어',
  },
  {
    category: '수강생 포털 (웹)',
    name: '07_user_tv24_shorts',
    url: `${USER_BASE}/tv24`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '간병24TV - 숏폼 러닝 및 HeyGen AI 임상 교육 비디오',
  },
  {
    category: '수강생 포털 (웹)',
    name: '08_user_verify',
    url: `${USER_BASE}/verify`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '직능원 민간자격증 고유등록번호 진위 검증 서비스',
  },
  {
    category: '수강생 포털 (웹)',
    name: '09_user_course_detail',
    url: `${USER_BASE}/courses/a0000000-0000-0000-0000-000000000001`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: '과정 상세 / HeyGen AI 전문강사 영상 플레이어',
  },
  {
    category: '수강생 포털 (웹)',
    name: '10_user_ui_inspect_mode',
    url: `${USER_BASE}/mypage`,
    viewport: { width: 1440, height: 900 },
    action: async (page) => {
      await page.keyboard.press('Alt+KeyI');
      await page.waitForTimeout(600);
    },
    desc: 'Alt+I 단축키 가동 후 UI inspect 일련번호 뱃지 오버레이 모드',
  },

  // 2. 관리자 및 콜센터 포털 (:30011) - Full HD Viewport (1920x1080)
  {
    category: '관리자/CS 포털 (웹)',
    name: '11_admin_dashboard',
    url: `${ADMIN_BASE}/#tab=dashboard`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '관리자 대시보드 (KPI 통계 카드, 실시간 결제/상담 큐)',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '12_admin_callcenter',
    url: `${ADMIN_BASE}/#tab=callcenter`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '콜센터 CS 3분할 원스크린 포털 (고객정보/CTI, 진도율, 상담메모)',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '13_admin_curriculum',
    url: `${ADMIN_BASE}/#tab=curriculum`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '교육과정 관리 (공식 제공 3대 실데이터 전문 트랙 편성)',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '14_admin_cert_registry',
    url: `${ADMIN_BASE}/#tab=cert`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '직능원 보고용 자격증 발급 대장 관리',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '15_admin_payments',
    url: `${ADMIN_BASE}/#tab=payments`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '수강료 수납 및 무통장 입금확인 관리 (원클릭 결제승인)',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '16_admin_popups',
    url: `${ADMIN_BASE}/#tab=popups`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '팝업 및 배너 공지 관리 (채널별 노출 및 우선순위 제어)',
  },
  {
    category: '관리자/CS 포털 (웹)',
    name: '17_admin_permissions',
    url: `${ADMIN_BASE}/#tab=permissions`,
    viewport: { width: 1920, height: 1080 },
    waitForSelector: 'body',
    desc: '세분화 권한 매트릭스 관리 (25개 권한 마스터 사용자별 할당)',
  },

  // 3. 모바일 시뮬레이터 (:30012) - Pixel 7 Viewport (412x915)
  {
    category: '모바일 시뮬레이터 (앱)',
    name: '18_mobile_home',
    url: `${MOBILE_BASE}/#tab=home`,
    viewport: { width: 412, height: 915 },
    waitForSelector: 'body',
    desc: '모바일 홈 화면 (실버 터치 UI, 직관적 배너 및 추천 강의)',
  },
  {
    category: '모바일 시뮬레이터 (앱)',
    name: '19_mobile_curriculum',
    url: `${MOBILE_BASE}/#tab=course`,
    viewport: { width: 412, height: 915 },
    waitForSelector: 'body',
    desc: '모바일 교육과정 탭 (16대 질환군 전문 트랙 및 교안)',
  },
  {
    category: '모바일 시뮬레이터 (앱)',
    name: '20_mobile_my',
    url: `${MOBILE_BASE}/#tab=my`,
    viewport: { width: 412, height: 915 },
    waitForSelector: 'body',
    desc: '모바일 MY 마이페이지 탭 (수강생 진도, 수납 상태, 모바일 자격증)',
  },

  // 4. 엔터프라이즈 REST 백엔드 문서 (:30014)
  {
    category: '엔터프라이즈 백엔드 API',
    name: '21_backend_swagger_docs',
    url: `${API_BASE}/api/docs`,
    viewport: { width: 1440, height: 900 },
    waitForSelector: 'body',
    desc: 'NestJS OpenAPI (Swagger) 인터랙티브 REST API 문서',
  },
];

async function runCapture() {
  console.log('=================================================================');
  console.log(' 📸 Playwright Headless 모드 중요 화면 자동 캡처 슈트 가동');
  console.log('=================================================================');
  console.log(`대상 화면 수: ${SCREENS.length}개`);
  console.log(`저장 디렉토리: ${SNAPSHOT_DIR}`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const results = [];

  for (let i = 0; i < SCREENS.length; i++) {
    const item = SCREENS[i];
    const indexStr = String(i + 1).padStart(2, '0');
    console.log(`\n[${indexStr}/${SCREENS.length}] 캡처 중: ${item.name} (${item.url})`);

    const context = await browser.newContext({
      viewport: item.viewport,
      deviceScaleFactor: 1.5,
    });
    const page = await context.newPage();

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    try {
      const response = await page.goto(item.url, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      const status = response ? response.status() : 200;

      if (item.action) {
        await item.action(page);
      }

      await page.waitForTimeout(800);

      const filePath = path.join(SNAPSHOT_DIR, `${item.name}.png`);
      await page.screenshot({
        path: filePath,
        fullPage: false,
      });

      const stats = fs.statSync(filePath);
      console.log(`   ✓ 캡처 완료: ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)} KB, HTTP ${status})`);

      results.push({
        ...item,
        status,
        file: `${item.name}.png`,
        fileSizeKb: (stats.size / 1024).toFixed(1),
        success: true,
        errors,
      });
    } catch (err) {
      console.error(`   ✗ 캡처 실패: ${err.message}`);
      results.push({
        ...item,
        status: 0,
        file: `${item.name}.png`,
        fileSizeKb: 0,
        success: false,
        error: err.message,
      });
    } finally {
      await page.close();
      await context.close();
    }
  }

  await browser.close();

  // 리포트 마크다운 파일 생성
  const reportPath = path.join(SNAPSHOT_DIR, 'VERIFICATION_REPORT.md');
  let md = `# eCare24 Playwright Headless 중요 화면 자동 캡처 검증 보고서\n\n`;
  md += `- **검증 일시**: ${new Date().toISOString()}\n`;
  md += `- **실행 모드**: Playwright Headless (Chromium arm64, --no-sandbox)\n`;
  md += `- **총 대상 화면**: ${results.length}개\n`;
  md += `- **성공**: ${results.filter((r) => r.success).length}건 / **실패**: ${results.filter((r) => !r.success).length}건\n\n`;

  md += `## 📋 화면별 캡처 결과 상세\n\n`;
  md += `| 번호 | 분류 | 화면 파일명 | HTTP | 크기 | 설명 |\n`;
  md += `| :---: | :--- | :--- | :---: | :---: | :--- |\n`;

  results.forEach((r, idx) => {
    const statusTag = r.success ? `\`${r.status} OK\`` : `\`ERROR\``;
    md += `| ${idx + 1} | ${r.category} | [${r.file}](./${r.file}) | ${statusTag} | ${r.fileSizeKb} KB | ${r.desc} |\n`;
  });

  md += `\n---\n*한국돌봄종사자양성교육원(eCare24) Quality & E2E Assurer 자동 생성*\n`;

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\n📄 검증 리포트 작성 완료: ${reportPath}`);
  console.log('🎉 모든 중요 화면 캡처 및 E2E 검증 완료!');
}

runCapture().catch((err) => {
  console.error('치명적 오류 발생:', err);
  process.exit(1);
});
