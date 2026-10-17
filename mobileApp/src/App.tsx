import React, { useState, useEffect } from 'react';
import { SilverHeader } from './components/SilverHeader';
import { MobileTabBar, TabType } from './components/MobileTabBar';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { HomeScreen } from './screens/HomeScreen';
import { CourseDetailScreen } from './screens/CourseDetailScreen';
import { VideoPlayerScreen } from './screens/VideoPlayerScreen';
import { ExamScreen } from './screens/ExamScreen';
import { WalletCertScreen } from './screens/WalletCertScreen';
import { TV24ShortsScreen } from './screens/TV24ShortsScreen';
import { CourseMaterialScreen } from './screens/CourseMaterialScreen';
import { AboutScreen } from './screens/AboutScreen';
import { CurriculumScreen } from './screens/CurriculumScreen';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<'video' | 'material' | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number>(1);
  const [videoParams, setVideoParams] = useState<any>(null);

  // URL Hash (#tab=...) 동기화
  useEffect(() => {
    const parseHashTab = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      const match = hash.match(/tab=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const tab = match[1].toLowerCase() as TabType;
        const validTabs: TabType[] = ['home', 'apply', 'course', 'guide', 'practice', 'exam', 'cert', 'wallet', 'tv24', 'about', 'curriculum'];
        if (validTabs.includes(tab)) {
          setCurrentTab(tab);
        }
      }
    };

    parseHashTab();
    window.addEventListener('hashchange', parseHashTab);
    return () => window.removeEventListener('hashchange', parseHashTab);
  }, []);

  const updateUrlHash = (tab: TabType, sub?: string | null) => {
    if (typeof window === 'undefined') return;
    const subPart = sub ? `&sub=${sub}` : '';
    window.location.hash = `#tab=${tab}${subPart}`;
  };

  // Silver UX Accessibility State
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [uiInspection, setUiInspection] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Global Alt + I shortcut for UI inspection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setUiInspection((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update root container class based on UI inspection mode
  useEffect(() => {
    if (uiInspection) {
      document.body.classList.add('ui-inspection-mode');
    } else {
      document.body.classList.remove('ui-inspection-mode');
    }
  }, [uiInspection]);

  // Handle Tab Switch
  const handleSelectTab = (tab: TabType) => {
    setActiveSubScreen(null);
    setCurrentTab(tab);
    updateUrlHash(tab, null);
  };

  // Subscreen navigation handlers
  const handleOpenVideoPlayer = (params: any) => {
    setVideoParams(params);
    setActiveSubScreen('video');
    updateUrlHash(currentTab, 'video');
  };

  const handleOpenMaterial = (diseaseId: number) => {
    setSelectedDiseaseId(diseaseId);
    setActiveSubScreen('material');
    updateUrlHash(currentTab, 'material');
  };

  const handleOpenCourse = (diseaseId?: number) => {
    if (diseaseId) setSelectedDiseaseId(diseaseId);
    setActiveSubScreen(null);
    setCurrentTab('course');
    updateUrlHash('course');
  };

  const handleOpenExam = (diseaseId?: number) => {
    if (diseaseId) setSelectedDiseaseId(diseaseId);
    setActiveSubScreen(null);
    setCurrentTab('exam');
    updateUrlHash('exam');
  };

  const handleOpenTV24 = () => {
    setActiveSubScreen(null);
    setCurrentTab('tv24');
    updateUrlHash('tv24');
  };

  // Font size class mapping
  const fontClass =
    fontSizeLevel === 'sm'
      ? 'font-scale-sm'
      : fontSizeLevel === 'lg'
      ? 'font-scale-lg'
      : 'font-scale-md';

  // Current Active Page Name for UI Inspector
  const currentPageName =
    activeSubScreen === 'video'
      ? '동영상 강의 플레이어'
      : activeSubScreen === 'material'
      ? '돌봄 교안 / 지침서'
      : currentTab === 'home'
      ? '홈 대시보드'
      : currentTab === 'about'
      ? '교육원 소개'
      : currentTab === 'curriculum'
      ? '교육 체계 / 커리큘럼'
      : currentTab === 'apply' || currentTab === 'course'
      ? '과정 상세 / 학습'
      : currentTab === 'guide' || currentTab === 'tv24'
      ? '간병24TV 숏폼 러닝'
      : currentTab === 'practice' || currentTab === 'exam'
      ? '디지털 CBT 모의시험'
      : currentTab === 'cert' || currentTab === 'wallet'
      ? '모바일 자격증 지갑'
      : '홈 대시보드';

  return (
    <div
      className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : ''}`}
      data-service-name="eCare24 스마트러닝"
      data-page-name={currentPageName}
    >
      <MobileDeviceFrame isDeviceFrame={isDeviceFrame}>
        <div
          className={`flex-1 flex flex-col min-h-0 w-full ${fontClass} ${
            highContrast ? 'high-contrast' : ''
          }`}
          data-service-name="eCare24 스마트러닝"
          data-page-name={currentPageName}
        >
          {/* Top Silver Header (Shown on all pages except fullscreen Video) */}
          {activeSubScreen !== 'video' && (
            <SilverHeader
              fontSizeLevel={fontSizeLevel}
              setFontSizeLevel={setFontSizeLevel}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              uiInspection={uiInspection}
              setUiInspection={setUiInspection}
              isDeviceFrame={isDeviceFrame}
              setIsDeviceFrame={setIsDeviceFrame}
              isOffline={isOffline}
              setIsOffline={setIsOffline}
            />
          )}

          {/* Main View Area */}
          <main
            className="flex-1 flex flex-col overflow-y-auto relative min-h-0"
            data-service-name="eCare24 스마트러닝"
            data-page-name={currentPageName}
          >
            {activeSubScreen === 'video' ? (
              <VideoPlayerScreen
                videoInfo={videoParams}
                onBack={() => setActiveSubScreen(null)}
              />
            ) : activeSubScreen === 'material' ? (
              <CourseMaterialScreen
                courseId={selectedDiseaseId}
                onBack={() => setActiveSubScreen(null)}
                isOffline={isOffline}
              />
            ) : currentTab === 'home' ? (
              <HomeScreen
                onNavigateToCourse={handleOpenCourse}
                onNavigateToExam={handleOpenExam}
                onNavigateToTV24={handleOpenTV24}
                onNavigateToMaterial={() => handleOpenMaterial(selectedDiseaseId)}
                onNavigateToAbout={() => handleSelectTab('about')}
                onNavigateToCurriculum={() => handleSelectTab('curriculum')}
                isOffline={isOffline}
              />
            ) : currentTab === 'about' ? (
              <AboutScreen />
            ) : currentTab === 'curriculum' ? (
              <CurriculumScreen onSelectCourse={handleOpenCourse} />
            ) : currentTab === 'apply' || currentTab === 'course' ? (
              <CourseDetailScreen
                initialDiseaseId={selectedDiseaseId}
                onOpenVideoPlayer={handleOpenVideoPlayer}
                onOpenMaterial={handleOpenMaterial}
                onOpenExam={handleOpenExam}
                isOffline={isOffline}
              />
            ) : currentTab === 'guide' || currentTab === 'tv24' ? (
              <TV24ShortsScreen onNavigateToCourse={handleOpenCourse} />
            ) : currentTab === 'practice' || currentTab === 'exam' ? (
              <ExamScreen
                courseId={selectedDiseaseId}
                onNavigateToWallet={() => handleSelectTab('cert')}
                onBackToCourse={() => handleSelectTab('curriculum')}
              />
            ) : currentTab === 'cert' || currentTab === 'wallet' ? (
              <WalletCertScreen />
            ) : null}
          </main>

          {/* Bottom Tab Bar (Shown on 5 main tabs when not inside subscreen) */}
          {!activeSubScreen && (
            <MobileTabBar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
            />
          )}
        </div>
      </MobileDeviceFrame>
    </div>
  );
};
export default App;
