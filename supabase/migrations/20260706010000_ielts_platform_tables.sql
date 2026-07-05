create table if not exists public.essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_type text not null check (task_type in ('task1', 'task2')),
  prompt text not null,
  essay text not null,
  feedback jsonb not null default '{}'::jsonb,
  estimated_band numeric(3,1),
  created_at timestamptz not null default now()
);

create table if not exists public.speaking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  part text not null check (part in ('1', '2', '3')),
  turns jsonb not null default '[]'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  estimated_band numeric(3,1),
  created_at timestamptz not null default now()
);

create table if not exists public.generated_quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null check (
    section in ('Listening', 'Reading', 'Writing Task 1', 'Writing Task 2', 'Speaking', 'Vocabulary', 'Grammar')
  ),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  score numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.study_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  folder text not null default 'General',
  mime_type text,
  size_bytes bigint not null default 0,
  storage_path text,
  text_preview text,
  ai_summary jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  section text not null check (
    section in ('Listening', 'Reading', 'Writing Task 1', 'Writing Task 2', 'Speaking', 'Vocabulary', 'Grammar')
  ),
  label text not null,
  score numeric(5,2),
  xp integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.essays enable row level security;
alter table public.speaking_sessions enable row level security;
alter table public.generated_quizzes enable row level security;
alter table public.study_files enable row level security;
alter table public.progress_events enable row level security;

drop policy if exists "Users manage their essays" on public.essays;
create policy "Users manage their essays"
  on public.essays for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their speaking sessions" on public.speaking_sessions;
create policy "Users manage their speaking sessions"
  on public.speaking_sessions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their generated quizzes" on public.generated_quizzes;
create policy "Users manage their generated quizzes"
  on public.generated_quizzes for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their study files" on public.study_files;
create policy "Users manage their study files"
  on public.study_files for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their progress events" on public.progress_events;
create policy "Users manage their progress events"
  on public.progress_events for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists essays_user_created_idx on public.essays (user_id, created_at desc);
create index if not exists speaking_user_created_idx on public.speaking_sessions (user_id, created_at desc);
create index if not exists generated_quizzes_user_section_idx on public.generated_quizzes (user_id, section, created_at desc);
create index if not exists study_files_user_folder_idx on public.study_files (user_id, folder, created_at desc);
create index if not exists progress_events_user_created_idx on public.progress_events (user_id, created_at desc);
