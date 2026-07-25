-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  subscription_status text not null default 'inactive', -- inactive | active | cancelled
  mp_subscription_id text,
  created_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  casa_aposta text not null,
  cliente_nome text not null,
  cliente_parte numeric(12, 2) not null default 0,
  lucro numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists entries_user_date_idx on entries (user_id, entry_date);

alter table profiles enable row level security;
alter table entries enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own entries" on entries;
create policy "own entries" on entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Automatically create a profile row whenever a new user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
