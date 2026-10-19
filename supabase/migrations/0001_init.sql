-- ============================================================================
-- LaunchForge – initial schema, constraints, triggers and Row Level Security
-- Run this in the Supabase SQL editor, or via the Supabase CLI:
--   supabase db push   (or)   supabase migration up
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'LaunchForge Creator',
  handle       text,
  role         text not null default 'Creator',
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  name            text not null check (char_length(name) between 2 and 80),
  tagline         text not null check (char_length(tagline) between 2 and 140),
  description     text not null check (char_length(description) between 10 and 4000),
  full_description text,
  category        text not null check (char_length(category) <= 40),
  tags            text[] not null default '{}',
  image           text,
  demo_url        text check (demo_url is null or demo_url ~* '^https?://'),
  github_url      text check (github_url is null or github_url ~* '^https?://'),
  tech_stack      text[] not null default '{}',
  milestones      text[] not null default '{}',
  featured        boolean not null default false,
  trending        boolean not null default false,
  is_sample       boolean not null default false,
  view_count      bigint  not null default 0 check (view_count >= 0),
  like_count      bigint  not null default 0 check (like_count >= 0),
  comment_count   bigint  not null default 0 check (comment_count >= 0),
  launched_at     timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_likes  (composite PK makes duplicate likes impossible)
-- ---------------------------------------------------------------------------
create table if not exists public.project_likes (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- ---------------------------------------------------------------------------
-- project_comments
-- ---------------------------------------------------------------------------
create table if not exists public.project_comments (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  text       text not null check (char_length(text) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_projects_user_id      on public.projects (user_id);
create index if not exists idx_projects_category     on public.projects (category);
create index if not exists idx_projects_created_at   on public.projects (created_at desc);
create index if not exists idx_projects_tags         on public.projects using gin (tags);
create index if not exists idx_projects_search       on public.projects
  using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(description,'')));

create index if not exists idx_likes_user            on public.project_likes (user_id);
create index if not exists idx_comments_project      on public.project_comments (project_id, created_at desc);
create index if not exists idx_comments_user         on public.project_comments (user_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_comments_updated on public.project_comments;
create trigger trg_comments_updated before update on public.project_comments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when an auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, handle, role, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1),
      'LaunchForge Creator'
    ),
    coalesce(
      '@' || nullif(new.raw_user_meta_data ->> 'user_name', ''),
      '@' || nullif(split_part(new.email, '@', 1), ''),
      '@creator'
    ),
    'Creator',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Maintain like / comment counters
-- ---------------------------------------------------------------------------
create or replace function public.bump_like_count()
returns trigger
language plpgsql
as $$
begin
  -- Flag the nested projects update as internal so the owner-write guard
  -- trigger does not counteract the counter change.
  perform set_config('launchforge.skip_guard', '1', true);
  if (tg_op = 'INSERT') then
    update public.projects set like_count = like_count + 1 where id = new.project_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.projects set like_count = like_count - 1 where id = old.project_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_likes_count on public.project_likes;
create trigger trg_likes_count
  after insert or delete on public.project_likes
  for each row execute function public.bump_like_count();

create or replace function public.bump_comment_count()
returns trigger
language plpgsql
as $$
begin
  perform set_config('launchforge.skip_guard', '1', true);
  if (tg_op = 'INSERT') then
    update public.projects set comment_count = comment_count + 1 where id = new.project_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.projects set comment_count = comment_count - 1 where id = old.project_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_comments_count on public.project_comments;
create trigger trg_comments_count
  after insert or delete on public.project_comments
  for each row execute function public.bump_comment_count();

-- ---------------------------------------------------------------------------
-- Guard editorial / derived columns from being written by their owner.
-- If the row owner (auth.uid() = user_id) is updating, restore counters and
-- editorial flags to their existing values. Service-role edits (auth.uid()
-- is null) pass through so admins can feature projects.
-- ---------------------------------------------------------------------------
create or replace function public.projects_guard_owner_writes()
returns trigger
language plpgsql
as $$
begin
  -- Let internal counter maintenance (likes/comments/views) through untouched.
  if coalesce(current_setting('launchforge.skip_guard', true), '') = '1' then
    return new;
  end if;

  if auth.uid() is not null and auth.uid() = old.user_id then
    new.like_count    = old.like_count;
    new.comment_count = old.comment_count;
    new.view_count    = old.view_count;
    new.is_sample     = old.is_sample;
    new.featured      = old.featured;
    new.trending      = old.trending;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_projects_guard on public.projects;
create trigger trg_projects_guard before update on public.projects
  for each row execute function public.projects_guard_owner_writes();

-- ---------------------------------------------------------------------------
-- View counter (security definer so clients don't get blanket UPDATE access)
-- ---------------------------------------------------------------------------
create or replace function public.increment_project_view(project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('launchforge.skip_guard', '1', true);
  update public.projects set view_count = view_count + 1 where id = project_id;
end;
$$;

grant execute on function public.increment_project_view(uuid) to anon, authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.project_likes   enable row level security;
alter table public.project_comments enable row level security;

-- profiles: publicly readable, privately writable
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- projects: publicly readable (only intended public columns exist),
-- insert/update/delete restricted to the owner, and owners cannot forge
-- counters or editorial flags (also enforced by the guard trigger).
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects
  for select using (true);

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and is_sample = false
    and featured = false
    and trending = false
    and like_count = 0
    and comment_count = 0
    and view_count = 0
  );

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects
  for delete to authenticated
  using (auth.uid() = user_id);

-- likes: readable by all, only the owner can add/remove their own like
drop policy if exists likes_select on public.project_likes;
create policy likes_select on public.project_likes
  for select using (true);

drop policy if exists likes_insert on public.project_likes;
create policy likes_insert on public.project_likes
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists likes_delete on public.project_likes;
create policy likes_delete on public.project_likes
  for delete to authenticated
  using (auth.uid() = user_id);

-- comments: readable by all, author-only write/edit/delete
drop policy if exists comments_select on public.project_comments;
create policy comments_select on public.project_comments
  for select using (true);

drop policy if exists comments_insert on public.project_comments;
create policy comments_insert on public.project_comments
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists comments_update on public.project_comments;
create policy comments_update on public.project_comments
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists comments_delete on public.project_comments;
create policy comments_delete on public.project_comments
  for delete to authenticated
  using (auth.uid() = user_id);
