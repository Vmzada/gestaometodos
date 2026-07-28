import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentClient } from "@/lib/mercadopago";
import { PIX_SUBSCRIPTION_DAYS } from "@/lib/subscription";

// Shared by the Mercado Pago webhook and by the client-side status poll,
// which double-checks payment status directly in case the webhook
// notification never arrives (e.g. misconfigured webhook topics).
export async function activatePixPayment(paymentId: string) {
  const payment = await getPaymentClient().get({ id: Number(paymentId) });
  if (payment.status !== "approved") return { activated: false };

  const userId = payment.external_reference;
  if (!userId) return { activated: false };

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_expires_at")
    .eq("id", userId)
    .single();

  const currentExpiry = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at)
    : null;
  const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();
  const newExpiry = new Date(base.getTime() + PIX_SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);

  await supabase
    .from("profiles")
    .update({
      subscription_status: "active",
      subscription_expires_at: newExpiry.toISOString(),
      mp_subscription_id: paymentId,
    })
    .eq("id", userId);

  return { activated: true, userId };
}
