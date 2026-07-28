alter table profiles add column if not exists trial_started_at timestamptz;

-- Existing accounts get a fresh trial window starting now, so nobody is
-- retroactively locked out by this rollout.
update profiles set trial_started_at = now() where trial_started_at is null;

-- New signups start their trial immediately.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, trial_started_at) values (new.id, new.email, now());
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Nothing in the app writes to profiles from the browser (the webhook and
-- the trigger both use privileged access), so tighten this to read-only for
-- end users — otherwise anyone could reset their own trial_started_at.
drop policy if exists "own profile" on profiles;
create policy "own profile select" on profiles
  for select using (auth.uid() = id);
