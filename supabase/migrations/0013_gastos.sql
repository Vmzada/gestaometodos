create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gasto_date date not null,
  categoria text not null,
  descricao text,
  valor numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists gastos_user_date_idx on gastos (user_id, gasto_date);

alter table gastos enable row level security;

drop policy if exists "own gastos" on gastos;
create policy "own gastos" on gastos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
