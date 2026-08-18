-- Optional flag for expenses paid via Pix, plus the recipient's name.
alter table gastos add column if not exists via_pix boolean not null default false;
alter table gastos add column if not exists pix_nome text;
