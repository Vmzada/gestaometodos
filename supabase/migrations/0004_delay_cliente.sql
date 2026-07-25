alter table delay_entries add column if not exists cliente_nome text;
alter table delay_entries add column if not exists cliente_parte numeric(12, 2) not null default 0;
