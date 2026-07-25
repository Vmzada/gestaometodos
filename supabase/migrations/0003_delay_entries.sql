create table if not exists delay_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  casa_aposta text not null,
  odd numeric(8, 2) not null,
  valor numeric(12, 2) not null,
  lucro numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists delay_entries_user_date_idx on delay_entries (user_id, entry_date);

alter table delay_entries enable row level security;

drop policy if exists "own delay entries" on delay_entries;
create policy "own delay entries" on delay_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
