import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeFlapsProps {
  isRevealed: boolean;
  onOpen: () => void;
}

export const EnvelopeFlaps: React.FC<EnvelopeFlapsProps> = ({ isRevealed, onOpen }) => {
  return (
    <>
      {/* TOP FLAP: Envelope Head */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-40 pointer-events-none"
        initial={{ y: 0 }}
        animate={{
          y: isRevealed ? '-78%' : '0%',
        }}
        transition={{
          duration: 1.1,
          ease: [0.25, 1, 0.5, 1], // Smooth cubic-bezier for natural physical sliding
        }}
        style={{
          filter: 'drop-shadow(0 14px 18px rgba(0, 0, 0, 0.75))',
        }}
      >
        <div
          className="relative w-full h-[620px] bg-[#072b14] overflow-hidden"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 74%, 50% 100%, 0 74%)',
          }}
        >
          {/* Floral background pattern */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none"
            style={{ backgroundImage: 'url("/bg.png")' }}
          />

          {/* Gradient shadow along the V border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(3,20,8,0.2) 0%, rgba(3,20,8,0.6) 80%, rgba(2,15,6,0.9) 100%)',
            }}
          />

          {/* Top Flap Content (visible when closed) */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 flex flex-col items-center justify-start pt-14 px-6 text-center select-none"
              >
                {/* Invitation text */}
                <span className="text-[#d8cdb8] text-xs sm:text-[13px] font-medium tracking-[0.25em] uppercase mb-4">
                  INVITATION AU
                </span>

                {/* Script Title */}
                <div className="w-64 max-w-[85%] mb-5 flex justify-center">
                  <img
                    src="/Title.png"
                    alt="Départ à la Retraite"
                    className="w-full h-auto object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Names */}
                <div className="flex flex-col items-center">
                  <h1 className="text-[#f5eee3] text-2xl sm:text-3xl font-semibold tracking-wider uppercase mb-1">
                    M. AHOYA
                  </h1>
                  <h2 className="text-[#d5cbb8] text-lg sm:text-xl font-light tracking-[0.2em] uppercase">
                    LUC COSSI
                  </h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* BOTTOM FLAP & STAMP */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40 flex flex-col justify-end"
            initial={{ y: 0, opacity: 1 }}
            exit={{
              y: '100%',
              opacity: 0,
              transition: { duration: 0.9, ease: [0.32, 0, 0.67, 0] },
            }}
          >
            {/* Bottom triangular folds & stamp container */}
            <div className="relative w-full h-[520px]">
              {/* Bottom V shape flap fold background */}
              <div
                className="absolute inset-0 bg-[#062612]"
                style={{
                  clipPath: 'polygon(0 34%, 50% 0%, 100% 34%, 100% 100%, 0 100%)',
                  filter: 'drop-shadow(0 -10px 14px rgba(0, 0, 0, 0.6))',
                }}
              >
                {/* Floral texture on bottom flap */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-75"
                  style={{ backgroundImage: 'url("/bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
              </div>

              {/* Interactive Wax Stamp Button */}
              <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                <motion.button
                  onClick={onOpen}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative group cursor-pointer focus:outline-none"
                  aria-label="Ouvrir l'invitation"
                >
                  {/* Subtle pulsing glow aura */}
                  <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-md animate-pulse pointer-events-none" />

                  {/* Stamp Graphic */}
                  <img
                    src="/Stamp.png"
                    alt="Cliquez ici pour ouvrir"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-xl transition-transform duration-300 group-hover:rotate-3"
                  />
                </motion.button>
              </div>

              {/* Footer text on bottom of envelope */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
                <p className="text-[11px] text-[#8eab94]/80 font-light tracking-wider uppercase select-none">
                  by VANTAR STUDIOS
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
