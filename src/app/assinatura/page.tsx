import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { PixSubscribeButton } from "./pix-subscribe-button";
import { signOut } from "../(auth)/actions";
import { Button } from "@/components/ui/button";
import { hasActiveSubscription } from "@/lib/subscription";

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_expires_at")
    .eq("id", user.id)
    .single();

  if (hasActiveSubscription(profile)) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-mesh relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <TiltCard maxTilt={6} className="relative w-full max-w-sm">
        <Card className="border-emerald-500/20 bg-gradient-to-b from-neutral-900 to-neutral-900/60 text-center shadow-[0_30px_80px_-30px_rgba(16,185,129,0.4)]">
          <h1 className="text-xl font-semibold text-neutral-100">Assine para continuar</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Acesso completo à sua tabela de gestão financeira: lançamentos, totais por
            dia/semana/mês e calendário.
          </p>
          <p className="my-6 text-3xl font-bold text-neutral-100">
            R$ 14,99<span className="text-base font-normal text-neutral-400">/mês</span>
          </p>

          <div className="space-y-3 text-left">
            <PixSubscribeButton />
            <p className="text-center text-xs text-neutral-500">
              Pix: acesso por 30 dias, renovação manual.
            </p>
          </div>

          <form action={signOut} className="mt-6">
            <Button type="submit" variant="ghost" className="w-full">
              Sair
            </Button>
          </form>
        </Card>
      </TiltCard>
    </div>
  );
}
