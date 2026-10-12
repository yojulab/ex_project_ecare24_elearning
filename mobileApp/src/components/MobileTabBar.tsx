import React from 'react';
import { UiBadge } from './UiBadge';
import { Home, BookOpen, FileCheck, Award, Film } from 'lucide-react';

export type TabType = 'home' | 'course' | 'exam' | 'wallet' | 'tv24';

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
    { id: 'course' as TabType, label: '질환과정', icon: BookOpen, tag: 'P40-TAB-COURSE' },
    { id: 'exam' as TabType, label: 'CBT시험', icon: FileCheck, tag: 'P40-TAB-EXAM' },
    { id: 'wallet' as TabType, label: '자격증지갑', icon: Award, tag: 'P40-TAB-WALLET' },
    { id: 'tv24' as TabType, label: '간병24TV', icon: Film, tag: 'P40-TAB-TV24' },
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
