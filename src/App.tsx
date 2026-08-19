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

  // Synchronize browser URL changes (e.g. Back button or navigation)
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

  // Admin View route check (/admin)
  if (currentPath === '/admin' || currentPath === '/admin/') {
    return <AdminView onGoToCard={() => navigateTo('/')} />;
  }

  // Route configurations
  const isSample = currentPath === '/sample' || currentPath === '/sample/';
  const isSingle = currentPath === '/single' || currentPath === '/single/';

  // Theme & asset configs
  const bgImageSrc = isSample ? '/bg-sample.png' : '/bg.png';
  const bgColor = isSample ? 'bg-[#0a1526]' : 'bg-[#072412]';
  const upperFlapSrc = isSample ? '/upper-flap-sample.png' : '/upper flap.png';
  const lowerFlapSrc = isSample ? '/lower-flap-sample.png' : '/lower flap.png';
  const stampSrc = isSample ? '/stamp-sample.png' : '/Stamp.png';
  const glowColorClass = isSample ? 'bg-amber-400/35' : 'bg-emerald-400/30';
  const footerTextColor = isSample ? 'text-[#b09d7d]' : 'text-[#8eab94]';
  const cardImageSrc = isSample
    ? '/sample-card.jpg'
    : isSingle
    ? '/single-card.jpg'
    : '/Final 1.jpg';
  const buttonClass = isSample
    ? 'glass-btn-navy text-[#fbeec1]'
    : 'glass-btn text-white';

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
      <div className={`relative w-full h-full flex flex-col overflow-hidden ${bgColor}`}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none"
          style={{ backgroundImage: `url("${bgImageSrc}")` }}
        />

        {/* Subtle radial dark overlay for depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Envelope Top and Bottom Flaps */}
        <EnvelopeFlaps
          isRevealed={isEnvelopeRevealed}
          onOpen={handleOpenEnvelope}
          upperFlapSrc={upperFlapSrc}
          lowerFlapSrc={lowerFlapSrc}
          stampSrc={stampSrc}
          glowColorClass={glowColorClass}
          footerTextColor={footerTextColor}
        />

        {/* Main Content Area */}
        <div className="relative w-full h-full flex flex-col z-20">
          <AnimatePresence mode="wait">
            {step === 'revealed' && (
              <InvitationCard
                key={`invitation-card-${isSample ? 'sample' : isSingle ? 'single' : 'standard'}`}
                cardImageSrc={cardImageSrc}
                buttonClass={buttonClass}
                footerTextColor={footerTextColor}
                onConfirmPresence={handleConfirmPresence}
              />
            )}

            {step === 'form' && (
              <RSVPForm
                key={`rsvp-form-${isSample ? 'sample' : isSingle ? 'single' : 'standard'}`}
                isSingle={isSingle}
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
