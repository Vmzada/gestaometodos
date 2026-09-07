-- Mercado de "erro": odd publicada errada pela casa em jogo esportivo. Tem a
-- mesma forma do delay (casa, odd, valor, green/red, cliente e parte do
-- cliente), então espelha delay_entries — inclusive as colunas de cliente que
-- lá vieram depois, na 0004.
create table if not exists erro_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  casa_aposta text not null,
  odd numeric(8, 2) not null,
  valor numeric(12, 2) not null,
  cliente_nome text,
  cliente_parte numeric(12, 2) not null default 0,
  lucro numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists erro_entries_user_date_idx on erro_entries (user_id, entry_date);

alter table erro_entries enable row level security;

drop policy if exists "own erro entries" on erro_entries;
create policy "own erro entries" on erro_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
