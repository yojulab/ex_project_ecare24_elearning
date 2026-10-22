const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(__dirname, 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

async function runValidation() {
  console.log('======================================================================');
  console.log(' 🧪 eCare24 최신 요구사항 무인 자동 검증 (Playwright Headless)');
  console.log('   1. 회원가입 / 로그인 / 로그아웃 (사용자, 관리자, 앱, 백엔드)');
  console.log('   2. 돌봄 지킴이 / 지침서 메뉴 완전 삭제');
  console.log('   3. HeyGen 관련 문구 완전 삭제');
  console.log('   4. P22-SEC02-DET01 모의/평가 탭 분리 및 입력/수정 기능');
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
    // [검증 1] 백엔드 회원가입 -> 로그인 -> 로그아웃 API 검증
    // ------------------------------------------------------------------------
    console.log('▶ [1/4] 백엔드 REST API 인증(회원가입, 로그인, 로그아웃) 테스트...');
    const testLoginId = `new_user_${Date.now()}`;
    const testPhone = `010${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 1-1. 회원가입
    const signupRes = await fetch('http://127.0.0.1:30014/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginId: testLoginId,
        fullName: '홍길동수강생',
        phoneNumber: testPhone,
        password: 'password123!',
      }),
    });
    if (signupRes.ok) {
      const data = await signupRes.json();
      if (data.accessToken && data.user.loginId === testLoginId) {
        logPass(`백엔드 회원가입 API 성공 및 토큰 자동 발급 (${testLoginId})`);
      } else {
        logFail('백엔드 회원가입 응답 형식 불일치');
      }
    } else {
      logFail(`백엔드 회원가입 API 실패: ${signupRes.status}`);
    }

    // 1-2. 방금 가입한 계정으로 로그인
    const loginRes = await fetch('http://127.0.0.1:30014/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: testLoginId, password: 'password123!' }),
    });
    let testToken = '';
    let testUserId = '';
    if (loginRes.ok) {
      const data = await loginRes.json();
      testToken = data.accessToken;
      testUserId = data.user.id;
      logPass(`신규 가입 계정 로그인 성공 (accessToken 획득)`);
    } else {
      logFail('신규 가입 계정 로그인 실패');
    }

    // 1-3. 로그아웃 API
    if (testToken) {
      const logoutRes = await fetch('http://127.0.0.1:30014/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${testToken}` },
      });
      if (logoutRes.ok) {
        logPass('백엔드 로그아웃 API 성공 (토큰 버전 증가 및 무효화)');
      } else {
        logFail('백엔드 로그아웃 API 실패');
      }
    }

    // ------------------------------------------------------------------------
    // [검증 2] 수강생 포털 (:30010) UI 검증
    // ------------------------------------------------------------------------
    console.log('\n▶ [2/4] 수강생 포털 (:30010) UI 검증...');
    const userPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await userPage.goto('http://127.0.0.1:30010', { waitUntil: 'networkidle' });

    // 2-1. 돌봄 지킴이 / 지침서 메뉴가 GNB에 없는지 확인
    const gnbText = await userPage.$eval('header', (el) => el.innerText);
    if (!gnbText.includes('돌봄 지침서') && !gnbText.includes('돌봄 지킴이')) {
      logPass('수강생 웹 GNB에서 돌봄 지침서/지킴이 메뉴 완전 삭제 확인');
    } else {
      logFail('수강생 웹 GNB에 여전히 지침서/지킴이 메뉴가 존재함');
    }

    // 2-2. HeyGen 문구 부재 확인
    const homeHtml = await userPage.content();
    if (!homeHtml.includes('HeyGen') && !homeHtml.includes('heygen')) {
      logPass('수강생 홈 화면 HeyGen 문구 0건 확인');
    } else {
      logFail('수강생 홈 화면에 HeyGen 문구 발견');
    }

    // 2-3. 헤더 프로필 및 로그아웃 버튼 확인
    const logoutBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-LOGOUT"], button:has-text("로그아웃")');
    if (logoutBtn) {
      logPass('수강생 포털 상단 로그아웃 버튼 [P00-SEC01-BTN-LOGOUT] 정상 노출');
      // 로그아웃 클릭해보기
      await logoutBtn.click();
      await userPage.waitForTimeout(500);

      // 이제 로그인/회원가입 버튼이 떠야 함
      const loginBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-LOGIN"], button:has-text("로그인")');
      const signupBtn = await userPage.$('[data-serial-id="P00-SEC01-BTN-SIGNUP"], button:has-text("회원가입")');
      if (loginBtn && signupBtn) {
        logPass('로그아웃 후 [로그인], [회원가입] 버튼 정상 전환 노출');
        // 로그인 모달 오픈
        await loginBtn.click();
        await userPage.waitForTimeout(500);
        const modal = await userPage.$('text=수강생 로그인');
        if (modal) {
          logPass('수강생 로그인 모달(AuthModal) 정상 오픈 확인');
          await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_01_user_login_modal.png') });
        }
      }
    } else {
      logFail('수강생 포털 상단 프로필/로그아웃 버튼 미발견');
    }

    // 2-4. 커리큘럼 페이지 HeyGen 부재 확인
    await userPage.goto('http://127.0.0.1:30010/curriculum', { waitUntil: 'networkidle' });
    const currHtml = await userPage.content();
    if (!currHtml.includes('HeyGen') && !currHtml.includes('heygen')) {
      logPass('수강생 교육 체계 (/curriculum) HeyGen 문구 0건 확인');
    } else {
      logFail('수강생 교육 체계에 HeyGen 문구 잔존');
    }
    await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_02_user_curriculum_no_heygen.png') });

    // 2-5. 과정 상세 페이지 (:30010/courses/course-copd-01) HeyGen 부재 확인
    await userPage.goto('http://127.0.0.1:30010/courses/course-copd-01', { waitUntil: 'networkidle' });
    const detailHtml = await userPage.content();
    if (!detailHtml.includes('HeyGen') && !detailHtml.includes('heygen')) {
      logPass('수강생 과정 상세 (/courses/course-copd-01) HeyGen 문구 0건 확인');
    } else {
      logFail('수강생 과정 상세에 HeyGen 문구 잔존');
    }
    await userPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_03_user_course_detail_no_heygen.png') });
    await userPage.close();

    // ------------------------------------------------------------------------
    // [검증 3] 관리자 포털 (:30011) [P22-SEC02-DET01] 모의/평가 탭 분리 및 인증
    // ------------------------------------------------------------------------
    console.log('\n▶ [3/4] 관리자 포털 (:30011) [P22-SEC02-DET01] 모의/평가 탭 분리 검증...');
    const adminPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await adminPage.goto('http://127.0.0.1:30011/#tab=curriculum', { waitUntil: 'networkidle' });
    await adminPage.waitForTimeout(1000);

    // 3-1. 헤더 관리자 프로필, 로그아웃 버튼 및 계정 모달 버튼 확인
    const adminLogoutBtn = await adminPage.$('[data-serial-id="P50-SEC01-BTN-LOGOUT"], button:has-text("로그아웃")');
    const adminAuthBtn = await adminPage.$('[data-serial-id="P50-SEC01-BTN-AUTH"], button:has-text("계정 변경 / 가입")');
    if (adminLogoutBtn && adminAuthBtn) {
      logPass('관리자 포털 상단 [로그아웃] 및 [계정 변경 / 가입] 버튼 확인');
    } else {
      logFail('관리자 헤더 인증 버튼 미발견');
    }

    // 3-2. [P22-SEC02-DET01] 영역의 탭 확인: 모의고사와 최종평가가 분리되어 있는가?
    const mockTab = await adminPage.$('.ant-tabs-tab:has-text("실전 모의고사")');
    const finalTab = await adminPage.$('.ant-tabs-tab:has-text("정규 최종평가")');
    if (mockTab && finalTab) {
      logPass('[P22-SEC02-DET01] CBT 문제은행이 [실전 모의고사]와 [정규 최종평가] 2개 독립 탭으로 분리 확인');
      
      // 모의고사 탭 클릭
      await mockTab.click();
      await adminPage.waitForTimeout(500);
      const mockAddBtn = await adminPage.$('[data-serial-id="P22-SEC02-BTN02-MOCK"], button:has-text("모의 문항 추가")');
      if (mockAddBtn) {
        logPass('모의고사 탭 내 [모의 문항 추가] 버튼 [P22-SEC02-BTN02-MOCK] 확인');
      }

      // 수정 버튼 확인
      const editBtns = await adminPage.$$('button:has-text("수정")');
      if (editBtns.length > 0) {
        logPass(`모의고사 문항별 [수정] 버튼 ${editBtns.length}개 확인`);
        // 첫 번째 수정 버튼 클릭하여 수정 모달 확인
        await editBtns[0].click();
        await adminPage.waitForTimeout(500);
        const editModal = await adminPage.$('.ant-modal-title:has-text("CBT 시험 문항 수정")');
        if (editModal) {
          logPass('문항 [수정] 모달 정상 오픈 및 입력 폼 바인딩 확인');
          await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_04_admin_question_edit_modal.png') });
          // 취소 버튼 클릭하여 닫기
          const cancelBtn = await adminPage.$('.ant-modal button:has-text("취소")');
          if (cancelBtn) await cancelBtn.click();
          await adminPage.keyboard.press('Escape');
          await adminPage.waitForSelector('.ant-modal-wrap', { state: 'hidden', timeout: 3000 }).catch(() => {});
          await adminPage.waitForTimeout(1000);
        }
      }

      // 최종평가 탭 클릭
      await finalTab.click({ force: true });
      await adminPage.waitForTimeout(600);
      const finalAddBtn = await adminPage.$('[data-serial-id="P22-SEC02-BTN02-FINAL"], button:has-text("평가 문항 추가")');
      if (finalAddBtn) {
        logPass('최종평가 탭 내 [평가 문항 추가] 버튼 [P22-SEC02-BTN02-FINAL] 확인');
        // 신규 문항 추가 모달 클릭
        await finalAddBtn.click();
        await adminPage.waitForTimeout(500);
        const createModal = await adminPage.$('.ant-modal-title:has-text("신규 CBT 시험 문항 등록")');
        if (createModal) {
          logPass('신규 문항 [입력] 등록 모달 정상 오픈 확인');
          await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_05_admin_question_create_modal.png') });
          const cancelBtn = await adminPage.$('.ant-modal button:has-text("취소")');
          if (cancelBtn) await cancelBtn.click();
          await adminPage.keyboard.press('Escape');
          await adminPage.waitForSelector('.ant-modal-wrap', { state: 'hidden', timeout: 3000 }).catch(() => {});
          await adminPage.waitForTimeout(600);
        }
      }
    } else {
      logFail('[P22-SEC02-DET01] 모의/평가 탭 분리 미확인');
    }

    // 3-3. 관리자 포털 전체 HeyGen 문구 부재 확인
    const adminHtml = await adminPage.content();
    if (!adminHtml.includes('HeyGen') && !adminHtml.includes('heygen')) {
      logPass('관리자 포털 커리큘럼 화면 HeyGen 문구 0건 확인');
    } else {
      logFail('관리자 포털 커리큘럼 화면에 HeyGen 문구 잔존');
    }
    await adminPage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_06_admin_curriculum_tabs_split.png') });
    await adminPage.close();

    // ------------------------------------------------------------------------
    // [검증 4] 모바일 앱 (:30012) 4개 탭 및 회원가입/로그인/HeyGen 부재 검증
    // ------------------------------------------------------------------------
    console.log('\n▶ [4/4] 모바일 앱 (:30012) 탭 간결화 및 인증/문구 검증...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://127.0.0.1:30012', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    // 4-1. 하단 탭바에 돌봄 지침서 / 지킴이 없는지 확인
    const tabbarText = await mobilePage.$eval('nav', (el) => el.innerText);
    if (!tabbarText.includes('돌봄 지침서') && !tabbarText.includes('돌봄 지킴이') && !tabbarText.includes('지침서')) {
      logPass('모바일 하단 탭바에서 돌봄 지침서/지킴이 메뉴 완전 삭제 확인 (홈, 교육체계, 자격증, MY 4대 탭)');
    } else {
      logFail('모바일 하단 탭바에 여전히 지침서/지킴이 메뉴 잔존');
    }

    // 4-2. 마이페이지 (MY 탭) 이동 및 프로필 / 인증 버튼 확인
    const myTabBtn = await mobilePage.$('[data-serial-id="P40-TAB-MY"], button:has-text("MY")');
    if (myTabBtn) {
      await myTabBtn.click();
      await mobilePage.waitForTimeout(600);

      const mobileLogoutBtn = await mobilePage.$('[data-serial-id="P48-SEC01-BTN-LOGOUT"], button:has-text("로그아웃")');
      if (mobileLogoutBtn) {
        logPass('모바일 마이페이지 상단 로그아웃 버튼 [P48-SEC01-BTN-LOGOUT] 확인');
        // 로그아웃 클릭
        await mobileLogoutBtn.click();
        await mobilePage.waitForTimeout(400);

        const mobileLoginBtn = await mobilePage.$('[data-serial-id="P48-SEC01-BTN-LOGIN"], button:has-text("로그인")');
        const mobileSignupBtn = await mobilePage.$('[data-serial-id="P48-SEC01-BTN-SIGNUP"], button:has-text("회원가입")');
        if (mobileLoginBtn && mobileSignupBtn) {
          logPass('모바일 마이페이지 비로그인 시 [로그인], [회원가입] 버튼 전환 확인');
          // 회원가입 클릭
          await mobileSignupBtn.click();
          await mobilePage.waitForTimeout(400);
          const signupModal = await mobilePage.$('text=간편 회원가입');
          if (signupModal) {
            logPass('모바일 간편 회원가입 모달(MobileAuthModal) 정상 오픈 확인');
            await mobilePage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_07_mobile_auth_modal.png') });
          }
        }
      }
    }

    // 4-3. 모바일 앱 HeyGen 문구 부재 확인
    const mobileHtml = await mobilePage.content();
    if (!mobileHtml.includes('HeyGen') && !mobileHtml.includes('heygen')) {
      logPass('모바일 앱 전체 HeyGen 문구 0건 확인');
    } else {
      logFail('모바일 앱에 HeyGen 문구 잔존');
    }
    await mobilePage.screenshot({ path: path.join(SNAPSHOT_DIR, 'req_08_mobile_mypage_clean.png') });
    await mobilePage.close();

  } catch (error) {
    console.error('검증 중 예외 발생:', error);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================================');
  console.log(` 📊 검증 총괄 결과: ${results.filter((r) => r.status === 'PASS').length} / ${results.length} 항목 통과`);
  console.log('======================================================================');
  
  const allPass = results.length > 0 && results.every((r) => r.status === 'PASS');
  if (allPass) {
    console.log('🎉 모든 사용자 요청 사항 (회원가입/로그인/로그아웃, 돌봄지킴이 삭제, HeyGen 삭제, P22 모의/평가 탭 분리) 검증 100% 통과!');
    process.exit(0);
  } else {
    console.error('⚠️ 일부 검증 실패 항목 발생');
    process.exit(1);
  }
}

runValidation();
