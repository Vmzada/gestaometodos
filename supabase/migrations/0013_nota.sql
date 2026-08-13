-- Optional free-text note the user can attach to an entry, e.g. a reminder
-- of what was done.
alter table entries add column if not exists nota text;
