import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-[#020d06] sm:p-4">
      {/* Mobile container: 100% width on mobile, 430px max on desktop */}
      <div className="relative w-full sm:max-w-[430px] h-[100dvh] sm:h-[900px] sm:max-h-[96vh] sm:rounded-[36px] overflow-hidden shadow-2xl sm:border-[4px] sm:border-[#1a3824]/60 bg-[#072412] flex flex-col justify-between select-none">
        {/* Subtle inner ring on desktop */}
        <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-white/10 z-50 hidden sm:block" />
        {children}
      </div>
    </div>
  );
};
