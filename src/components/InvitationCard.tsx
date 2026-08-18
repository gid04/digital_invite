import React from 'react';
import { motion } from 'framer-motion';

interface InvitationCardProps {
  onConfirmPresence: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ onConfirmPresence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col items-center justify-between px-5 pt-12 pb-4 z-20 overflow-y-auto no-scrollbar"
    >
      {/* Main Invitation Card Container */}
      <div className="w-full max-w-[340px] relative rounded-[26px] overflow-hidden shadow-card border border-[#dfd4c0]/40 bg-[#f7f2ea]">
        <img
          src="/Final 1.jpg"
          alt="Invitation Ahoya Luc Cossi - Départ à la Retraite"
          className="w-full h-auto object-contain block rounded-[24px] pointer-events-none select-none"
          loading="eager"
        />
      </div>

      {/* Button: "Je confirme ma présence" */}
      <div className="w-full max-w-[320px] mt-4 mb-2 flex flex-col items-center">
        <motion.button
          onClick={onConfirmPresence}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3.5 px-6 rounded-full glass-btn text-white/95 text-base font-medium tracking-wide text-center transition-all duration-300 shadow-glass border border-white/20 active:bg-emerald-900/90 flex items-center justify-center cursor-pointer"
        >
          Je confirme ma présence
        </motion.button>

        {/* Footer */}
        <p className="text-[11px] text-[#8eab94] font-light tracking-wider uppercase mt-4 select-none">
          by VANTAR STUDIOS
        </p>
      </div>
    </motion.div>
  );
};
