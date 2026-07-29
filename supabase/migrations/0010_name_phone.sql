alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists phone text;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, trial_started_at, full_name, phone)
  values (
    new.id,
    new.email,
    now(),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;
