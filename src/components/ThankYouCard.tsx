import React from 'react';
import { motion } from 'framer-motion';

interface ThankYouCardProps {
  onReset?: () => void;
}

export const ThankYouCard: React.FC<ThankYouCardProps> = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-full flex flex-col items-center justify-between px-4 pt-[72px] pb-4 z-20 overflow-y-auto no-scrollbar"
    >
      {/* Thank You Card Container */}
      <div className="w-full max-w-[340px] min-h-[460px] bg-[#ebe3d5] rounded-[28px] p-7 shadow-card border border-[#dfd4c0]/50 relative z-30 flex flex-col items-center justify-between flex-shrink-0">
        {/* Title: Départ à la Retraite */}
        <div className="w-full flex justify-center pt-1">
          <div className="w-56 max-w-[80%] flex justify-center">
            <img
              src="/Title.png"
              alt="Départ à la Retraite"
              className="w-full h-auto object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(1200%) hue-rotate(95deg) brightness(85%) contrast(100%)',
              }}
            />
          </div>
        </div>

        {/* Center message: Merci / Pour votre présence! */}
        <div className="flex flex-col items-center my-auto py-8 text-center">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
            className="font-script text-7xl sm:text-8xl text-[#0e4b20] leading-tight select-none drop-shadow-sm"
          >
            Merci
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-zinc-900 text-base sm:text-lg font-bold tracking-wide mt-2 select-none"
          >
            Pour votre présence!
          </motion.p>
        </div>

        {/* Optional re-open invitation button */}
        {onReset ? (
          <div className="w-full flex justify-center pb-1">
            <button
              onClick={onReset}
              className="text-xs text-[#0e4b20] hover:underline font-medium cursor-pointer"
            >
              Revoir l'invitation
            </button>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* Footer */}
      <p className="text-[11px] text-[#8eab94] font-light tracking-[0.2em] uppercase mt-3 select-none z-30">
        by VANTAR STUDIOS
      </p>
    </motion.div>
  );
};
