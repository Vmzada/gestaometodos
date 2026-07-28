export const PIX_SUBSCRIPTION_DAYS = 30;
export const TRIAL_HOURS = 2;

type SubscriptionProfile = {
  subscription_status: string;
  subscription_expires_at: string | null;
} | null;

type TrialProfile = {
  trial_started_at: string | null;
} | null;

export function hasActiveSubscription(profile: SubscriptionProfile) {
  if (!profile || profile.subscription_status !== "active") return false;
  if (profile.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()) {
    return false;
  }
  return true;
}

export function getTrialEndsAt(profile: TrialProfile): Date | null {
  if (!profile?.trial_started_at) return null;
  return new Date(new Date(profile.trial_started_at).getTime() + TRIAL_HOURS * 60 * 60 * 1000);
}

export function isTrialActive(profile: TrialProfile) {
  const endsAt = getTrialEndsAt(profile);
  return !!endsAt && endsAt.getTime() > Date.now();
}

export function hasDashboardAccess(profile: (SubscriptionProfile & TrialProfile) | null) {
  return hasActiveSubscription(profile) || isTrialActive(profile);
}
