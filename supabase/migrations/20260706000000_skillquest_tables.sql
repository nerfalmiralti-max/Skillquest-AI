create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subject text check (subject in ('English', 'IELTS', 'Biology', 'Math', 'Programming')),
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  daily_time integer check (daily_time in (10, 20, 30, 60)),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_quest_date date,
  boss_attempts integer not null default 0 check (boss_attempts >= 0),
  boss_wins integer not null default 0 check (boss_wins >= 0),
  tutor_messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  date_key date not null,
  title text,
  subject text check (subject in ('English', 'IELTS', 'Biology', 'Math', 'Programming')),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  completed_at timestamptz not null default now(),
  unique (user_id, date_key, quest_id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null check (
    achievement_id in ('firstQuest', 'hundredXp', 'bossDefeated', 'threeDayStreak')
  ),
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text check (subject in ('English', 'IELTS', 'Biology', 'Math', 'Programming')),
  score integer not null check (score >= 0),
  total_questions integer not null default 5 check (total_questions > 0),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  passed boolean not null default false,
  completed_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.achievements enable row level security;
alter table public.quiz_results enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their quests" on public.quests;
create policy "Users can read their quests"
  on public.quests for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their quests" on public.quests;
create policy "Users can insert their quests"
  on public.quests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their quests" on public.quests;
create policy "Users can update their quests"
  on public.quests for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their achievements" on public.achievements;
create policy "Users can read their achievements"
  on public.achievements for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their achievements" on public.achievements;
create policy "Users can insert their achievements"
  on public.achievements for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their achievements" on public.achievements;
create policy "Users can update their achievements"
  on public.achievements for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their quiz results" on public.quiz_results;
create policy "Users can read their quiz results"
  on public.quiz_results for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their quiz results" on public.quiz_results;
create policy "Users can insert their quiz results"
  on public.quiz_results for insert
  to authenticated
  with check (auth.uid() = user_id);

create index if not exists quests_user_date_idx on public.quests (user_id, date_key);
create index if not exists achievements_user_idx on public.achievements (user_id);
create index if not exists quiz_results_user_completed_idx on public.quiz_results (user_id, completed_at desc);
