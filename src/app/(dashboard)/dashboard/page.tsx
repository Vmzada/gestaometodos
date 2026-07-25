import { createClient } from "@/lib/supabase/server";
import { EntryForm } from "@/components/entry-form";
import { EntriesTable } from "@/components/entries-table";
import { DelayEntryForm } from "@/components/delay-entry-form";
import { DelayEntriesTable } from "@/components/delay-entries-table";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { SummaryCards } from "@/components/summary-cards";
import { Card } from "@/components/ui/card";
import { getMonthRange, getWeekRange, todayISO } from "@/lib/date-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";

function sum(rows: { lucro: number }[] | null) {
  return (rows ?? []).reduce((total, row) => total + Number(row.lucro), 0);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; aba?: string }>;
}) {
  const { data: selectedDate, aba } = await searchParams;
  const isDelay = aba === "delay";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = todayISO();
  const week = getWeekRange(new Date());
  const month = getMonthRange(new Date());

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
      <SummaryCards hoje={hoje} semana={semana} mes={mes} />

      <DashboardTabs active={isDelay ? "delay" : "metodo"} />

      {isDelay ? (
        <>
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">Novo lançamento (Delay)</h2>
            <DelayEntryForm />
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-neutral-100">
              Lançamentos de delay deste mês
            </h2>
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
                  : "Lançamentos deste mês"}
              </h2>
              {selectedDate && (
                <Link href="/dashboard" className="text-sm text-emerald-400 hover:underline">
                  Ver mês inteiro
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
