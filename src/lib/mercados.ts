import type { DelayEntry, ErroEntry } from "@/lib/database.types";

/** Mercados esportivos: mesma estrutura de lançamento, tabelas separadas. */
export type Mercado = "delay" | "erro";

/** Delay e erro têm colunas idênticas — o tipo serve para os dois. */
export type MarketEntry = DelayEntry | ErroEntry;

export const MERCADOS: Record<Mercado, { label: string; lancamentosDe: string }> = {
  delay: { label: "Delay Esportivo", lancamentosDe: "de delay esportivo" },
  // "Lançamentos de mercado de erro" ficaria com dois "de" seguidos, por isso o
  // trecho da listagem vem escrito por extenso em vez de derivado do label.
  erro: { label: "Mercado de Erro", lancamentosDe: "do mercado de erro" },
};

/** Abas do dashboard: o método mais um mercado esportivo por aba. */
export type Aba = "metodo" | Mercado;

export function parseAba(value: string | undefined): Aba {
  if (value === "delay" || value === "erro") return value;
  return "metodo";
}
