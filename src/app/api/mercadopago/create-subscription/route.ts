import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPreApprovalClient, PLAN_PRICE_BRL } from "@/lib/mercadopago";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  try {
    const preApproval = await getPreApprovalClient().create({
      body: {
        reason: "Assinatura Gestão dos Métodos",
        external_reference: user.id,
        payer_email: user.email,
        back_url: `${siteUrl}/dashboard`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: PLAN_PRICE_BRL,
          currency_id: "BRL",
        },
      },
    });

    return NextResponse.json({ init_point: preApproval.init_point });
  } catch (err) {
    console.error("Erro ao criar assinatura no Mercado Pago:", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar a assinatura. Tente novamente." },
      { status: 502 },
    );
  }
}
