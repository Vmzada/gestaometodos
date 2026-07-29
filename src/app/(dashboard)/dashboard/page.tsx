import { createClient } from "@/lib/supabase/server";
import { EntryForm } from "@/components/entry-form";
import { EntriesTable } from "@/components/entries-table";
import { DelayEntryForm } from "@/components/delay-entry-form";
import { DelayEntriesTable } from "@/components/delay-entries-table";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { SummaryCards } from "@/components/summary-cards";
import { Card } from "@/components/ui/card";
import { getMonthRange, getWeekRange, MESES_PT, nowInBrazil, todayISO } from "@/lib/date-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";

function sum(rows: { lucro: number }[] | null) {
  return (rows ?? []).reduce((total, row) => total + Number(row.lucro), 0);
}

function monthParam(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; aba?: string; mes?: string }>;
}) {
  const { data: selectedDate, aba, mes: mesParam } = await searchParams;
  const isDelay = aba === "delay";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = nowInBrazil();
  const today = todayISO();
  const week = getWeekRange(now);

  const parsedMes = mesParam ? mesParam.split("-").map(Number) : null;
  const [selYear, selMonth] =
    parsedMes && !parsedMes.some(Number.isNaN) && parsedMes[1] >= 1 && parsedMes[1] <= 12
      ? parsedMes
      : [now.getUTCFullYear(), now.getUTCMonth() + 1];
  const selectedMonthDate = new Date(Date.UTC(selYear, selMonth - 1, 1));
  const month = getMonthRange(selectedMonthDate);
  const isCurrentMonth =
    selYear === now.getUTCFullYear() && selMonth - 1 === now.getUTCMonth();
  const mesLabel = `${MESES_PT[selMonth - 1]} de ${selYear}`;
  const mesPrevHref = `/dashboard?mes=${monthParam(new Date(Date.UTC(selYear, selMonth - 2, 1)))}`;
  const mesNextHref = `/dashboard?mes=${monthParam(new Date(Date.UTC(selYear, selMonth, 1)))}`;

  const listQuery = selectedDate
    ? supabase.from("entries").select("*").eq("user_id", user!.id).eq("entry_date", selectedDate)
    : supabase
        .from("entries")
        .select("*")
        .eq("user_id", user!.id)
        .gte("entry_date", month.start)
        .lte("entry_date", month.end)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: false });

  const delayListQuery = supabase
    .from("delay_entries")
    .select("*")
    .eq("user_id", user!.id)
    .gte("entry_date", month.start)
    .lte("entry_date", month.end)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  const [
    hojeRes,
    semanaRes,
    mesRes,
    delayHojeRes,
    delaySemanaRes,
    delayMesRes,
    listRes,
    delayListRes,
  ] = await Promise.all([
    supabase.from("entries").select("lucro").eq("user_id", user!.id).eq("entry_date", today),
    supabase
      .from("entries")
      .select("lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", week.start)
      .lte("entry_date", week.end),
    supabase
      .from("entries")
      .select("lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", month.start)
      .lte("entry_date", month.end),
    supabase
      .from("delay_entries")
      .select("lucro")
      .eq("user_id", user!.id)
      .eq("entry_date", today),
    supabase
      .from("delay_entries")
      .select("lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", week.start)
      .lte("entry_date", week.end),
    supabase
      .from("delay_entries")
      .select("lucro")
      .eq("user_id", user!.id)
      .gte("entry_date", month.start)
      .lte("entry_date", month.end),
    isDelay ? Promise.resolve({ data: [] }) : listQuery,
    isDelay ? delayListQuery : Promise.resolve({ data: [] }),
  ]);

  const hoje = sum(hojeRes.data) + sum(delayHojeRes.data);
  const semana = sum(semanaRes.data) + sum(delaySemanaRes.data);
  const mes = sum(mesRes.data) + sum(delayMesRes.data);

  return (
    <div className="space-y-8">
      <SummaryCards
        hoje={hoje}
        semana={semana}
        mes={mes}
        mesLabel={mesLabel}
        mesPrevHref={mesPrevHref}
        mesNextHref={mesNextHref}
        mesIsCurrent={isCurrentMonth}
      />

      <DashboardTabs active={isDelay ? "delay" : "metodo"} />

      {isDelay ? (
        <>
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Novo lançamento (Delay)</h2>
            <DelayEntryForm />
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-100">
                Lançamentos de delay de {mesLabel}
              </h2>
              {!isCurrentMonth && (
                <Link href="/dashboard?aba=delay" className="text-sm text-emerald-400 hover:underline">
                  Ver mês atual
                </Link>
              )}
            </div>
            <DelayEntriesTable entries={delayListRes.data ?? []} />
          </Card>
        </>
      ) : (
        <>
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Novo lançamento</h2>
            <EntryForm />
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-100">
                {selectedDate
                  ? `Lançamentos de ${formatDate(selectedDate)}`
                  : `Lançamentos de ${mesLabel}`}
              </h2>
              {(selectedDate || !isCurrentMonth) && (
                <Link href="/dashboard" className="text-sm text-emerald-400 hover:underline">
                  Ver mês atual
                </Link>
              )}
            </div>
            <EntriesTable entries={listRes.data ?? []} />
          </Card>
        </>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
