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

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<'video' | 'material' | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number>(1);
  const [videoParams, setVideoParams] = useState<any>(null);

  // Silver UX Accessibility State
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [uiInspection, setUiInspection] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
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
  };

  // Subscreen navigation handlers
  const handleOpenVideoPlayer = (params: any) => {
    setVideoParams(params);
    setActiveSubScreen('video');
  };

  const handleOpenMaterial = (diseaseId: number) => {
    setSelectedDiseaseId(diseaseId);
    setActiveSubScreen('material');
  };

  const handleOpenCourse = (diseaseId?: number) => {
    if (diseaseId) setSelectedDiseaseId(diseaseId);
    setActiveSubScreen(null);
    setCurrentTab('course');
  };

  const handleOpenExam = (diseaseId?: number) => {
    if (diseaseId) setSelectedDiseaseId(diseaseId);
    setActiveSubScreen(null);
    setCurrentTab('exam');
  };

  const handleOpenTV24 = () => {
    setActiveSubScreen(null);
    setCurrentTab('tv24');
  };

  // Font size class mapping
  const fontClass =
    fontSizeLevel === 'sm'
      ? 'font-scale-sm'
      : fontSizeLevel === 'lg'
      ? 'font-scale-lg'
      : 'font-scale-md';

  return (
    <div className={`min-h-screen ${highContrast ? 'high-contrast' : ''}`}>
      <MobileDeviceFrame isDeviceFrame={isDeviceFrame}>
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${fontClass} ${
            highContrast ? 'high-contrast' : ''
          }`}
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
          <main className="flex-1 flex flex-col overflow-hidden relative">
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
                isOffline={isOffline}
              />
            ) : currentTab === 'course' ? (
              <CourseDetailScreen
                initialDiseaseId={selectedDiseaseId}
                onOpenVideoPlayer={handleOpenVideoPlayer}
                onOpenMaterial={handleOpenMaterial}
                onOpenExam={handleOpenExam}
                isOffline={isOffline}
              />
            ) : currentTab === 'exam' ? (
              <ExamScreen
                courseId={selectedDiseaseId}
                onNavigateToWallet={() => handleSelectTab('wallet')}
                onBackToCourse={() => handleSelectTab('course')}
              />
            ) : currentTab === 'wallet' ? (
              <WalletCertScreen />
            ) : currentTab === 'tv24' ? (
              <TV24ShortsScreen onNavigateToCourse={handleOpenCourse} />
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
