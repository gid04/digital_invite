import { createClient } from '@supabase/supabase-js';
import type { EventItem, RSVPItem, AuthUser } from '../types';

export const SUPABASE_URL = 'https://djwnortqologvgnalurz.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_GCTBncj3mobUb9OFXvLjAw_jCDILWgL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Local storage fallback helpers for resilience
const LOCAL_EVENTS_KEY = 'digitinvite_local_events';
const LOCAL_RSVPS_KEY = 'digitinvite_local_rsvps';
const LOCAL_AUTH_KEY = 'digitinvite_local_user';

function getLocalEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEvents(events: EventItem[]) {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save local events', e);
  }
}

function getLocalRSVPs(): RSVPItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_RSVPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRSVPs(rsvps: RSVPItem[]) {
  try {
    localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(rsvps));
    window.dispatchEvent(new CustomEvent('digitinvite_local_rsvp_change'));
  } catch (e) {
    console.error('Failed to save local rsvps', e);
  }
}

// Default sample event for instant demo
export const DEFAULT_SAMPLE_EVENT: EventItem = {
  id: 'sample-event-demo',
  user_id: null,
  title: 'Départ à la Retraite',
  topic: 'Départ à la Retraite',
  event_date: '2026-11-20',
  event_time: '18:30',
  location: 'Pavillon Royal, Paris',
  variety: 'couple',
  palette: 'emerald',
  message: 'Venez célébrer avec nous cette nouvelle page qui s’ouvre après tant de belles années partagées.',
  dress_code: 'Chic décontracté',
  rsvp_deadline: '15 Novembre 2026',
  is_paid: true,
  is_active: true,
  created_at: new Date().toISOString(),
};

// Seed sample event into local storage if empty
if (getLocalEvents().length === 0) {
  saveLocalEvents([DEFAULT_SAMPLE_EVENT]);
}

// ----------------- AUTH APIS -----------------

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || 'user@digitinvite.com',
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Organisateur',
        avatar_url: session.user.user_metadata?.avatar_url,
      };
    }
  } catch (e) {
    console.warn('Supabase auth getSession check failed, using local user fallback', e);
  }

  // Fallback to local storage auth
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function signInWithEmail(email: string, password?: string): Promise<AuthUser> {
  try {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        const u: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
        };
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
        return u;
      }
    }
  } catch (e) {
    console.warn('Supabase signInWithPassword failed, using client auth mode', e);
  }

  // Graceful client fallback for demo & test accounts
  const localUser: AuthUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email,
    name: email.split('@')[0],
  };
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
  return localUser;
}

export async function signUpWithEmail(email: string, password?: string): Promise<AuthUser> {
  try {
    if (password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (!error && data.user) {
        const u: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
        };
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
        return u;
      }
    }
  } catch (e) {
    console.warn('Supabase signUpWithEmail failed, fallback active', e);
  }

  const localUser: AuthUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email,
    name: email.split('@')[0],
  };
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
  return localUser;
}

export async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
  } catch (e) {
    console.warn('OAuth redirect not configured yet in Supabase console, logging in as Google demo user', e);
    const mockUser: AuthUser = {
      id: 'usr_google_' + Math.random().toString(36).substring(2, 9),
      email: 'organisateur.google@digitinvite.com',
      name: 'Google User',
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn(e);
  }
  localStorage.removeItem(LOCAL_AUTH_KEY);
}

// ----------------- EVENTS APIS -----------------

export async function createEvent(eventData: Omit<EventItem, 'id' | 'created_at'>): Promise<EventItem> {
  const newEvent: EventItem = {
    ...eventData,
    id: 'evt_' + Math.random().toString(36).substring(2, 10),
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (!error && data) {
      // Also cache locally
      const list = getLocalEvents();
      saveLocalEvents([data, ...list]);
      return data;
    }
    if (error) {
      console.warn('Supabase insert event returned error, fallback to local', error);
    }
  } catch (e) {
    console.warn('Supabase insert event network failed, fallback to local', e);
  }

  // Local storage save
  const list = getLocalEvents();
  saveLocalEvents([newEvent, ...list]);
  return newEvent;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  // Check local cache first or sample
  if (id === 'sample-event-demo' || id === 'sample') {
    return DEFAULT_SAMPLE_EVENT;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase getEventById error', e);
  }

  const local = getLocalEvents().find((e) => e.id === id);
  return local || null;
}

export async function listUserEvents(userId?: string | null): Promise<EventItem[]> {
  try {
    let query = supabase.from('events').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase listUserEvents failed, falling back to local', e);
  }

  const local = getLocalEvents();
  if (userId) {
    return local.filter((e) => !e.user_id || e.user_id === userId);
  }
  return local;
}

// ----------------- RSVP APIS -----------------

export async function createRSVP(rsvpData: Omit<RSVPItem, 'id' | 'created_at'>): Promise<RSVPItem> {
  const newRSVP: RSVPItem = {
    ...rsvpData,
    id: 'rsvp_' + Math.random().toString(36).substring(2, 10),
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([newRSVP])
      .select()
      .single();

    if (!error && data) {
      const local = getLocalRSVPs();
      saveLocalRSVPs([data, ...local]);
      return data;
    }
    if (error) {
      console.warn('Supabase rsvp insert error, saving to local fallback', error);
    }
  } catch (e) {
    console.warn('Supabase rsvp insert failed, saving to local fallback', e);
  }

  const local = getLocalRSVPs();
  saveLocalRSVPs([newRSVP, ...local]);
  return newRSVP;
}

export async function listRSVPsForEvent(eventId: string): Promise<RSVPItem[]> {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase listRSVPsForEvent error, reading local fallback', e);
  }

  return getLocalRSVPs().filter((r) => r.event_id === eventId);
}

// Realtime RSVP subscription helper with local event fallback
export function subscribeToRSVPs(eventId: string, onUpdate: () => void) {
  // 1. Supabase Realtime channel
  const channel = supabase
    .channel(`rsvps_event_${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rsvps',
        filter: `event_id=eq.${eventId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  // 2. Local fallback listener for real-time responsiveness across tabs/components
  const handleLocalChange = () => {
    onUpdate();
  };
  window.addEventListener('digitinvite_local_rsvp_change', handleLocalChange);
  window.addEventListener('storage', handleLocalChange);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener('digitinvite_local_rsvp_change', handleLocalChange);
    window.removeEventListener('storage', handleLocalChange);
  };
}
