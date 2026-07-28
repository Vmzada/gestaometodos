import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPreApprovalClient } from "@/lib/mercadopago";
import { activatePixPayment } from "@/lib/activate-pix-payment";

// Verifies the x-signature header Mercado Pago sends, per their docs:
// https://www.mercadopago.com/developers/en/docs/checkout-api/webhooks#editor_2
function isValidSignature(request: Request, dataId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // secret not configured yet (e.g. local/sandbox testing)

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => part.trim().split("=") as [string, string]),
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expectedHash);
  const b = Buffer.from(receivedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handleSubscriptionPreapproval(dataId: string) {
  const preApproval = await getPreApprovalClient().get({ id: dataId });
  const userId = preApproval.external_reference;
  if (!userId) return;

  const subscriptionStatus = preApproval.status === "authorized" ? "active" : "inactive";

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ subscription_status: subscriptionStatus, mp_subscription_id: dataId })
    .eq("id", userId);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);

  const dataId: string | undefined =
    url.searchParams.get("data.id") ?? body?.data?.id ?? undefined;
  const type: string | undefined = url.searchParams.get("type") ?? body?.type ?? undefined;

  if (!dataId || (type !== "subscription_preapproval" && type !== "payment")) {
    return NextResponse.json({ received: true });
  }

  if (!isValidSignature(request, dataId)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  try {
    if (type === "subscription_preapproval") {
      await handleSubscriptionPreapproval(dataId);
    } else {
      await activatePixPayment(dataId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Erro ao processar webhook do Mercado Pago:", err);
    return NextResponse.json({ error: "Erro ao processar webhook." }, { status: 500 });
  }
}
