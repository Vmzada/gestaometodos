export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value === 0 ? 0 : value); // normalizes -0 so it doesn't render as "-R$ 0,00"
}

export function daysUntil(isoDateTime: string) {
  const target = new Date(isoDateTime);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// America/Sao_Paulo has been a fixed UTC-3 year-round since Brazil abolished
// DST in 2019. The app only serves Brazilian customers, but this code runs
// on a server whose own clock is UTC (Vercel) — so "today" must be pinned to
// this fixed offset rather than derived from the runtime's local timezone
// (Date#getTimezoneOffset()), which silently returns 0 on the server and
// made "hoje" fall out of sync with the calendar date near/after 21h BRT.
const BRAZIL_OFFSET_MS = 3 * 60 * 60 * 1000;

/** "Now", shifted so its UTC getters reflect Brazil's wall-clock date/time —
 *  correct regardless of the runtime's own timezone. */
export function nowInBrazil() {
  return new Date(Date.now() - BRAZIL_OFFSET_MS);
}

/** Formats a Date's UTC calendar fields as YYYY-MM-DD. Only pass dates built
 *  with UTC semantics in mind (nowInBrazil(), Date.UTC(...)). */
export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayISO() {
  return toISODate(nowInBrazil());
}

/** Monday–Sunday range containing `date` (UTC semantics), as ISO date strings. */
export function getWeekRange(date: Date) {
  const day = date.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setUTCDate(date.getUTCDate() + diffToMonday);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start: toISODate(start), end: toISODate(end) };
}

export function getMonthRange(date: Date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  return { start: toISODate(start), end: toISODate(end) };
}

export const MESES_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const DIAS_SEMANA_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Grid of days (including leading/trailing days from adjacent months) for a month calendar view. */
export function getCalendarGrid(year: number, month: number) {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const startOffset = firstOfMonth.getUTCDay();
  const gridStart = new Date(Date.UTC(year, month, 1 - startOffset));

  const days: { date: Date; iso: string; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setUTCDate(gridStart.getUTCDate() + i);
    days.push({ date: d, iso: toISODate(d), inMonth: d.getUTCMonth() === month });
  }
  return days;
}
