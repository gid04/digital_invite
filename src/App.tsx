import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { EventCreationWizard } from './components/EventCreationWizard';
import { EventDashboard } from './components/EventDashboard';
import { PublicInvitationView } from './components/PublicInvitationView';
import type { AuthUser } from './types';
import { getCurrentUser, signOutUser } from './lib/supabase';

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Check auth user session on start
  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  const navigateTo = (path: string) => {
    // Handle anchor links on landing page
    if (path.includes('#')) {
      const [base, hash] = path.split('#');
      if (base && base !== currentPath) {
        window.history.pushState({}, '', path);
        setCurrentPath(base);
      }
      setTimeout(() => {
        const elem = document.getElementById(hash);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    navigateTo('/');
  };

  // Route: Public Invitation View (/e/:eventId, /sample, /single)
  if (currentPath.startsWith('/e/')) {
    const eventId = currentPath.replace('/e/', '').replace(/\/$/, '');
    return <PublicInvitationView eventId={eventId} onGoHome={() => navigateTo('/')} />;
  }

  if (currentPath === '/sample' || currentPath === '/sample/') {
    return <PublicInvitationView eventId="sample-event-demo" onGoHome={() => navigateTo('/')} />;
  }

  if (currentPath === '/single' || currentPath === '/single/') {
    return <PublicInvitationView eventId="sample-event-demo" onGoHome={() => navigateTo('/')} />;
  }

  // Route: Dedicated Event Live Dashboard (/dashboard/event/:eventId or legacy /admin)
  if (currentPath.startsWith('/dashboard/event/')) {
    const eventId = currentPath.replace('/dashboard/event/', '').replace(/\/$/, '');
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSignOut={handleSignOut}
          onNavigate={navigateTo}
          currentPath={currentPath}
        />
        <EventDashboard eventId={eventId} onNavigate={navigateTo} />
      </div>
    );
  }

  if (currentPath === '/admin' || currentPath === '/admin/') {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSignOut={handleSignOut}
          onNavigate={navigateTo}
          currentPath={currentPath}
        />
        <EventDashboard eventId="sample-event-demo" onNavigate={navigateTo} />
      </div>
    );
  }

  // Route: Event Creation Wizard (/create or /create-event)
  if (currentPath === '/create' || currentPath === '/create/' || currentPath === '/create-event') {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSignOut={handleSignOut}
          onNavigate={navigateTo}
          currentPath={currentPath}
        />
        <EventCreationWizard
          user={user}
          onNavigate={navigateTo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(loggedUser) => setUser(loggedUser)}
        />
      </div>
    );
  }

  // Route: User Dashboard Space (/dashboard)
  if (currentPath.startsWith('/dashboard')) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSignOut={handleSignOut}
          onNavigate={navigateTo}
          currentPath={currentPath}
        />
        <DashboardView
          user={user}
          onNavigate={navigateTo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(loggedUser) => setUser(loggedUser)}
        />
      </div>
    );
  }

  // Default Route: Landing Page (/)
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onNavigate={navigateTo}
        currentPath={currentPath}
      />
      <LandingPage
        onStartCreation={() => navigateTo('/create')}
        onOpenDemoCard={() => navigateTo('/e/sample-event-demo')}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
}

export default App;
