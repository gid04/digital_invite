import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-[#020d06] sm:py-6 sm:px-4">
      {/* Mobile container: 100% on mobile, max 430px on desktop with elegant frame */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[94vh] sm:rounded-[36px] overflow-hidden shadow-2xl sm:border-[5px] sm:border-[#1a3824]/60 bg-[#072412] flex flex-col justify-between select-none">
        {/* Subtle inner shadow for mobile mockup on desktop */}
        <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-white/10 z-50 hidden sm:block" />
        {children}
      </div>
    </div>
  );
};
