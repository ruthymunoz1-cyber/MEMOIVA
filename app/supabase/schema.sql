-- MEMOIVA — Supabase schema (v1)
--
-- Run this once against a fresh Supabase project (SQL Editor, or `supabase
-- db push` if you set up the CLI). Mirrors the row shapes in
-- app/src/lib/seedData.js exactly, per docs/app/app-architecture.md.
--
-- Auth model (per docs/app/PRD.md §6): no self-serve signup. A
-- facilitator/admin pre-creates a row in public.users with a real email
-- and a role, BEFORE that person ever logs in. When they later sign in via
-- Supabase magic link, a trigger links their new auth.users row to the
-- matching public.users row by email. If nobody pre-created a row for that
-- email, the login succeeds at the auth layer but has no linked profile —
-- the app treats that as "ask your facilitator to add you" (see
-- supabaseAdapter.js: hasUnprovisionedSession).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- users (profile table — distinct from auth.users, linked via auth_user_id)
-- ---------------------------------------------------------------------
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  email text unique not null,
  role text not null check (role in ('participant', 'facilitator', 'admin')),
  full_name text not null,
  preferred_language text not null default 'esl' check (preferred_language in ('es', 'esl')),
  created_at timestamptz not null default now()
);

-- Link a pre-provisioned profile to the real auth account the first time
-- that email signs in. security definer so it can write public.users even
-- though it runs from an auth.users trigger.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set auth_user_id = new.id
  where email = new.email and auth_user_id is null;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- RLS helper functions (security definer so they can read public.users
-- regardless of the calling user's own row-level permissions).
create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users where auth_user_id = auth.uid();
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where auth_user_id = auth.uid();
$$;

create or replace function public.facilitates_cohort(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cohorts
    where id = target_cohort_id and facilitator_id = public.current_profile_id()
  );
$$;

create or replace function public.is_in_cohort(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cohort_participants
    where cohort_id = target_cohort_id and participant_id = public.current_profile_id()
  );
$$;

alter table public.users enable row level security;

create policy "users read own profile" on public.users
  for select using (auth_user_id = auth.uid());

create policy "users update own profile" on public.users
  for update using (auth_user_id = auth.uid());

create policy "admin full access to users" on public.users
  for all using (public.current_role() = 'admin');

create policy "facilitator reads own cohort rosters" on public.users
  for select using (
    public.current_role() = 'facilitator'
    and id in (
      select cp.participant_id from public.cohort_participants cp
      join public.cohorts c on c.id = cp.cohort_id
      where c.facilitator_id = public.current_profile_id()
    )
  );

-- ---------------------------------------------------------------------
-- cohorts
-- ---------------------------------------------------------------------
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  track text not null check (track in ('es', 'esl')),
  level text not null default 'beginner',
  block_number integer not null default 1,
  current_week integer not null default 1,
  facilitator_id uuid not null references public.users (id),
  start_date date not null,
  end_date date
);

alter table public.cohorts enable row level security;

create policy "admin full access to cohorts" on public.cohorts
  for all using (public.current_role() = 'admin');

create policy "facilitator reads own cohorts" on public.cohorts
  for select using (facilitator_id = public.current_profile_id());

create policy "facilitator updates own cohorts" on public.cohorts
  for update using (facilitator_id = public.current_profile_id());

create policy "participant reads own cohort" on public.cohorts
  for select using (public.is_in_cohort(id));

-- ---------------------------------------------------------------------
-- cohort_participants
-- ---------------------------------------------------------------------
create table public.cohort_participants (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  participant_id uuid not null references public.users (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (cohort_id, participant_id)
);

alter table public.cohort_participants enable row level security;

create policy "admin full access to cohort_participants" on public.cohort_participants
  for all using (public.current_role() = 'admin');

create policy "facilitator reads own cohort roster links" on public.cohort_participants
  for select using (public.facilitates_cohort(cohort_id));

create policy "participant reads own enrollment" on public.cohort_participants
  for select using (participant_id = public.current_profile_id());

-- ---------------------------------------------------------------------
-- songs
--
-- Two kinds, distinguished by is_signature:
--   - Signature songs (is_signature = true): MEMOIVA's own — original
--     lyrics written by RAMP, recorded to a public-domain melody. One is
--     assigned per week via weekly_content.signature_song_id (see below)
--     — "songs every session" is a locked brand decision, not optional.
--   - Catalog songs (is_signature = false): a browsable library of
--     well-known public-domain songs in EN/ES, available anytime, not
--     tied to a specific week.
--
-- audio_url is nullable — a song can exist here (title, lyrics) before
-- RAMP has actually recorded it, so the weekly slot and the catalog
-- listing are never blocked on production being finished. lyrics is an
-- array of {text, start_seconds, end_seconds} for line-by-line sync;
-- start/end are null until someone times the line against a real
-- recording, which can only happen once that recording exists.
-- ---------------------------------------------------------------------
create table public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language text not null check (language in ('es', 'esl')),
  is_signature boolean not null default false,
  audio_url text,
  lyrics jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.songs enable row level security;

create policy "any signed-in user reads songs" on public.songs
  for select using (auth.uid() is not null);

create policy "admin manages songs" on public.songs
  for all using (public.current_role() = 'admin');

-- ---------------------------------------------------------------------
-- weekly_content
-- ---------------------------------------------------------------------
create table public.weekly_content (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  week_number integer not null,
  track text not null check (track in ('es', 'esl')),
  theme text not null,
  vocabulary jsonb not null default '[]',
  identity_close_es text,
  identity_close_en text,
  signature_song_id uuid references public.songs (id),
  unique (cohort_id, week_number)
);

alter table public.weekly_content enable row level security;

create policy "admin full access to weekly_content" on public.weekly_content
  for all using (public.current_role() = 'admin');

create policy "facilitator manages own cohort content" on public.weekly_content
  for all using (public.facilitates_cohort(cohort_id));

create policy "participant reads own cohort content" on public.weekly_content
  for select using (public.is_in_cohort(cohort_id));

-- ---------------------------------------------------------------------
-- participant_progress (weekly check-ins)
-- ---------------------------------------------------------------------
create table public.participant_progress (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  week_number integer not null,
  session text not null check (session in ('A', 'B')),
  check_in_confidence integer not null check (check_in_confidence between 1 and 5),
  check_in_memory integer not null check (check_in_memory between 1 and 5),
  completed_at timestamptz not null default now()
);

alter table public.participant_progress enable row level security;

create policy "admin full access to participant_progress" on public.participant_progress
  for all using (public.current_role() = 'admin');

create policy "facilitator reads own cohort progress" on public.participant_progress
  for select using (public.facilitates_cohort(cohort_id));

create policy "participant manages own progress" on public.participant_progress
  for all using (participant_id = public.current_profile_id());

-- ---------------------------------------------------------------------
-- game_scores
-- ---------------------------------------------------------------------
create table public.game_scores (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  week_number integer not null,
  game_type text not null,
  score integer not null,
  max_score integer not null,
  duration_seconds integer,
  played_at timestamptz not null default now()
);

alter table public.game_scores enable row level security;

create policy "admin full access to game_scores" on public.game_scores
  for all using (public.current_role() = 'admin');

create policy "facilitator reads own cohort scores" on public.game_scores
  for select using (public.facilitates_cohort(cohort_id));

create policy "participant manages own scores" on public.game_scores
  for all using (participant_id = public.current_profile_id());

-- ---------------------------------------------------------------------
-- coloring_saves (private to the student + admin — not shown to facilitators)
-- ---------------------------------------------------------------------
create table public.coloring_saves (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.users (id) on delete cascade,
  week_number integer not null,
  image_data jsonb not null default '{}',
  saved_at timestamptz not null default now(),
  unique (participant_id, week_number)
);

alter table public.coloring_saves enable row level security;

create policy "admin full access to coloring_saves" on public.coloring_saves
  for all using (public.current_role() = 'admin');

create policy "participant manages own coloring saves" on public.coloring_saves
  for all using (participant_id = public.current_profile_id());

-- ---------------------------------------------------------------------
-- facilitator_notes (private — never readable by the participant)
-- ---------------------------------------------------------------------
create table public.facilitator_notes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.users (id) on delete cascade,
  facilitator_id uuid not null references public.users (id),
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (participant_id)
);

alter table public.facilitator_notes enable row level security;

create policy "admin full access to facilitator_notes" on public.facilitator_notes
  for all using (public.current_role() = 'admin');

create policy "facilitator manages notes on own cohort students" on public.facilitator_notes
  for all using (
    facilitator_id = public.current_profile_id()
    and exists (
      select 1 from public.cohort_participants cp
      join public.cohorts c on c.id = cp.cohort_id
      where cp.participant_id = facilitator_notes.participant_id
        and c.facilitator_id = public.current_profile_id()
    )
  );

-- ---------------------------------------------------------------------
-- Seeding real data
-- ---------------------------------------------------------------------
-- Don't seed demo rows here. For a real cohort: insert one row per real
-- student/facilitator into public.users (email + role + full_name) BEFORE
-- they ever log in, then insert the cohort, cohort_participants links, and
-- week 1 weekly_content. The app's admin "User Management" / "All
-- Cohorts" pages are the intended place to do this once wired to this
-- schema — until then, do it directly in the Supabase table editor or SQL
-- editor.
