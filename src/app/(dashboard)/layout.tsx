import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/date-helpers";
import { hasActiveSubscription, isTrialActive, getTrialEndsAt } from "@/lib/subscription";
import { TrialCountdownBanner } from "@/components/trial-countdown-banner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let expiryBanner: string | null = null;
  let trialEndsAt: string | null = null;
  let subscriptionDaysLeft: number | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_expires_at, trial_started_at")
      .eq("id", user.id)
      .single();

    if (profile && !hasActiveSubscription(profile) && isTrialActive(profile)) {
      trialEndsAt = getTrialEndsAt(profile)!.toISOString();
    } else if (profile?.subscription_expires_at) {
      const daysLeft = daysUntil(profile.subscription_expires_at);
      subscriptionDaysLeft = daysLeft;
      if (daysLeft <= 5) {
        expiryBanner =
          daysLeft > 0
            ? `Sua assinatura Pix expira em ${daysLeft} dia${daysLeft === 1 ? "" : "s"}.`
            : "Sua assinatura Pix expirou.";
      }
    }
  }

  return (
    <div className="bg-mesh relative min-h-screen bg-neutral-950">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative">
        <Navbar subscriptionDaysLeft={subscriptionDaysLeft} />
        {trialEndsAt && <TrialCountdownBanner endsAt={trialEndsAt} />}
        {!trialEndsAt && expiryBanner && (
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-6 py-2 text-center text-sm text-amber-300">
            {expiryBanner}{" "}
            <Link href="/assinatura" className="font-medium underline">
              Renovar agora
            </Link>
          </div>
        )}
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
