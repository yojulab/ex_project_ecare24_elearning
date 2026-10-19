import React, { useState, useEffect } from 'react';
import { Button, Tag, Avatar } from 'antd';
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
  const [isInspectorActive, setIsInspectorActive] = useState(false);

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

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = `#tab=${tab.toLowerCase()}`;
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
          <div className="flex items-center gap-2 font-bold tracking-tight text-sm text-indigo-400">
            <span>🏥 한국돌봄종사자양성교육원</span>
            <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-mono">
              Admin Suite v2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Avatar size="small" className="bg-indigo-600 font-bold">관</Avatar>
            <span className="font-semibold">시스템관리자(admin)</span>
            <Tag color="cyan" className="mr-0 text-[10px] font-mono">25개 전권 보유</Tag>
          </div>

          <a
            href="http://localhost:30010"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold underline text-xs transition"
          >
            <span>수강생 포털 (:30010)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* 2. 좌측 LNB + 우측 콘텐츠 영역 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 LNB 사이드바 */}
        <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              핵심 운영 및 CS
            </div>

            <UiBadge serialId="P50-LNB-DASH" label="[P50-LNB-DASH]">
              <button
                onClick={() => handleTabChange('DASHBOARD')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>통합 대시보드</span>
              </button>
            </UiBadge>

            <UiBadge serialId="P52-LNB-CALL" label="[P52-LNB-CALL]">
              <button
                onClick={() => handleTabChange('CALLCENTER')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'CALLCENTER'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>콜센터 CS (3분할 원스크린)</span>
              </button>
            </UiBadge>

            <UiBadge serialId="P56-LNB-PAY" label="[P56-LNB-PAY]">
              <button
                onClick={() => handleTabChange('PAYMENTS')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'PAYMENTS'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>납부 & 입금확인 관리</span>
              </button>
            </UiBadge>

            <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              교육 및 자격 관리
            </div>

            <UiBadge serialId="P51-LNB-CRS" label="[P51-LNB-CRS]">
              <button
                onClick={() => handleTabChange('CURRICULUM')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'CURRICULUM'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>16대 질환 커리큘럼 & HeyGen</span>
              </button>
            </UiBadge>

            <UiBadge serialId="P53-LNB-CERT" label="[P53-LNB-CERT]">
              <button
                onClick={() => handleTabChange('CERT')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'CERT'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>직능원 자격증 발급 대장</span>
              </button>
            </UiBadge>

            <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              공지 및 시스템
            </div>

            <UiBadge serialId="P58-LNB-POP" label="[P58-LNB-POP]">
              <button
                onClick={() => handleTabChange('POPUPS')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'POPUPS'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>팝업 공지 관리</span>
              </button>
            </UiBadge>

            <UiBadge serialId="P59-LNB-SYS" label="[P59-LNB-SYS]">
              <button
                onClick={() => handleTabChange('PERMISSIONS')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'PERMISSIONS'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>권한 매트릭스 (역할없음)</span>
              </button>
            </UiBadge>
          </div>

          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500">
            <div>REST API: :30013</div>
            <div>PostgreSQL 17 Clean DB</div>
          </div>
        </aside>

        {/* 메인 콘텐츠 화면 */}
        <main
          className="flex-1 overflow-auto bg-slate-100"
          data-service-name="eCare24 관리자"
          data-page-name={`${pageInfo.name} (${pageInfo.code})`}
        >
          {activeTab === 'DASHBOARD' && <DashboardScreen />}
          {activeTab === 'CALLCENTER' && <CallCenterScreen />}
          {activeTab === 'CURRICULUM' && <CurriculumManager />}
          {activeTab === 'CERT' && <CertRegistry />}
          {activeTab === 'PAYMENTS' && <PaymentManager />}
          {activeTab === 'POPUPS' && <PopupNoticeManager />}
          {activeTab === 'PERMISSIONS' && <PermissionMatrix />}
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
    </div>
  );
};

export default App;
