import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { SummaryCards } from "@/components/summary-cards";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "../(auth)/actions";
import { formatBRL } from "@/lib/date-helpers";

const FAKE_ENTRIES = [
  { data: "24/07/2026", casa: "Bet365", cliente: "Carlos Souza", lucro: 120.5 },
  { data: "24/07/2026", casa: "Betano", cliente: "Marina Lima", lucro: 80.0 },
  { data: "23/07/2026", casa: "KTO", cliente: "Carlos Souza", lucro: 65.75 },
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
        <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-neutral-950/70 px-6 py-4 backdrop-blur-md">
          <span className="text-lg font-semibold tracking-tight text-neutral-100">
            Gestão dos Métodos
          </span>
          <div className="flex items-center gap-3">
            <form action={signOut}>
              <Button type="submit" variant="ghost">
                Sair
              </Button>
            </form>
            <Link href="/assinatura">
              <Button>Assinar agora</Button>
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300">
            Isso é uma demonstração com dados de exemplo — assine para usar com seus próprios
            lançamentos.
          </div>

          <SummaryCards hoje={200.5} semana={266.25} mes={266.25} />

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Lançamentos deste mês</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-left text-neutral-400">
                    <th className="py-2 pr-3 font-medium">Data</th>
                    <th className="py-2 pr-3 font-medium">Casa de aposta</th>
                    <th className="py-2 pr-3 font-medium">Cliente</th>
                    <th className="py-2 pr-3 font-medium">Lucro</th>
                  </tr>
                </thead>
                <tbody>
                  {FAKE_ENTRIES.map((entry) => (
                    <tr
                      key={`${entry.data}-${entry.casa}`}
                      className="border-b border-neutral-900 text-neutral-200"
                    >
                      <td className="py-2 pr-3">{entry.data}</td>
                      <td className="py-2 pr-3">{entry.casa}</td>
                      <td className="py-2 pr-3">{entry.cliente}</td>
                      <td className="py-2 pr-3 font-medium text-emerald-400">
                        {formatBRL(entry.lucro)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="text-center">
            <p className="text-neutral-300">
              Assine para adicionar seus próprios lançamentos, ver o calendário completo e
              acompanhar seus totais em tempo real.
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
