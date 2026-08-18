import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { GastoForm } from "@/components/gasto-form";
import { GastosTable } from "@/components/gastos-table";
import { formatBRL, getMonthRange, MESES_PT, nowInBrazil } from "@/lib/date-helpers";

export const dynamic = "force-dynamic";

function monthParam(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default async function GastosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes: mesParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = nowInBrazil();
  const parsedMes = mesParam ? mesParam.split("-").map(Number) : null;
  const [selYear, selMonth] =
    parsedMes && !parsedMes.some(Number.isNaN) && parsedMes[1] >= 1 && parsedMes[1] <= 12
      ? parsedMes
      : [now.getUTCFullYear(), now.getUTCMonth() + 1];
  const selectedMonthDate = new Date(Date.UTC(selYear, selMonth - 1, 1));
  const month = getMonthRange(selectedMonthDate);
  const isCurrentMonth = selYear === now.getUTCFullYear() && selMonth - 1 === now.getUTCMonth();
  const mesLabel = `${MESES_PT[selMonth - 1]} de ${selYear}`;
  const mesPrevHref = `/dashboard/gastos?mes=${monthParam(new Date(Date.UTC(selYear, selMonth - 2, 1)))}`;
  const mesNextHref = `/dashboard/gastos?mes=${monthParam(new Date(Date.UTC(selYear, selMonth, 1)))}`;

  const { data: gastos } = await supabase
    .from("gastos")
    .select("*")
    .eq("user_id", user!.id)
    .gte("gasto_date", month.start)
    .lte("gasto_date", month.end)
    .order("gasto_date", { ascending: false })
    .order("created_at", { ascending: false });

  const total = (gastos ?? []).reduce((sum, g) => sum + Number(g.valor), 0);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-neutral-100">Novo gasto</h2>
        <GastoForm />
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={mesPrevHref}
              className="rounded-md border border-white/10 px-2 py-1 text-sm text-neutral-300 hover:bg-white/5"
            >
              ←
            </Link>
            <h2 className="text-lg font-semibold text-neutral-100">Gastos de {mesLabel}</h2>
            <Link
              href={mesNextHref}
              className="rounded-md border border-white/10 px-2 py-1 text-sm text-neutral-300 hover:bg-white/5"
            >
              →
            </Link>
            {!isCurrentMonth && (
              <Link href="/dashboard/gastos" className="text-sm text-emerald-400 hover:underline">
                Ver mês atual
              </Link>
            )}
          </div>
          <p className="text-sm text-neutral-400">
            Total do mês: <span className="font-medium text-red-400">{formatBRL(total)}</span>
          </p>
        </div>
        <GastosTable key={mesParam ?? "current"} gastos={gastos ?? []} />
      </Card>
    </div>
  );
}
