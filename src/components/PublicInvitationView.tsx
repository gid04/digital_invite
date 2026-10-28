import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileFrame } from './MobileFrame';
import { EnvelopeFlaps } from './EnvelopeFlaps';
import { InvitationCard } from './InvitationCard';
import { RSVPForm } from './RSVPForm';
import { ThankYouCard } from './ThankYouCard';
import type { EventItem } from '../types';
import { getEventById, DEFAULT_SAMPLE_EVENT } from '../lib/supabase';
import { PALETTES } from '../lib/palettes';
import { ArrowLeft } from 'lucide-react';

interface PublicInvitationViewProps {
  eventId: string;
  onGoHome?: () => void;
}

type AppStep = 'closed' | 'revealed' | 'form' | 'thank_you';

export const PublicInvitationView: React.FC<PublicInvitationViewProps> = ({
  eventId,
  onGoHome,
}) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [step, setStep] = useState<AppStep>('closed');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const ev = await getEventById(eventId);
      setEvent(ev || DEFAULT_SAMPLE_EVENT);
      setIsLoading(false);
    }
    load();
  }, [eventId]);

  const handleOpenEnvelope = () => {
    setStep('revealed');
  };

  const handleConfirmPresence = () => {
    setStep('form');
  };

  const handleFormSuccess = () => {
    setStep('thank_you');
  };

  const handleReset = () => {
    setStep('revealed');
  };

  if (isLoading) {
    return (
      <MobileFrame>
        <div className="w-full h-full flex items-center justify-center bg-[#072412] text-white text-xs">
          Chargement de l'invitation...
        </div>
      </MobileFrame>
    );
  }

  const currentEvent = event || DEFAULT_SAMPLE_EVENT;
  const theme = PALETTES[currentEvent.palette] || PALETTES.emerald;
  const isSample = eventId === 'sample' || eventId === 'sample-event-demo';

  // Flap and background assets
  const bgImageSrc = isSample ? '/bg-sample.png' : '/bg.png';
  const upperFlapSrc = isSample ? '/upper-flap-sample.png' : '/upper flap.png';
  const lowerFlapSrc = isSample ? '/lower-flap-sample.png' : '/lower flap.png';
  const stampSrc = isSample ? '/stamp-sample.png' : '/Stamp.png';

  const isEnvelopeRevealed = step !== 'closed';

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#020d06]">
      {/* Top Banner on larger screens */}
      {onGoHome && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Digitinvite</span>
          </button>
        </div>
      )}

      <MobileFrame>
        <div
          className="relative w-full h-full flex flex-col overflow-hidden"
          style={{ backgroundColor: theme.primary }}
        >
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none"
            style={{ backgroundImage: `url("${bgImageSrc}")` }}
          />

          {/* Radial dark overlay for rich depth */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

          {/* Envelope Top and Bottom Flaps */}
          <EnvelopeFlaps
            isRevealed={isEnvelopeRevealed}
            onOpen={handleOpenEnvelope}
            upperFlapSrc={upperFlapSrc}
            lowerFlapSrc={lowerFlapSrc}
            stampSrc={stampSrc}
            glowColorClass={theme.glowColor}
            footerTextColor="text-white/60"
          />

          {/* Main Content Area */}
          <div className="relative w-full h-full flex flex-col z-20">
            <AnimatePresence mode="wait">
              {step === 'revealed' && (
                <InvitationCard
                  key="invitation-card-active"
                  event={currentEvent}
                  onConfirmPresence={handleConfirmPresence}
                  footerTextColor="text-white/60"
                />
              )}

              {step === 'form' && (
                <RSVPForm
                  key="rsvp-form-active"
                  eventId={currentEvent.id}
                  isSingle={currentEvent.variety === 'single'}
                  onSuccess={handleFormSuccess}
                  onBack={() => setStep('revealed')}
                />
              )}

              {step === 'thank_you' && (
                <ThankYouCard
                  key="thank-you-card-active"
                  onReset={handleReset}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </MobileFrame>
    </div>
  );
};
