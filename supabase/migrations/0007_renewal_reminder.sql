-- Tracks which expiry the last renewal-reminder email was sent for, so the
-- daily cron doesn't re-send every day within the reminder window, but does
-- send again after a renewal pushes subscription_expires_at forward.
alter table profiles add column if not exists renewal_reminder_sent_for timestamptz;
