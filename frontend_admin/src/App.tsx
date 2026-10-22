import React, { useState, useEffect } from 'react';
import { Button, Tag, Avatar, message, Tooltip } from 'antd';
import {
  LayoutDashboard,
  Headphones,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { initUiInspectorGlobalListener } from '@ecare24/utils';
import CallCenterScreen from './features/callcenter/CallCenterScreen';
import CurriculumManager from './features/curriculum/CurriculumManager';
import CertRegistry from './features/certificates/CertRegistry';
import DashboardScreen from './features/dashboard/DashboardScreen';
import PaymentManager from './features/payments/PaymentManager';
import PopupNoticeManager from './features/popups/PopupNoticeManager';
import PermissionMatrix from './features/permissions/PermissionMatrix';
import UiBadge from './components/UiBadge';
import { ENV } from './config/env';
import { AdminAuthModal } from './features/auth/AdminAuthModal';

export type AdminTab =
  | 'DASHBOARD'
  | 'CALLCENTER'
  | 'CURRICULUM'
  | 'CERT'
  | 'PAYMENTS'
  | 'POPUPS'
  | 'PERMISSIONS';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  useEffect(() => {
    const syncAdminUser = () => {
      const token = localStorage.getItem('ecare24_admin_token');
      const stored = localStorage.getItem('admin_user_info');
      if (token && stored) {
        try {
          setAdminUser(JSON.parse(stored));
        } catch (e) {
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
    };
    syncAdminUser();
    window.addEventListener('storage', syncAdminUser);
    return () => window.removeEventListener('storage', syncAdminUser);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('ecare24_admin_token');
    localStorage.removeItem('admin_user_info');
    setAdminUser(null);
    message.info('관리자 계정에서 로그아웃되었습니다.');
    setIsAdminAuthModalOpen(true);
  };

  // URL Hash (#tab=...) 동기화
  useEffect(() => {
    const parseHashTab = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('callcenter')) setActiveTab('CALLCENTER');
      else if (hash.includes('curriculum')) setActiveTab('CURRICULUM');
      else if (hash.includes('cert')) setActiveTab('CERT');
      else if (hash.includes('payment')) setActiveTab('PAYMENTS');
      else if (hash.includes('popup')) setActiveTab('POPUPS');
      else if (hash.includes('permission')) setActiveTab('PERMISSIONS');
      else setActiveTab('DASHBOARD');
    };

    parseHashTab();
    window.addEventListener('hashchange', parseHashTab);
    return () => window.removeEventListener('hashchange', parseHashTab);
  }, []);

  const handleTabChange = (tab: AdminTab | string) => {
    const validTab = tab as AdminTab;
    setActiveTab(validTab);
    if (typeof window !== 'undefined') {
      window.location.hash = `#tab=${validTab.toLowerCase()}`;
    }
  };

  useEffect(() => {
    // Alt + I 단축키 및 클릭 복사 이벤트 초기화
    const cleanup = initUiInspectorGlobalListener();

    // Inspector 상태 감지 옵저버
    const observer = new MutationObserver(() => {
      setIsInspectorActive(document.body.classList.contains('ui-inspect-active'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  const toggleInspector = () => {
    const nextState = !document.body.classList.contains('ui-inspect-active');
    document.body.classList.toggle('ui-inspect-active', nextState);
    setIsInspectorActive(nextState);
  };

  const getPageInfo = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return { name: '관리자 대시보드', code: 'P50' };
      case 'CALLCENTER':
        return { name: '콜센터 CS 3분할 포털', code: 'P52' };
      case 'CURRICULUM':
        return { name: '16대 질환 커리큘럼 관리', code: 'P51' };
      case 'CERT':
        return { name: '직능원 자격증 발급 대장', code: 'P53' };
      case 'PAYMENTS':
        return { name: '수강료 납부 및 입금확인', code: 'P56' };
      case 'POPUPS':
        return { name: '팝업 공지 관리', code: 'P58' };
      case 'PERMISSIONS':
        return { name: '권한 매트릭스 관리', code: 'P59' };
      default:
        return { name: '관리자 포털', code: 'P20' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-100"
      data-service-name="eCare24 관리자"
      data-page-name={`${pageInfo.name} (${pageInfo.code})`}
    >
      {/* 1. 최상단 글로벌 헤더 */}
      <header className="bg-slate-950 text-white px-5 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <UiBadge serialId="P50-LNB-TOGGLE" label="[P50-LNB-TOGGLE]">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center border border-slate-700/60"
              title={isSidebarCollapsed ? "메뉴 펼치기" : "메뉴 아이콘화 (접기)"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-indigo-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-300" />}
            </button>
          </UiBadge>

          <div className="flex items-center gap-2 font-bold tracking-tight text-sm text-indigo-400">
            <span>🏥 한국돌봄종사자양성교육원</span>
            <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-mono">
              Admin Suite v2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {adminUser ? (
            <>
              <div className="flex items-center gap-2 text-slate-300">
                <Avatar size="small" className="bg-indigo-600 font-bold">
                  {adminUser?.fullName?.[0] || '관'}
                </Avatar>
                <span className="font-semibold">
                  {adminUser?.fullName || '관리자'}({adminUser?.loginId || 'admin'})
                </span>
                <Tag color="cyan" className="mr-0 text-[10px] font-mono">
                  25개 전권 보유
                </Tag>
              </div>

              <UiBadge serialId="P50-SEC01-BTN-LOGOUT" label="[P50-SEC01-BTN-LOGOUT]">
                <Button
                  size="small"
                  danger
                  onClick={handleAdminLogout}
                  className="text-xs"
                >
                  로그아웃
                </Button>
              </UiBadge>

              <UiBadge serialId="P50-SEC01-BTN-AUTH" label="[P50-SEC01-BTN-AUTH]">
                <Button
                  size="small"
                  onClick={() => setIsAdminAuthModalOpen(true)}
                  className="text-xs border-indigo-700 text-indigo-300 hover:text-white hover:bg-indigo-900 bg-slate-900"
                >
                  계정 변경 / 가입
                </Button>
              </UiBadge>
            </>
          ) : (
            <UiBadge serialId="P50-SEC01-BTN-LOGIN" label="[P50-SEC01-BTN-LOGIN]">
              <Button
                type="primary"
                size="small"
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 font-bold"
              >
                관리자 로그인
              </Button>
            </UiBadge>
          )}

          <a
            href={ENV.USER_PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold underline text-xs transition"
          >
            <span>수강생 포털</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* 2. 좌측 LNB + 우측 콘텐츠 영역 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 LNB 사이드바 (아이콘화 토글 지원) */}
        <aside
          className={`${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-200 ease-in-out`}
        >
          <div className="p-2 space-y-1 overflow-y-auto">
            {/* 핵심 운영 및 CS */}
            {!isSidebarCollapsed ? (
              <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                핵심 운영 및 CS
              </div>
            ) : (
              <div className="border-t border-slate-800/80 my-1" />
            )}

            <UiBadge serialId="P50-LNB-DASH" label="[P50-LNB-DASH]">
              <Tooltip title={isSidebarCollapsed ? '통합 대시보드' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('DASHBOARD')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'DASHBOARD'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>통합 대시보드</span>}
                </button>
              </Tooltip>
            </UiBadge>

            <UiBadge serialId="P52-LNB-CALL" label="[P52-LNB-CALL]">
              <Tooltip title={isSidebarCollapsed ? '콜센터 CS (3분할 원스크린)' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('CALLCENTER')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'CALLCENTER'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>콜센터 CS (3분할 원스크린)</span>}
                </button>
              </Tooltip>
            </UiBadge>

            <UiBadge serialId="P56-LNB-PAY" label="[P56-LNB-PAY]">
              <Tooltip title={isSidebarCollapsed ? '납부 & 입금확인 관리' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('PAYMENTS')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'PAYMENTS'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>납부 & 입금확인 관리</span>}
                </button>
              </Tooltip>
            </UiBadge>

            {/* 교육 및 자격 관리 */}
            {!isSidebarCollapsed ? (
              <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                교육 및 자격 관리
              </div>
            ) : (
              <div className="border-t border-slate-800/80 my-2" />
            )}

            <UiBadge serialId="P51-LNB-CRS" label="[P51-LNB-CRS]">
              <Tooltip title={isSidebarCollapsed ? '16대 질환 커리큘럼 & 실기 VOD' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('CURRICULUM')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'CURRICULUM'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>16대 질환 커리큘럼 & 실기 VOD</span>}
                </button>
              </Tooltip>
            </UiBadge>

            <UiBadge serialId="P53-LNB-CERT" label="[P53-LNB-CERT]">
              <Tooltip title={isSidebarCollapsed ? '직능원 자격증 발급 대장' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('CERT')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'CERT'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>직능원 자격증 발급 대장</span>}
                </button>
              </Tooltip>
            </UiBadge>

            {/* 공지 및 시스템 */}
            {!isSidebarCollapsed ? (
              <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                공지 및 시스템
              </div>
            ) : (
              <div className="border-t border-slate-800/80 my-2" />
            )}

            <UiBadge serialId="P58-LNB-POP" label="[P58-LNB-POP]">
              <Tooltip title={isSidebarCollapsed ? '팝업 공지 관리' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('POPUPS')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'POPUPS'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>팝업 공지 관리</span>}
                </button>
              </Tooltip>
            </UiBadge>

            <UiBadge serialId="P59-LNB-SYS" label="[P59-LNB-SYS]">
              <Tooltip title={isSidebarCollapsed ? '권한 매트릭스 (역할없음)' : ''} placement="right">
                <button
                  onClick={() => handleTabChange('PERMISSIONS')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-lg text-xs font-semibold transition ${
                    activeTab === 'PERMISSIONS'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>권한 매트릭스 (역할없음)</span>}
                </button>
              </Tooltip>
            </UiBadge>
          </div>

          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500">
            {!isSidebarCollapsed ? (
              <>
                <div className="truncate" title={ENV.API_BASE_URL}>REST API: {ENV.API_BASE_URL}</div>
                <div>PostgreSQL 17 Clean DB</div>
              </>
            ) : (
              <div className="text-center font-mono text-[10px] text-slate-600">v2.0</div>
            )}
          </div>
        </aside>

        {/* 메인 콘텐츠 화면 */}
        <main
          className="flex-1 overflow-auto bg-slate-100"
          data-service-name="eCare24 관리자"
          data-page-name={`${pageInfo.name} (${pageInfo.code})`}
        >
          {adminUser ? (
            <>
              {activeTab === 'DASHBOARD' && <DashboardScreen onNavigateTab={handleTabChange} />}
              {activeTab === 'CALLCENTER' && <CallCenterScreen />}
              {activeTab === 'CURRICULUM' && <CurriculumManager />}
              {activeTab === 'CERT' && <CertRegistry />}
              {activeTab === 'PAYMENTS' && <PaymentManager />}
              {activeTab === 'POPUPS' && <PopupNoticeManager />}
              {activeTab === 'PERMISSIONS' && <PermissionMatrix />}
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-3xl border border-slate-300 p-10 max-w-md w-full text-center shadow-xl space-y-5">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">관리자 인증이 필요합니다</h2>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    한국돌봄종사자양성교육원 학사/원무 시스템에 접근하려면 관리자 계정으로 로그인해 주십시오.
                  </p>
                </div>
                <UiBadge serialId="P50-SEC00-BTN-LOGIN" label="[P50-SEC00-BTN-LOGIN]">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setIsAdminAuthModalOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 font-extrabold rounded-xl py-5"
                  >
                    관리자 로그인 모달 열기
                  </Button>
                </UiBadge>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 의뢰자 소통용 UI inspect 플로팅 토글 버튼 */}
      <div
        className={`ui-inspector-floating-dock ${isInspectorActive ? 'active' : ''}`}
        onClick={toggleInspector}
        title="단축키 Alt+I 로 UI inspect 모드를 켜고 끌 수 있습니다"
      >
        <span className="font-semibold text-xs tracking-tight">
          {isInspectorActive ? '🏷️ UI inspect ON (Alt+I)' : '🏷️ UI inspect (Alt+I)'}
        </span>
      </div>

      {/* 관리자 로그인 및 직원 등록 모달 */}
      <AdminAuthModal
        open={isAdminAuthModalOpen}
        onCancel={() => setIsAdminAuthModalOpen(false)}
        onLoginSuccess={(user) => setAdminUser(user)}
      />
    </div>
  );
};

export default App;
