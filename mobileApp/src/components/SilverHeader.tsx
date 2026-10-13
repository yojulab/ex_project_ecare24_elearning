import React from 'react';
import { UiBadge } from './UiBadge';
import { Wifi, WifiOff, Eye, Smartphone, Monitor } from 'lucide-react';

interface SilverHeaderProps {
  fontSizeLevel: 'sm' | 'md' | 'lg';
  setFontSizeLevel: (level: 'sm' | 'md' | 'lg') => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  uiInspection: boolean;
  setUiInspection: (v: boolean) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (v: boolean) => void;
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
}

export const SilverHeader: React.FC<SilverHeaderProps> = ({
  fontSizeLevel,
  setFontSizeLevel,
  highContrast,
  setHighContrast,
  uiInspection,
  setUiInspection,
  isDeviceFrame,
  setIsDeviceFrame,
  isOffline,
  setIsOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 py-2.5 shadow-sm transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Offline status */}
        <div className="flex items-center gap-1.5">
          <UiBadge serialId="P40-HDR-LOGO">
            <div className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow">
                돌봄
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-slate-900 leading-tight">
                  한국돌봄종사자교육원
                </span>
                <span className="text-[9px] font-bold text-emerald-600 leading-none">
                  16대트랙(각 8h)
                </span>
              </div>
            </div>
          </UiBadge>

          {/* Offline Toggle Badge */}
          <UiBadge serialId="P40-HDR-OFFLINE">
            <button
              onClick={() => setIsOffline(!isOffline)}
              title="클릭하여 오프라인 학습 모드 시뮬레이션 전환"
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                isOffline
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff size={11} />
                  <span>오프라인</span>
                </>
              ) : (
                <>
                  <Wifi size={11} />
                  <span>온라인</span>
                </>
              )}
            </button>
          </UiBadge>
        </div>

        {/* Silver Controls: Font Size, High Contrast, UI Inspection */}
        <div className="flex items-center gap-1">
          {/* Font Size controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <UiBadge serialId="P40-HDR-FONT_DEC">
              <button
                onClick={() => setFontSizeLevel('sm')}
                className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                  fontSizeLevel === 'sm'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="글자 크기: 작게"
              >
                가-
              </button>
            </UiBadge>
            <UiBadge serialId="P40-HDR-FONT_RESET">
              <button
                onClick={() => setFontSizeLevel('md')}
                className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                  fontSizeLevel === 'md'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="글자 크기: 기본"
              >
                가
              </button>
            </UiBadge>
            <UiBadge serialId="P40-HDR-FONT_INC">
              <button
                onClick={() => setFontSizeLevel('lg')}
                className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                  fontSizeLevel === 'lg'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="글자 크기: 크게 (실버 최적화)"
              >
                가+
              </button>
            </UiBadge>
          </div>

          {/* High Contrast Toggle */}
          <UiBadge serialId="P40-HDR-CONTRAST">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-0.5 transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="고대비 모드 토글 (실버 시인성 극대화)"
            >
              <Eye size={13} />
            </button>
          </UiBadge>

          {/* UI Inspection Mode Toggle */}
          <UiBadge serialId="P40-HDR-INSPECT">
            <button
              onClick={() => setUiInspection(!uiInspection)}
              className={`px-2 py-1 rounded-lg text-xs font-black tracking-tight border transition-colors ${
                uiInspection
                  ? 'bg-purple-600 text-white border-purple-700 shadow-sm animate-pulse'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
              title="UI 일련번호 태깅 인스펙터 토글 (Alt + I)"
            >
              UI ID
            </button>
          </UiBadge>

          {/* Device Frame Viewport Toggle */}
          <UiBadge serialId="P40-HDR-FRAME">
            <button
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center justify-center"
              title={isDeviceFrame ? '모바일 전체화면 모드로 전환' : '스마트폰 기기 프레임 모드로 전환'}
            >
              {isDeviceFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
            </button>
          </UiBadge>
        </div>
      </div>
    </header>
  );
};
export default SilverHeader;
