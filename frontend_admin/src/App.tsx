import React, { useState, useEffect } from 'react';
import { Button, Tag } from 'antd';
import { Headphones, BookOpen, Award, Sparkles } from 'lucide-react';
import { initUiInspectorGlobalListener } from '@ecare24/utils';
import CallCenterScreen from './features/callcenter/CallCenterScreen';
import CurriculumManager from './features/curriculum/CurriculumManager';
import CertRegistry from './features/certificates/CertRegistry';
import UiBadge from './components/UiBadge';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CALLCENTER' | 'CURRICULUM' | 'CERT'>('CALLCENTER');
  const [isInspectorActive, setIsInspectorActive] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* 관리자 글로벌 서브 내비게이션 바 */}
      <nav className="bg-slate-950 text-white px-5 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <UiBadge serialId="P20-NAV01-BTN01" label="[P20-NAV01-BTN01]">
            <Button
              type={activeTab === 'CALLCENTER' ? 'primary' : 'text'}
              size="small"
              icon={<Headphones className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('CALLCENTER')}
              className={`font-bold ${
                activeTab === 'CALLCENTER' ? 'bg-indigo-600' : 'text-slate-300'
              }`}
            >
              [콜센터 CS 3분할 대시보드]
            </Button>
          </UiBadge>

          <UiBadge serialId="P20-NAV01-BTN02" label="[P20-NAV01-BTN02]">
            <Button
              type={activeTab === 'CURRICULUM' ? 'primary' : 'text'}
              size="small"
              icon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('CURRICULUM')}
              className={`font-bold ${
                activeTab === 'CURRICULUM' ? 'bg-indigo-600' : 'text-slate-300'
              }`}
            >
              [16대 질환 커리큘럼 & SNUBH 큐레이션]
            </Button>
          </UiBadge>

          <UiBadge serialId="P20-NAV01-BTN03" label="[P20-NAV01-BTN03]">
            <Button
              type={activeTab === 'CERT' ? 'primary' : 'text'}
              size="small"
              icon={<Award className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('CERT')}
              className={`font-bold ${
                activeTab === 'CERT' ? 'bg-indigo-600' : 'text-slate-300'
              }`}
            >
              [직능원 자격증 발급 대장]
            </Button>
          </UiBadge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[11px]">
            ecare24 Admin v1.0 (Mockup Engine Active)
          </span>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-xs"
          >
            수강생 웹 포털 바로가기 (:3000) ↗
          </a>
        </div>
      </nav>

      {/* 탭 콘텐츠 본문 */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'CALLCENTER' && <CallCenterScreen />}
        {activeTab === 'CURRICULUM' && <CurriculumManager />}
        {activeTab === 'CERT' && <CertRegistry />}
      </main>

      {/* 의뢰자 소통용 UI 인스펙터 플로팅 독 버튼 */}
      <div
        className={`ui-inspector-floating-dock ${isInspectorActive ? 'active' : ''}`}
        onClick={toggleInspector}
        title="클릭하거나 Alt+I 단축키를 눌러 화면 요소별 일련번호 뱃지를 표시/숨김 토글합니다."
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>
          UI 인스펙터 [Alt + I]:{' '}
          <strong className={isInspectorActive ? 'text-emerald-300' : 'text-amber-200'}>
            {isInspectorActive ? 'ON (뱃지 클릭시 ID 복사)' : 'OFF'}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default App;
