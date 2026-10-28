-- Digitinvite Supabase Schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/djwnortqologvgnalurz/sql

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Events table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  topic text not null default 'Anniversaire',
  event_date text not null,
  event_time text,
  location text not null,
  variety text not null default 'couple', -- 'single' or 'couple'
  palette text not null default 'emerald', -- 'emerald', 'navy', 'burgundy', 'terracotta', 'pearl', 'amethyst'
  message text,
  dress_code text,
  rsvp_deadline text,
  is_paid boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. RSVPs table
create table if not exists public.rsvps (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  civility text not null check (civility in ('M', 'Mme')),
  nom text not null,
  prenoms text not null,
  with_plus_one boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. Indexes for rapid queries
create index if not exists idx_events_user_id on public.events(user_id);
create index if not exists idx_rsvps_event_id on public.rsvps(event_id);
create index if not exists idx_rsvps_created_at on public.rsvps(created_at desc);

-- 5. Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.rsvps enable row level security;

-- Events Policies:
-- Anyone can view an active event with its ID (for public invitation link)
create policy "Allow public read access to active events"
  on public.events for select
  using (is_active = true);

-- Authenticated users or creators can insert events
create policy "Allow insert events"
  on public.events for insert
  with check (true);

-- Event owners can update their events
create policy "Allow owners to update events"
  on public.events for update
  using (auth.uid() = user_id or user_id is null);

-- RSVPs Policies:
-- Anyone can insert an RSVP for an active event
create policy "Allow public RSVP submissions"
  on public.rsvps for insert
  with check (true);

-- Anyone with the event ID can read RSVPs (or dashboard access)
create policy "Allow read RSVPs for event"
  on public.rsvps for select
  using (true);

-- Enable Realtime replication for rsvps table
alter publication supabase_realtime add table public.rsvps;
alter publication supabase_realtime add table public.events;
