import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileFrame } from './components/MobileFrame';
import { EnvelopeFlaps } from './components/EnvelopeFlaps';
import { InvitationCard } from './components/InvitationCard';
import { RSVPForm } from './components/RSVPForm';
import { ThankYouCard } from './components/ThankYouCard';
import { AdminView } from './components/AdminView';

type AppStep = 'closed' | 'revealed' | 'form' | 'thank_you';

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [step, setStep] = useState<AppStep>('closed');

  // Synchronize browser URL changes (e.g. Back button or direct URL)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Admin View check
  if (currentPath === '/admin' || currentPath === '/admin/') {
    return <AdminView onGoToCard={() => navigateTo('/')} />;
  }

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

  const isEnvelopeRevealed = step !== 'closed';

  return (
    <MobileFrame>
      {/* Background container with seamless floral texture */}
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#072412]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none"
          style={{ backgroundImage: 'url("/bg.png")' }}
        />

        {/* Subtle radial dark overlay for depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Envelope Top and Bottom Flaps */}
        <EnvelopeFlaps
          isRevealed={isEnvelopeRevealed}
          onOpen={handleOpenEnvelope}
        />

        {/* Main Content Area */}
        <div className="relative w-full h-full flex flex-col z-20">
          <AnimatePresence mode="wait">
            {step === 'revealed' && (
              <InvitationCard
                key="invitation-card"
                onConfirmPresence={handleConfirmPresence}
              />
            )}

            {step === 'form' && (
              <RSVPForm
                key="rsvp-form"
                onSuccess={handleFormSuccess}
                onBack={() => setStep('revealed')}
              />
            )}

            {step === 'thank_you' && (
              <ThankYouCard
                key="thank-you-card"
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileFrame>
  );
}

export default App;
