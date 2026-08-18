import React from 'react';
import { motion } from 'framer-motion';

interface EnvelopeFlapsProps {
  isRevealed: boolean;
  onOpen: () => void;
}

export const EnvelopeFlaps: React.FC<EnvelopeFlapsProps> = ({ isRevealed, onOpen }) => {
  return (
    <>
      {/* LOWER FLAP (Envelope Tail) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none w-full flex flex-col justify-end"
        initial={{ y: '0%' }}
        animate={{
          y: isRevealed ? '92%' : '0%',
        }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="relative w-full">
          <img
            src="/lower flap.png"
            alt="Enveloppe - Bas"
            className="w-full h-auto object-cover block select-none pointer-events-none drop-shadow-2xl"
            loading="eager"
          />
        </div>
      </motion.div>

      {/* UPPER FLAP (Envelope Head) */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 w-full pointer-events-none"
        initial={{ y: '0%' }}
        animate={{
          y: isRevealed ? '-85%' : '0%',
        }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="relative w-full">
          <img
            src="/upper flap.png"
            alt="Enveloppe - Haut"
            className="w-full h-auto object-cover block select-none pointer-events-none drop-shadow-2xl"
            loading="eager"
          />

          {/* Stamp button placed at the apex of the Upper Flap (visible ONLY when closed) */}
          {!isRevealed && (
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 translate-y-[35%] z-50 flex flex-col items-center pointer-events-auto">
              <motion.button
                onClick={onOpen}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="relative group cursor-pointer focus:outline-none"
                aria-label="Cliquez ici pour ouvrir l'invitation"
              >
                {/* Pulsing ambient glow aura */}
                <div className="absolute -inset-2.5 bg-emerald-400/30 rounded-full blur-md animate-pulse pointer-events-none" />

                <img
                  src="/Stamp.png"
                  alt="Cliquez ici"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:rotate-3 select-none"
                  loading="eager"
                />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer "by VANTAR STUDIOS" on envelope when closed */}
      {!isRevealed && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <p className="text-[11px] text-[#8eab94] font-light tracking-[0.2em] uppercase select-none">
            by VANTAR STUDIOS
          </p>
        </div>
      )}
    </>
  );
};
