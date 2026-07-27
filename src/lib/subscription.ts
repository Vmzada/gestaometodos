export const PIX_SUBSCRIPTION_DAYS = 30;

type SubscriptionProfile = {
  subscription_status: string;
  subscription_expires_at: string | null;
} | null;

export function hasActiveSubscription(profile: SubscriptionProfile) {
  if (!profile || profile.subscription_status !== "active") return false;
  if (profile.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()) {
    return false;
  }
  return true;
}
