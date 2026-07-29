import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { daysUntil } from "@/lib/date-helpers";

const REMINDER_WINDOW_DAYS = 3;

function renewalEmailHtml(daysLeft: number) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h2 style="color: #059669;">Sua assinatura vence em ${daysLeft} dia${daysLeft === 1 ? "" : "s"}</h2>
      <p>Renove por Pix para continuar com acesso total à sua planilha de gestão financeira.</p>
      <p style="margin: 24px 0;">
        <a
          href="https://gestaodosmetodos.online/assinatura"
          style="background: linear-gradient(135deg,#34d399,#0d9488); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;"
        >
          Renovar agora — R$ 14,99
        </a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">Gestão dos Métodos</p>
    </div>
  `;
}

// Runs daily via Vercel Cron (see vercel.json). Only the dashboard countdown
// badge existed before this — it never reached customers who weren't
// currently logged in and about to lose access.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, subscription_expires_at, renewal_reminder_sent_for")
    .eq("subscription_status", "active")
    .not("subscription_expires_at", "is", null);

  const due = (profiles ?? []).filter((p) => {
    const daysLeft = daysUntil(p.subscription_expires_at!);
    const alreadySentForThisExpiry = p.renewal_reminder_sent_for === p.subscription_expires_at;
    return daysLeft > 0 && daysLeft <= REMINDER_WINDOW_DAYS && !alreadySentForThisExpiry;
  });

  let sent = 0;
  for (const profile of due) {
    const daysLeft = daysUntil(profile.subscription_expires_at!);
    try {
      await sendEmail({
        to: profile.email,
        subject: "Sua assinatura vence em breve — Gestão dos Métodos",
        html: renewalEmailHtml(daysLeft),
      });
      await supabase
        .from("profiles")
        .update({ renewal_reminder_sent_for: profile.subscription_expires_at })
        .eq("id", profile.id);
      sent++;
    } catch (err) {
      console.error(`Falha ao enviar lembrete de renovação para ${profile.email}:`, err);
    }
  }

  return NextResponse.json({ checked: due.length, sent });
}
