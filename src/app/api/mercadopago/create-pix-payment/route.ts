import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentClient, PLAN_PRICE_BRL } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { cpf } = await request.json().catch(() => ({ cpf: "" }));
  const cpfDigits = String(cpf ?? "").replace(/\D/g, "");
  if (cpfDigits.length !== 11) {
    return NextResponse.json({ error: "Informe um CPF válido." }, { status: 400 });
  }

  try {
    const payment = await getPaymentClient().create({
      body: {
        transaction_amount: PLAN_PRICE_BRL,
        payment_method_id: "pix",
        description: "Assinatura Gestão dos Métodos (30 dias)",
        external_reference: user.id,
        payer: {
          email: user.email,
          identification: { type: "CPF", number: cpfDigits },
        },
      },
    });

    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64;

    if (!qrCode || !qrCodeBase64) {
      throw new Error("Mercado Pago não retornou o QR code.");
    }

    return NextResponse.json({ paymentId: payment.id, qrCode, qrCodeBase64 });
  } catch (err) {
    console.error("Erro ao criar pagamento Pix no Mercado Pago:", err);
    return NextResponse.json(
      { error: "Não foi possível gerar o Pix. Tente novamente." },
      { status: 502 },
    );
  }
}
