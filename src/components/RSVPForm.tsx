import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { createRSVP } from '../lib/supabase';

interface RSVPFormProps {
  eventId?: string;
  onSuccess: () => void;
  onBack?: () => void;
  isSingle?: boolean;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  eventId,
  onSuccess,
  onBack,
  isSingle = false,
}) => {
  const [civility, setCivility] = useState<'M' | 'Mme'>('M');
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [withPlusOne, setWithPlusOne] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setErrorMsg('Veuillez renseigner votre nom.');
      return;
    }
    if (!prenoms.trim()) {
      setErrorMsg('Veuillez renseigner vos prénoms.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await createRSVP({
        event_id: eventId || 'sample-event-demo',
        civility,
        nom: nom.trim().toUpperCase(),
        prenoms: prenoms.trim(),
        with_plus_one: isSingle ? false : withPlusOne,
      });

      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
      setErrorMsg("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-full flex flex-col items-center justify-between px-4 pt-[72px] pb-4 z-20 overflow-y-auto no-scrollbar"
    >
      {/* RSVP Card Container */}
      <div className="w-full max-w-[340px] bg-[#ebe3d5] rounded-[28px] p-6 pt-5 shadow-card border border-[#dfd4c0]/50 relative z-30 flex-shrink-0">
        {/* Title */}
        <div className="w-full flex justify-center mb-4">
          <div className="w-56 max-w-[80%] flex justify-center">
            <img
              src="/Title.png"
              alt="Confirmation de Présence"
              className="w-full h-auto object-contain"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(1200%) hue-rotate(95deg) brightness(85%) contrast(100%)',
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Civility Selector: (M) vs (Mme) */}
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            <button
              type="button"
              onClick={() => setCivility('M')}
              className={`py-2 px-4 rounded-xl text-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                civility === 'M'
                  ? 'bg-[#0e4b20] text-white shadow-md'
                  : 'bg-[#ede5d8] text-zinc-900 border border-[#0e4b20]/60 hover:bg-[#e4dcce]'
              }`}
            >
              (M)
            </button>

            <button
              type="button"
              onClick={() => setCivility('Mme')}
              className={`py-2 px-4 rounded-xl text-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                civility === 'Mme'
                  ? 'bg-[#0e4b20] text-white shadow-md'
                  : 'bg-[#ede5d8] text-zinc-900 border border-[#0e4b20]/60 hover:bg-[#e4dcce]'
              }`}
            >
              (Mme)
            </button>
          </div>

          {/* Nom Field */}
          <div>
            <label className="block text-black text-xs font-bold mb-1" htmlFor="rsvp-nom">
              Nom:
            </label>
            <input
              id="rsvp-nom"
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre Nom"
              className="w-full py-2 px-3.5 rounded-xl bg-[#e3d8c8] text-zinc-900 placeholder:text-zinc-500/80 border border-[#0e4b20]/70 focus:outline-none focus:ring-2 focus:ring-[#0e4b20] text-sm font-medium transition-all"
            />
          </div>

          {/* Prénoms Field */}
          <div>
            <label className="block text-black text-xs font-bold mb-1" htmlFor="rsvp-prenoms">
              Prénoms:
            </label>
            <input
              id="rsvp-prenoms"
              type="text"
              required
              value={prenoms}
              onChange={(e) => setPrenoms(e.target.value)}
              placeholder="Vos prénoms"
              className="w-full py-2 px-3.5 rounded-xl bg-[#e3d8c8] text-zinc-900 placeholder:text-zinc-500/80 border border-[#0e4b20]/70 focus:outline-none focus:ring-2 focus:ring-[#0e4b20] text-sm font-medium transition-all"
            />
          </div>

          {/* Checkbox: "Je viens avec M/Mme" (Only for couple/standard cards) */}
          {!isSingle && (
            <div className="pt-0.5 pb-0.5">
              <label
                className="flex items-center gap-3 cursor-pointer select-none group"
                onClick={() => setWithPlusOne(!withPlusOne)}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-200 border ${
                    withPlusOne
                      ? 'bg-[#0e4b20] border-[#0e4b20]'
                      : 'bg-[#e3d8c8] border-[#0e4b20]/70 group-hover:border-[#0e4b20]'
                  }`}
                >
                  {withPlusOne && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <span className="text-black text-xs sm:text-sm font-medium">
                  Je viens avec M/Mme (+1)
                </span>
              </label>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-700 text-xs font-semibold bg-red-100/90 p-2 rounded-lg text-center">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-full bg-black hover:bg-zinc-900 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Je confirme ma présence</span>
              )}
            </button>
          </div>
        </form>

        {onBack && (
          <div className="mt-2.5 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-[#0e4b20] hover:underline font-medium cursor-pointer"
            >
              ← Revoir l'invitation
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-[11px] text-[#8eab94] font-light tracking-[0.2em] uppercase mt-3 select-none z-30">
        DIGITINVITE.COM
      </p>
    </motion.div>
  );
};
