import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { LucroChart } from "@/components/stats/lucro-chart";
import { ComparativoChart } from "@/components/stats/comparativo-chart";
import { formatBRL, MESES_PT, nowInBrazil, toISODate } from "@/lib/date-helpers";

export const dynamic = "force-dynamic";

const MONTHS_BACK = 12;

function monthBuckets(now: Date, count: number) {
  const buckets: { key: string; label: string; year: number; month: number }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    buckets.push({
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      label: `${MESES_PT[d.getUTCMonth()].slice(0, 3)}/${String(d.getUTCFullYear()).slice(2)}`,
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
    });
  }
  return buckets;
}

export default async function EstatisticasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = nowInBrazil();
  const buckets = monthBuckets(now, MONTHS_BACK);
  const rangeStart = `${buckets[0].year}-${String(buckets[0].month + 1).padStart(2, "0")}-01`;
  const rangeEnd = toISODate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)));

  const [entriesRes, delayRes] = await Promise.all([
    supabase
      .from("entries")
      .select("entry_date, deposito, cliente_parte, cpa, lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", rangeStart)
      .lte("entry_date", rangeEnd),
    supabase
      .from("delay_entries")
      .select("entry_date, lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", rangeStart)
      .lte("entry_date", rangeEnd),
  ]);

  type Bucket = { deposito: number; clienteParte: number; cpa: number; lucro: number };
  const byMonth = new Map<string, Bucket>();
  for (const b of buckets) byMonth.set(b.key, { deposito: 0, clienteParte: 0, cpa: 0, lucro: 0 });

  for (const row of entriesRes.data ?? []) {
    const bucket = byMonth.get(row.entry_date.slice(0, 7));
    if (!bucket) continue;
    bucket.deposito += Number(row.deposito);
    bucket.clienteParte += Number(row.cliente_parte);
    bucket.cpa += Number(row.cpa);
    bucket.lucro += Number(row.lucro);
  }
  for (const row of delayRes.data ?? []) {
    const bucket = byMonth.get(row.entry_date.slice(0, 7));
    if (!bucket) continue;
    bucket.lucro += Number(row.lucro);
  }

  const months = buckets.map((b) => ({ ...b, ...byMonth.get(b.key)! }));

  const totals = months.reduce(
    (acc, m) => ({
      deposito: acc.deposito + m.deposito,
      clienteParte: acc.clienteParte + m.clienteParte,
      cpa: acc.cpa + m.cpa,
      lucro: acc.lucro + m.lucro,
    }),
    { deposito: 0, clienteParte: 0, cpa: 0, lucro: 0 },
  );

  const tiles = [
    { label: "Lucro (12 meses)", value: totals.lucro, tone: totals.lucro >= 0 ? "good" : "bad" },
    { label: "Investido (depósito)", value: totals.deposito, tone: "neutral" },
    { label: "Dado ao cliente", value: totals.clienteParte, tone: "neutral" },
    { label: "CPA recebido", value: totals.cpa, tone: "neutral" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-300 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.5)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
            <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Estatísticas
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Últimos 12 meses
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Método + Delay combinados
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <TiltCard key={tile.label} maxTilt={6}>
            <Card>
              <p className="text-sm text-neutral-400">{tile.label}</p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  tile.tone === "good"
                    ? "text-emerald-400"
                    : tile.tone === "bad"
                      ? "text-red-400"
                      : "text-neutral-100"
                }`}
              >
                {formatBRL(tile.value)}
              </p>
            </Card>
          </TiltCard>
        ))}
      </div>

      <Card>
        <h2 className="mb-1 text-lg font-semibold text-neutral-100">Lucro por mês</h2>
        <p className="mb-4 text-sm text-neutral-400">Verde quando ganhou, vermelho quando perdeu no mês.</p>
        <LucroChart data={months.map((m) => ({ key: m.key, label: m.label, value: m.lucro }))} />
      </Card>

      <Card>
        <h2 className="mb-1 text-lg font-semibold text-neutral-100">Depósito, parte do cliente e lucro</h2>
        <p className="mb-4 text-sm text-neutral-400">
          Quanto entrou (depósito), quanto foi pro cliente e quanto sobrou de lucro, por mês.
        </p>
        <ComparativoChart
          data={months.map((m) => ({
            key: m.key,
            label: m.label,
            deposito: m.deposito,
            clienteParte: m.clienteParte,
            lucro: m.lucro,
          }))}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-neutral-100">Tabela mensal</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-neutral-400">
                <th className="py-2 pr-3 font-medium">Mês</th>
                <th className="py-2 pr-3 font-medium">Depósito</th>
                <th className="py-2 pr-3 font-medium">Parte do cliente</th>
                <th className="py-2 pr-3 font-medium">CPA</th>
                <th className="py-2 pr-3 font-medium">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.key} className="border-b border-neutral-900 text-neutral-200">
                  <td className="py-2 pr-3">{m.label}</td>
                  <td className="py-2 pr-3 text-neutral-400">{formatBRL(m.deposito)}</td>
                  <td className="py-2 pr-3 text-neutral-400">{formatBRL(m.clienteParte)}</td>
                  <td className="py-2 pr-3 text-neutral-400">{formatBRL(m.cpa)}</td>
                  <td className={`py-2 pr-3 font-medium ${m.lucro >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {formatBRL(m.lucro)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
