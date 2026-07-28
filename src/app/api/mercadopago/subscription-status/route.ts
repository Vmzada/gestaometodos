import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { activatePixPayment } from "@/lib/activate-pix-payment";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_expires_at")
    .eq("id", user.id)
    .single();

  // Fallback in case the Mercado Pago webhook notification never arrives:
  // confirm the payment directly with Mercado Pago's API instead of waiting.
  const paymentId = new URL(request.url).searchParams.get("paymentId");
  if (paymentId && !hasActiveSubscription(profile)) {
    try {
      const { activated, userId } = await activatePixPayment(paymentId);
      if (activated && userId === user.id) {
        const { data: refreshed } = await supabase
          .from("profiles")
          .select("subscription_status, subscription_expires_at")
          .eq("id", user.id)
          .single();
        profile = refreshed;
      }
    } catch (err) {
      console.error("Falha ao confirmar pagamento Pix diretamente:", err);
    }
  }

  return NextResponse.json({
    active: hasActiveSubscription(profile),
    expiresAt: profile?.subscription_expires_at ?? null,
  });
}
