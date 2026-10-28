export type EventTopic =
  | 'Anniversaire'
  | 'Mariage'
  | 'Baptême'
  | 'Départ à la Retraite'
  | 'Gala & Soirée'
  | 'Baby Shower'
  | 'Autre';

export type PaletteId =
  | 'emerald'
  | 'navy'
  | 'burgundy'
  | 'terracotta'
  | 'pearl'
  | 'amethyst';

export interface PaletteTheme {
  id: PaletteId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgGrad: string;
  cardBg: string;
  cardTextColor: string;
  buttonClass: string;
  tagBg: string;
  glowColor: string;
  stampBorder: string;
  previewBg: string;
}

export interface EventItem {
  id: string;
  user_id?: string | null;
  title: string;
  topic: EventTopic | string;
  event_date: string;
  event_time?: string;
  location: string;
  variety: 'single' | 'couple';
  palette: PaletteId;
  message?: string;
  dress_code?: string;
  rsvp_deadline?: string;
  is_paid: boolean;
  is_active: boolean;
  created_at: string;
}

export interface RSVPItem {
  id: string;
  event_id: string;
  civility: 'M' | 'Mme';
  nom: string;
  prenoms: string;
  with_plus_one: boolean;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}
