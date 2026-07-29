-- Records when the current subscription period was actually paid for,
-- separate from created_at (signup date), so the admin panel can show both.
alter table profiles add column if not exists last_payment_at timestamptz;
