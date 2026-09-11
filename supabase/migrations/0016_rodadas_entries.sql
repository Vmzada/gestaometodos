-- Rodadas grátis: giros de promoção da casa. Não tem odd nem aposta — o giro
-- é de graça —, então o lucro é só o que rendeu menos a parte do cliente.
-- Por isso tem tabela e formulário próprios, em vez de reaproveitar os
-- mercados esportivos (delay/erro), que giram em torno de odd e valor.
create table if not exists rodadas_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  casa_aposta text not null,
  quantidade integer not null default 0,
  valor_ganho numeric(12, 2) not null,
  cliente_nome text,
  cliente_parte numeric(12, 2) not null default 0,
  lucro numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists rodadas_entries_user_date_idx on rodadas_entries (user_id, entry_date);

alter table rodadas_entries enable row level security;

drop policy if exists "own rodadas entries" on rodadas_entries;
create policy "own rodadas entries" on rodadas_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
