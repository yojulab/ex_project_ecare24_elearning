import React from 'react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isDeviceFrame: boolean;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  isDeviceFrame,
}) => {
  if (!isDeviceFrame) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex justify-center">
        <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 sm:py-6 sm:px-4 flex items-center justify-center overflow-auto">
      {/* Smartphone Outer Bezel on desktop, responsive full-width on mobile */}
      <div className="w-full h-full min-h-screen sm:min-h-0 sm:w-[400px] sm:h-[860px] bg-slate-800 sm:rounded-[55px] sm:p-3 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] sm:border-[4px] sm:border-slate-700 flex flex-col relative">
        {/* Dynamic Island Notch (Only visible on desktop bezel) */}
        <div className="hidden sm:flex absolute top-6 left-1/2 -translate-x-1/2 z-50 w-28 h-6 bg-black rounded-full items-center justify-between px-3 pointer-events-none shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-blue-900/40" />
        </div>

        {/* Screen Content Container */}
        <div className="w-full h-full min-h-screen sm:min-h-0 bg-slate-50 sm:rounded-[45px] overflow-hidden flex flex-col relative border border-slate-200">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
export default MobileDeviceFrame;
