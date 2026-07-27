import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { Navbar } from "@/components/navbar";
import { SummaryCards } from "@/components/summary-cards";
import { EntryForm } from "@/components/entry-form";
import { EntriesTable } from "@/components/entries-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Entry } from "@/lib/database.types";

const NOW_ISO = new Date().toISOString();

const FAKE_ENTRIES: Entry[] = [
  {
    id: "demo-1",
    user_id: "demo",
    entry_date: "2026-07-24",
    casa_aposta: "Bet365",
    cliente_nome: "Carlos Souza",
    cliente_parte: 45,
    deposito: 500,
    saque: 620.5,
    lucro: 120.5,
    created_at: NOW_ISO,
  },
  {
    id: "demo-2",
    user_id: "demo",
    entry_date: "2026-07-24",
    casa_aposta: "Betano",
    cliente_nome: "Marina Lima",
    cliente_parte: 30,
    deposito: 300,
    saque: 380,
    lucro: 80,
    created_at: NOW_ISO,
  },
  {
    id: "demo-3",
    user_id: "demo",
    entry_date: "2026-07-23",
    casa_aposta: "KTO",
    cliente_nome: "Carlos Souza",
    cliente_parte: 25,
    deposito: 200,
    saque: 265.75,
    lucro: 65.75,
    created_at: NOW_ISO,
  },
];

export default async function DemoPage() {
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

  if (hasActiveSubscription(profile)) redirect("/dashboard");

  return (
    <div className="bg-mesh relative min-h-screen bg-neutral-950">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative">
        <Navbar />
        <div className="border-b border-emerald-500/20 bg-emerald-500/10 px-6 py-2 text-center text-sm text-emerald-300">
          Isso é uma demonstração — os dados são de exemplo e os botões estão travados.{" "}
          <Link href="/assinatura" className="font-medium underline">
            Assine para desbloquear
          </Link>
        </div>

        <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
          <SummaryCards hoje={200.5} semana={266.25} mes={266.25} />

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Novo lançamento</h2>
            <EntryForm readOnly />
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Lançamentos deste mês</h2>
            <EntriesTable entries={FAKE_ENTRIES} readOnly />
          </Card>

          <Card className="text-center">
            <p className="text-neutral-300">
              Assine para adicionar seus próprios lançamentos, editar e excluir, ver o calendário
              completo e acompanhar seus totais em tempo real.
            </p>
            <Link href="/assinatura" className="mt-4 inline-block">
              <Button className="px-8">Quero assinar agora</Button>
            </Link>
          </Card>
        </main>
      </div>
    </div>
  );
}
