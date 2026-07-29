-- Optional CPA (fixed referral bonus some betting houses pay per new client
-- account) — added on top of the deposit/withdrawal profit, not shared with
-- the client's cut.
alter table entries add column if not exists cpa numeric(12,2) not null default 0;
