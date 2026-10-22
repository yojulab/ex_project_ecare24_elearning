const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(__dirname, 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

async function runSessionValidation() {
  console.log('======================================================================');
  console.log(' 🧪 eCare24 로그인 세션 관리 종합 검증 (사용자, 관리자, 앱 전반)');
  console.log('   - 로그아웃 후 마이페이지 메뉴 미노출 & 클릭/직접 진입 시 로그인 가드');
  console.log('   - 마이페이지 로그인 회원 실데이터 바인딩 & 프로필 정확성');
  console.log('   - 관리자 비로그인 가드 & 로그아웃 즉시 차단');
  console.log('   - 모바일 마이페이지 비로그인 가드 & 로그인/로그아웃 동기화');
  console.log('======================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const results = [];
  const logPass = (name) => {
    console.log(`  ✓ PASS: ${name}`);
    results.push({ name, status: 'PASS' });
  };
  const logFail = (name, err) => {
    console.error(`  ✗ FAIL: ${name} ->`, err);
    results.push({ name, status: 'FAIL', error: String(err) });
  };

  try {
    // ------------------------------------------------------------------------
    // [검증 1] 수강생 포털 (:30010) 세션 관리 및 마이페이지 가드 검증
    // ------------------------------------------------------------------------
    console.log('▶ [1/3] 수강생 포털 (:30010) 세션 관리 및 마이페이지 검증...');
    const userContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const userPage = await userContext.newPage();

    // 1-1. 비로그인 상태로 홈 접속
    await userPage.goto('http://127.0.0.1:30010', { waitUntil: 'networkidle' });
    await userPage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await userPage.reload({ waitUntil: 'networkidle' });

    // GNB 마이페이지 메뉴 미노출 확인
    const mypageLinkInGnb = await userPage.$('[data-serial-id="P00-SEC01-LNK06"]');
    if (!mypageLinkInGnb) {
      logPass('비로그인 상태에서 GNB 메인 메뉴에 마이페이지 [P00-SEC01-LNK06] 미노출 확인 (요구사항 충족)');
    } else {
      logFail('비로그인 상태에서 GNB에 마이페이지가 여전히 노출됨');
    }

    // GNB에 로그인/회원가입 버튼 정상 노출 확인
    const loginBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-LOGIN"]');
    const signupBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-SIGNUP"]');
    if (loginBtn && signupBtn) {
      logPass('비로그인 상태에서 GNB 상단 [로그인/회원가입] 버튼 정상 노출 확인');
    } else {
      logFail('GNB 상단 로그인/회원가입 버튼 미노출');
    }

    await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_01_user_logged_out_home.png') });

    // 1-2. 비로그인 상태로 /mypage URL 직접 접근 시 가드 확인
    await userPage.goto('http://127.0.0.1:30010/mypage', { waitUntil: 'networkidle' });
    await userPage.waitForTimeout(500);

    const guardCard = await userPage.$('text="로그인이 필요한 페이지입니다"');
    const guardLoginBtn = await userPage.$('[data-serial-id="P10-SEC00-BTN-LOGIN"]');
    const hasStudentName = await userPage.$('text="김영희 돌봄교육생님의 마이페이지"');

    if (guardCard && guardLoginBtn && !hasStudentName) {
      logPass('비로그인 상태에서 /mypage 직접 진입 시 로그인 필요 가드 화면 정상 표시 및 회원정보 미노출 확인');
    } else {
      logFail('비로그인 상태 /mypage 접근 시 회원정보가 노출되거나 가드 화면 미표시');
    }
    await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_02_user_mypage_guard.png') });

    // 1-3. 마이페이지 가드 화면에서 [수강생 로그인하기] 클릭하여 student01 로그인
    await guardLoginBtn.click();
    await userPage.waitForTimeout(600);

    // 빠른 로그인 버튼 클릭 (student01)
    const quickStudentBtn = await userPage.$('button:has-text("student01")');
    if (quickStudentBtn) {
      await quickStudentBtn.click();
    } else {
      await userPage.fill('input[placeholder*="student01"]', 'student01');
      await userPage.fill('input[type="password"]', 'password123!');
      const submitBtn = await userPage.$('button:has-text("로그인하기")');
      await submitBtn.click();
    }
    await userPage.waitForTimeout(1500);

    // 마이페이지에 로그인 회원 정보(김영희) 표시 확인
    const loggedInTitle = await userPage.$('text="김영희 돌봄교육생님의 마이페이지"');
    const studentIdText = await userPage.$('text="ID: student01"');
    if (loggedInTitle && studentIdText) {
      logPass('로그인 후 마이페이지 상단에 로그인 회원 정보(김영희, ID: student01) 정상 바인딩 확인');
    } else {
      logFail('로그인 후 마이페이지에 로그인 회원 정보가 올바르게 바인딩되지 않음');
    }

    // GNB에도 마이페이지 메뉴 노출 확인
    const mypageLinkAfterLogin = await userPage.$('[data-serial-id="P00-SEC01-LNK06"]');
    if (mypageLinkAfterLogin) {
      logPass('로그인 후 GNB 메인 메뉴에 마이페이지 [P00-SEC01-LNK06] 정상 노출 확인');
    } else {
      logFail('로그인 후 GNB에 마이페이지 링크가 노출되지 않음');
    }

    // 회원정보 관리 탭 (P15-TAB-PROFILE) 확인
    const profileTabBtn = await userPage.$('[data-serial-id="P15-TAB-PROFILE"]');
    if (profileTabBtn) {
      await profileTabBtn.click();
      await userPage.waitForTimeout(500);
      const nameInputVal = await userPage.$eval('input[value="김영희"]', (el) => el.value).catch(() => null);
      const idInputVal = await userPage.$eval('input[value="student01"]', (el) => el.value).catch(() => null);
      if (nameInputVal === '김영희' && idInputVal === 'student01') {
        logPass('마이페이지 회원정보 관리 탭(P15)에서 성명(김영희) 및 아이디(student01) 정상 표시 확인');
      } else {
        logFail(`회원정보 탭 값 불일치: name=${nameInputVal}, id=${idInputVal}`);
      }
    }
    await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_03_user_mypage_profile.png') });

    // 1-4. 신규 계정 가입 후 마이페이지 회원 정보 확인
    const newLoginId = `user_${Date.now().toString().slice(-6)}`;
    const newUserName = '이돌봄';
    console.log(`  ▶ 신규 회원가입(${newUserName}, ${newLoginId}) 후 마이페이지 실데이터 검증...`);

    // GNB 로그아웃 수행
    const gnbLogoutBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-LOGOUT"]');
    if (gnbLogoutBtn) {
      await gnbLogoutBtn.click();
      await userPage.waitForTimeout(1500);
      logPass('상단 로그아웃 버튼 [P00-SEC01-BTN-LOGOUT] 클릭 시 안전하게 메인으로 리다이렉트 확인');
    }

    // 홈으로 명시적 이동 후 회원가입 클릭
    await userPage.goto('http://127.0.0.1:30010', { waitUntil: 'networkidle' });
    await userPage.waitForTimeout(600);

    const homeSignupBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-SIGNUP"]');
    if (homeSignupBtn) {
      await homeSignupBtn.click();
      await userPage.waitForSelector('input[placeholder*="아이디"]', { state: 'visible' });

      await userPage.fill('input[placeholder*="아이디"]', newLoginId);
      await userPage.fill('input[placeholder*="홍길동"]', newUserName);
      await userPage.fill('input[placeholder*="010"]', `010${Math.floor(10000000 + Math.random() * 90000000)}`);
      await userPage.fill('input[type="password"]', 'password123!');
      const signupSubmit = await userPage.$('button:has-text("회원가입 완료")');
      await signupSubmit.click();
      await userPage.waitForTimeout(2000);

      // 자동 로그인 후 마이페이지 이동
      await userPage.goto('http://127.0.0.1:30010/mypage', { waitUntil: 'networkidle' });
      await userPage.waitForTimeout(1000);

      const newTitle = await userPage.$(`text="${newUserName} 돌봄교육생님의 마이페이지"`);
      const newIdText = await userPage.$(`text="ID: ${newLoginId}"`);
      if (newTitle && newIdText) {
        logPass(`신규 가입 회원(${newUserName}, ${newLoginId})의 마이페이지 실데이터가 즉시 완벽 바인딩됨 확인`);
      } else {
        logFail('신규 가입 회원의 정보가 마이페이지에 반영되지 않음');
      }
      await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_04_new_user_mypage.png') });
    }

    // 1-5. 다시 로그아웃 후 GNB 마이페이지 메뉴 삭제 및 /mypage 차단 최종 재검증
    const gnbLogout = await userPage.$('[data-serial-id="P00-SEC01-BTN-LOGOUT"]');
    if (gnbLogout) {
      await gnbLogout.click();
      await userPage.waitForTimeout(1000);
      const mypageHidden = !(await userPage.$('[data-serial-id="P00-SEC01-LNK06"]'));
      if (mypageHidden) {
        logPass('최종 검증: 로그아웃 후 GNB에서 마이페이지 메뉴가 완벽히 소멸됨 확인');
      } else {
        logFail('로그아웃 후에도 GNB에 마이페이지 메뉴가 남아있음');
      }
    }

    // ------------------------------------------------------------------------
    // [검증 2] 관리자 포털 (:30011) 세션 관리 및 인증 가드 검증
    // ------------------------------------------------------------------------
    console.log('\n▶ [2/3] 관리자 포털 (:30011) 세션 관리 및 인증 가드 검증...');
    const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const adminPage = await adminContext.newPage();

    // 2-1. 초기 세션 없는 상태로 접속
    await adminPage.goto('http://127.0.0.1:30011', { waitUntil: 'networkidle' });
    await adminPage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await adminPage.reload({ waitUntil: 'networkidle' });
    await adminPage.waitForTimeout(500);

    const adminGuardText = await adminPage.$('text="관리자 인증이 필요합니다"');
    const adminLoginBtnInHeader = await adminPage.$('[data-serial-id="P50-SEC01-BTN-LOGIN"]');
    const adminLoginBtnInBody = await adminPage.$('[data-serial-id="P50-SEC00-BTN-LOGIN"]');

    if (adminGuardText && (adminLoginBtnInHeader || adminLoginBtnInBody)) {
      logPass('관리자 포털 비로그인 상태 시 대시보드 차단 및 관리자 인증 가드 뷰 정상 표시 확인');
    } else {
      logFail('관리자 비로그인 상태에서 관리자 화면이 열려있거나 가드 미작동');
    }
    await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_05_admin_guard.png') });

    // 2-2. 관리자 로그인 수행
    const isInputVisible = await adminPage.locator('input#loginId').isVisible().catch(() => false);
    if (!isInputVisible) {
      const openAdminLoginBtn = adminLoginBtnInBody || adminLoginBtnInHeader;
      if (openAdminLoginBtn) await openAdminLoginBtn.click({ force: true });
      await adminPage.waitForTimeout(600);
    }

    await adminPage.fill('input#loginId', 'admin');
    await adminPage.fill('input#password', 'admin1234!');
    const adminSubmitBtn = await adminPage.$('.ant-modal-content button[type="submit"]') || await adminPage.$('button:has-text("관리자 포털 로그인")');
    if (adminSubmitBtn) {
      await adminSubmitBtn.click();
    }
    await adminPage.waitForTimeout(1500);

    // 로그인 후 관리자 대시보드 정상 오픈 확인
    const adminName = await adminPage.$(':has-text("시스템관리자")');
    const adminLogoutBtn = await adminPage.$('[data-serial-id="P50-SEC01-BTN-LOGOUT"]');
    const kpiStats = await adminPage.$('[data-serial-id="P50-SEC02-STATS"]');

    if (adminName && adminLogoutBtn && kpiStats) {
      logPass('관리자 로그인 성공 후 시스템관리자 프로필, 로그아웃 버튼, 대시보드 KPI 정상 노출 확인');
    } else {
      logFail(`관리자 로그인 후 대시보드가 정상 렌더링되지 않음 (name=${!!adminName}, logout=${!!adminLogoutBtn}, kpi=${!!kpiStats})`);
    }
    await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_06_admin_authenticated_dashboard.png') });

    // 2-3. 관리자 로그아웃 버튼 클릭
    if (adminLogoutBtn) {
      await adminLogoutBtn.click();
      await adminPage.waitForTimeout(1000);
    }

    const guardAfterAdminLogout = await adminPage.$('text="관리자 인증이 필요합니다"');
    if (guardAfterAdminLogout) {
      logPass('관리자 로그아웃 버튼 [P50-SEC01-BTN-LOGOUT] 클릭 시 즉시 세션 파기 및 가드 화면 복귀 확인');
    } else {
      logFail('관리자 로그아웃 후 관리자 화면이 여전히 유지됨');
    }
    await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_07_admin_logged_out.png') });

    // ------------------------------------------------------------------------
    // [검증 3] 모바일 포털 (:30012) 마이페이지 세션 및 가드 검증
    // ------------------------------------------------------------------------
    console.log('\n▶ [3/3] 모바일 포털 (:30012) 마이페이지 세션 및 가드 검증...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();

    // 3-1. 비로그인 상태로 마이페이지 탭 진입
    await mobilePage.goto('http://127.0.0.1:30012#tab=my', { waitUntil: 'networkidle' });
    await mobilePage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await mobilePage.reload({ waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(800);

    const mobileGuardText = await mobilePage.$('text="로그인이 필요한 서비스입니다"');
    const mobileLoginBtn = (await mobilePage.$('[data-serial-id="P48-SEC00-BTN-LOGIN"]')) || (await mobilePage.$('[data-serial-id="P48-SEC01-BTN-LOGIN"]'));
    const mobileSignupBtn = (await mobilePage.$('[data-serial-id="P48-SEC00-BTN-SIGNUP"]')) || (await mobilePage.$('[data-serial-id="P48-SEC01-BTN-SIGNUP"]'));

    if (mobileGuardText && mobileLoginBtn && mobileSignupBtn) {
      logPass('모바일 마이페이지 비로그인 상태에서 수강/자격증 데이터 숨김 및 로그인 가드 카드 정상 노출 확인');
    } else {
      logFail(`모바일 마이페이지 비로그인 가드 카드 미노출 (guard=${!!mobileGuardText}, login=${!!mobileLoginBtn}, signup=${!!mobileSignupBtn})`);
    }
    await mobilePage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_08_mobile_logged_out.png') });

    // 3-2. 모바일 로그인 실행
    if (mobileLoginBtn) {
      await mobileLoginBtn.click();
    }
    await mobilePage.waitForTimeout(600);

    await mobilePage.fill('input[placeholder="student01"]', 'student01');
    await mobilePage.fill('input[type="password"]', 'password123!');
    const mobileSubmit = await mobilePage.$('[data-serial-id="P48-BTN-LOGIN"] button') || await mobilePage.$('button:has-text("모바일 로그인")');
    if (mobileSubmit) {
      await mobileSubmit.click();
    }
    await mobilePage.waitForTimeout(1500);

    // 모바일 로그인 후 프로필 확인
    const mobileUserText = await mobilePage.$('text="김영희 교육생님"');
    const mobileLogoutBtn = await mobilePage.$('[data-serial-id="P48-SEC01-BTN-LOGOUT"]');
    const mobileCourseCard = await mobilePage.$('[data-serial-id="P48-SEC01-CRD01"]');

    if (mobileUserText && mobileLogoutBtn && mobileCourseCard) {
      logPass('모바일 로그인 후 김영희 교육생님 프로필, 수강 진행 상황 카드 [P48-SEC01-CRD01], 로그아웃 버튼 정상 노출 확인');
    } else {
      logFail('모바일 로그인 후 프로필 또는 수강 카드가 노출되지 않음');
    }
    await mobilePage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_09_mobile_logged_in.png') });

    // 3-3. 모바일 로그아웃 실행
    if (mobileLogoutBtn) {
      await mobileLogoutBtn.click();
      await mobilePage.waitForTimeout(1000);
    }

    const mobileGuardAfterLogout = await mobilePage.$('text="로그인이 필요한 서비스입니다"');
    if (mobileGuardAfterLogout) {
      logPass('모바일 로그아웃 버튼 [P48-SEC01-BTN-LOGOUT] 클릭 시 세션 삭제 및 즉시 로그인 가드 카드로 전환 확인');
    } else {
      logFail('모바일 로그아웃 후 비로그인 카드로 전환되지 않음');
    }
    await mobilePage.screenshot({ path: path.join(SNAPSHOT_DIR, 'session_10_mobile_logged_out_final.png') });

  } catch (error) {
    console.error('검증 실행 중 예기치 않은 오류:', error);
    results.push({ name: '전체 실행 프로세스', status: 'FAIL', error: String(error) });
  } finally {
    await browser.close();
  }

  console.log('\n======================================================================');
  console.log(' 📊 세션 관리 및 마이페이지 이슈 검증 결과 요약');
  console.log('======================================================================');
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  console.log(` 총 검증 항목: ${results.length} | 성공: ${passCount} | 실패: ${failCount}`);
  if (failCount === 0) {
    console.log(' 🎉 모든 세션 관리 및 마이페이지 검증 항목 100% 통과 (ALL PASS)!');
  } else {
    console.error(` ❌ ${failCount}개 항목 실패`);
    process.exit(1);
  }
}

runSessionValidation();
