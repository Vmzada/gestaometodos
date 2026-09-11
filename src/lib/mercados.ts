import type { DelayEntry, ErroEntry } from "@/lib/database.types";

/**
 * Mercados esportivos: giram em torno de odd, valor e green/red, e por isso
 * dividem o mesmo formulário e a mesma tabela de listagem.
 */
export type Mercado = "delay" | "erro";

/** Delay e erro têm colunas idênticas — o tipo serve para os dois. */
export type MarketEntry = DelayEntry | ErroEntry;

export const MERCADOS: Record<Mercado, { label: string; lancamentosDe: string }> = {
  delay: { label: "Delay Esportivo", lancamentosDe: "de delay esportivo" },
  // "Lançamentos de mercado de erro" ficaria com dois "de" seguidos, por isso o
  // trecho da listagem vem escrito por extenso em vez de derivado do label.
  erro: { label: "Mercado de Erro", lancamentosDe: "do mercado de erro" },
};

export function isMercado(value: string | undefined): value is Mercado {
  return value === "delay" || value === "erro";
}

/**
 * Abas do dashboard. Métodos e rodadas grátis têm campos próprios e ficam de
 * fora de MERCADOS; só delay e erro compartilham a estrutura de odd.
 */
export type Aba = "metodo" | "rodadas" | Mercado;

export const ABAS: { aba: Aba; label: string; lancamentosDe: string }[] = [
  { aba: "metodo", label: "Métodos", lancamentosDe: "" },
  { aba: "rodadas", label: "Rodadas Grátis", lancamentosDe: "de rodadas grátis" },
  { aba: "delay", label: MERCADOS.delay.label, lancamentosDe: MERCADOS.delay.lancamentosDe },
  { aba: "erro", label: MERCADOS.erro.label, lancamentosDe: MERCADOS.erro.lancamentosDe },
];

export const RODADAS_LABEL = "Rodadas Grátis";

export function parseAba(value: string | undefined): Aba {
  if (value === "delay" || value === "erro" || value === "rodadas") return value;
  return "metodo";
}

export function abaHref(aba: Aba) {
  return aba === "metodo" ? "/dashboard" : `/dashboard?aba=${aba}`;
}
