import React from 'react';
import { UiBadge } from './UiBadge';
import { Home, BookOpen, BookMarked, ClipboardCheck, Award } from 'lucide-react';

export type TabType = 'home' | 'apply' | 'guide' | 'practice' | 'cert' | 'course' | 'exam' | 'wallet' | 'tv24';

interface MobileTabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: '홈', icon: Home, tag: 'P40-TAB-HOME' },
    { id: 'apply' as TabType, label: '수강신청', icon: BookOpen, tag: 'P40-TAB-APPLY' },
    { id: 'guide' as TabType, label: '돌봄지침서', icon: BookMarked, tag: 'P40-TAB-GUIDE' },
    { id: 'practice' as TabType, label: '현장실습', icon: ClipboardCheck, tag: 'P40-TAB-PRACTICE' },
    { id: 'cert' as TabType, label: '자격증', icon: Award, tag: 'P40-TAB-CERT' },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 safe-area-bottom">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <UiBadge key={tab.id} serialId={tab.tag} className="w-full">
              <button
                onClick={() => onSelectTab(tab.id)}
                className={`w-full min-h-[56px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 font-black scale-105'
                    : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-50'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[12px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />
                )}
              </button>
            </UiBadge>
          );
        })}
      </div>
    </nav>
  );
};
export default MobileTabBar;
