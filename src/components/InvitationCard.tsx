import React from 'react';
import { motion } from 'framer-motion';
import type { EventItem } from '../types';
import { PALETTES } from '../lib/palettes';
import { Calendar, MapPin } from 'lucide-react';

interface InvitationCardProps {
  onConfirmPresence: () => void;
  event?: EventItem | null;
  cardImageSrc?: string;
  buttonClass?: string;
  footerTextColor?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  onConfirmPresence,
  event,
  cardImageSrc = '/Final 1.jpg',
  buttonClass = 'glass-btn text-white',
  footerTextColor = 'text-[#8eab94]',
}) => {
  const theme = event ? PALETTES[event.palette] || PALETTES.emerald : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex flex-col items-center justify-between px-4 pt-[72px] pb-4 z-20 overflow-y-auto no-scrollbar"
    >
      {/* Main Invitation Card Container */}
      {event ? (
        <div
          className="w-full max-w-[340px] relative rounded-[28px] overflow-hidden shadow-2xl border border-white/20 p-7 text-center flex-shrink-0 flex flex-col justify-between min-h-[460px]"
          style={{ backgroundColor: theme?.cardBg || '#0c1b33' }}
        >
          {/* Subtle textured overlay */}
          <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10">
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase block mb-1"
              style={{ color: theme?.accent || '#d4af37' }}
            >
              — {event.topic.toUpperCase()} —
            </span>
            <p className="text-[11px] tracking-wider uppercase text-white/70 font-light mt-1">
              Vous êtes convié(e) à
            </p>
            <h2 className="text-2xl font-bold font-serif text-white tracking-wide mt-2 leading-tight">
              {event.title}
            </h2>
          </div>

          {/* Card Middle: Date & Location */}
          <div className="relative z-10 my-4 space-y-3 py-3 border-y border-white/15">
            <div className="flex items-center justify-center gap-2 text-white/95 text-xs font-semibold">
              <Calendar className="w-4 h-4" style={{ color: theme?.accent || '#d4af37' }} />
              <span>
                {new Date(event.event_date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {event.event_time ? ` à ${event.event_time}` : ''}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
              <MapPin className="w-4 h-4" style={{ color: theme?.accent || '#d4af37' }} />
              <span className="truncate max-w-[240px]">{event.location}</span>
            </div>

            {event.message && (
              <p className="text-xs italic text-white/90 leading-relaxed pt-2 px-1">
                “{event.message}”
              </p>
            )}

            {event.dress_code && (
              <div className="text-[11px] font-medium tracking-wide text-white/70 pt-1">
                Dress code : <span className="text-white font-semibold">{event.dress_code}</span>
              </div>
            )}
          </div>

          {/* Card Bottom Tag */}
          <div className="relative z-10 text-[10px] tracking-widest text-white/50 uppercase">
            Digitinvite Exclusive
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[340px] relative rounded-[24px] overflow-hidden shadow-2xl border border-white/10 bg-[#0c1b33] flex-shrink-0">
          <img
            src={cardImageSrc}
            alt="Invitation Digitale"
            className="w-full h-auto object-contain block rounded-[22px] pointer-events-none select-none"
            loading="eager"
          />
        </div>
      )}

      {/* Action Button "Je confirme ma présence" */}
      <div className="w-full max-w-[320px] mt-3.5 mb-1 flex flex-col items-center z-30 flex-shrink-0">
        <motion.button
          onClick={onConfirmPresence}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3.5 px-6 rounded-full ${
            theme?.buttonClass || buttonClass
          } text-sm sm:text-base font-semibold tracking-wide text-center transition-all duration-300 shadow-glass border border-white/20 active:scale-95 flex items-center justify-center cursor-pointer`}
        >
          Je confirme ma présence
        </motion.button>

        {/* Footer */}
        <p className={`text-[11px] ${footerTextColor} font-light tracking-[0.2em] uppercase mt-3 select-none`}>
          DIGITINVITE.COM
        </p>
      </div>
    </motion.div>
  );
};
