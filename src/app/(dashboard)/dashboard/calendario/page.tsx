import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import {
  DIAS_SEMANA_PT,
  MESES_PT,
  formatBRL,
  getCalendarGrid,
  nowInBrazil,
  todayISO,
  toISODate,
} from "@/lib/date-helpers";

export const dynamic = "force-dynamic";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string; mes?: string }>;
}) {
  const params = await searchParams;
  const now = nowInBrazil();
  const year = Number(params.ano) || now.getUTCFullYear();
  const month = params.mes ? Number(params.mes) - 1 : now.getUTCMonth();
  const today = todayISO();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const grid = getCalendarGrid(year, month);
  const rangeStart = toISODate(grid[0].date);
  const rangeEnd = toISODate(grid[grid.length - 1].date);

  const { data: entries } = await supabase
    .from("entries")
    .select("entry_date, lucro")
    .eq("user_id", user!.id)
    .gte("entry_date", rangeStart)
    .lte("entry_date", rangeEnd);

  const totalsByDay = new Map<string, number>();
  for (const entry of entries ?? []) {
    totalsByDay.set(entry.entry_date, (totalsByDay.get(entry.entry_date) ?? 0) + Number(entry.lucro));
  }

  const prev = { year: month === 0 ? year - 1 : year, month: month === 0 ? 12 : month };
  const next = { year: month === 11 ? year + 1 : year, month: month === 11 ? 1 : month + 2 };

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link
          href={`/dashboard/calendario?ano=${prev.year}&mes=${prev.month}`}
          className="shrink-0 rounded-md border border-white/10 px-2.5 py-1.5 text-sm text-neutral-400 transition-colors hover:border-emerald-500/40 hover:text-neutral-100 sm:px-3"
        >
          <span aria-hidden>←</span>
          <span className="hidden sm:inline"> Anterior</span>
        </Link>
        <h1 className="truncate text-center text-base font-semibold text-neutral-100 sm:text-lg">
          {MESES_PT[month]} de {year}
        </h1>
        <Link
          href={`/dashboard/calendario?ano=${next.year}&mes=${next.month}`}
          className="shrink-0 rounded-md border border-white/10 px-2.5 py-1.5 text-sm text-neutral-400 transition-colors hover:border-emerald-500/40 hover:text-neutral-100 sm:px-3"
        >
          <span className="hidden sm:inline">Próximo </span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-neutral-500">
        {DIAS_SEMANA_PT.map((dia) => (
          <div key={dia} className="pb-2">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {grid.map(({ iso, date, inMonth }) => {
          const total = totalsByDay.get(iso);
          const isToday = iso === today;
          return (
            <Link
              key={iso}
              href={`/dashboard?data=${iso}`}
              className={`flex min-h-14 flex-col rounded-md border p-1.5 text-left transition-all duration-150 hover:z-10 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-[0_8px_24px_-8px_rgba(16,185,129,0.5)] sm:min-h-20 sm:p-2 ${
                isToday ? "border-emerald-500/60 bg-emerald-500/5" : "border-neutral-800"
              } ${inMonth ? "bg-neutral-900/60" : "bg-transparent opacity-40"}`}
            >
              <span className={`text-xs ${isToday ? "font-semibold text-emerald-400" : "text-neutral-400"}`}>
                {date.getUTCDate()}
              </span>
              {total !== undefined && (
                <span
                  className={`mt-auto text-xs font-medium ${
                    total >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatBRL(total)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
