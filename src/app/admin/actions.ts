"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentClient } from "@/lib/mercadopago";
import { activatePixPayment } from "@/lib/activate-pix-payment";
import { hasActiveSubscription } from "@/lib/subscription";
import { isAdminEmail } from "@/lib/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) throw new Error("Não autorizado.");
}

// Cross-checks Mercado Pago's approved payments against profiles that
// currently show no active access, in case a webhook notification was
// missed. Only ever touches profiles that aren't already active, and
// skips payments already recorded on the profile, so it's safe to run
// repeatedly without double-crediting a renewal.
export async function reconcilePayments() {
  await requireAdmin();

  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, subscription_status, subscription_expires_at, mp_subscription_id");

  const stuck = (profiles ?? []).filter((p) => !hasActiveSubscription(p));
  if (stuck.length === 0) {
    return { checked: 0, fixed: [] as string[] };
  }

  const beginDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const search = await getPaymentClient().search({
    options: {
      status: "approved",
      sort: "date_approved",
      criteria: "desc",
      range: "date_approved",
      begin_date: beginDate,
      end_date: new Date().toISOString(),
      limit: 50,
    },
  });

  const payments = search.results ?? [];
  const fixed: string[] = [];

  for (const profile of stuck) {
    const match = payments.find(
      (p) => p.external_reference === profile.id && p.id != null && String(p.id) !== profile.mp_subscription_id,
    );
    if (!match?.id) continue;

    const { activated } = await activatePixPayment(String(match.id));
    if (activated) fixed.push(profile.email);
  }

  revalidatePath("/admin");
  return { checked: stuck.length, fixed };
}
