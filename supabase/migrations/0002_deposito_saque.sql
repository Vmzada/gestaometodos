alter table entries add column if not exists deposito numeric(12, 2) not null default 0;
alter table entries add column if not exists saque numeric(12, 2) not null default 0;
