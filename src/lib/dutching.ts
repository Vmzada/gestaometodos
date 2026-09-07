/**
 * Dutching / surebet: divide um valor entre as seleções de forma que o retorno
 * seja o mesmo ganhe qual ganhar.
 *
 *   stake_i  = total × (1/odd_i) ÷ Σ(1/odd_j)
 *   retorno  = total ÷ Σ(1/odd_j)
 *
 * Quando Σ(1/odd) < 1 as odds cobrem o evento com margem a favor do apostador:
 * é surebet, o retorno supera o investido em qualquer resultado. Acima de 1 o
 * cálculo continua valendo — só que empatando por baixo, no prejuízo.
 */

/** Aceita "2.50" e "2,50"; devolve NaN para o que não for número. */
export function parseNumero(valor: string): number {
  const limpo = valor.replace(",", ".").trim();
  if (!limpo) return NaN;
  return Number(limpo);
}

export type PernaCalculada = {
  odd: number;
  stake: number;
  retorno: number;
  /** Lucro se esta seleção vencer: retorno dela menos o total investido. */
  lucro: number;
};

export type ResultadoDutching = {
  pernas: PernaCalculada[];
  /** Σ(1/odd): abaixo de 1 é surebet. */
  somaImplicita: number;
  isSurebet: boolean;
  total: number;
  lucroMin: number;
  lucroMax: number;
  /** Sobre o pior cenário, para não prometer mais do que o garantido. */
  roi: number;
};

export type EntradaDutching = {
  odds: number[];
  total: number;
  /** Índice da perna com valor fixo (o total passa a ser derivado dela). */
  travada?: number | null;
  stakeTravada?: number;
  /** Múltiplo para arredondar as apostas (0 = sem arredondar). */
  arredondarPara?: number;
};

export function calcularDutching({
  odds,
  total,
  travada = null,
  stakeTravada = 0,
  arredondarPara = 0,
}: EntradaDutching): ResultadoDutching | null {
  // Odd 1.00 ou menor não paga nada e faria a divisão explodir.
  if (odds.length < 2 || odds.some((o) => !Number.isFinite(o) || o <= 1)) return null;

  const inversos = odds.map((odd) => 1 / odd);
  const somaImplicita = inversos.reduce((a, b) => a + b, 0);

  // Com uma perna travada, o total sai dela: stake = total × inv ÷ Σ, logo
  // total = stake × odd × Σ.
  const travaValida =
    travada !== null && travada >= 0 && travada < odds.length && stakeTravada > 0;
  const totalBase = travaValida
    ? stakeTravada * odds[travada!] * somaImplicita
    : total;

  if (!Number.isFinite(totalBase) || totalBase <= 0) return null;

  const stakes = inversos.map((inv, i) => {
    const exato = (totalBase * inv) / somaImplicita;
    // A perna travada é o valor que o usuário digitou — não se arredonda.
    if (travaValida && i === travada) return stakeTravada;
    if (arredondarPara > 0) return Math.round(exato / arredondarPara) * arredondarPara;
    return exato;
  });

  // Depois de arredondar, o total real é a soma do que de fato será apostado.
  const totalFinal = stakes.reduce((a, b) => a + b, 0);
  const pernas = stakes.map((stake, i) => {
    const retorno = stake * odds[i];
    return { odd: odds[i], stake, retorno, lucro: retorno - totalFinal };
  });

  const lucros = pernas.map((p) => p.lucro);
  const lucroMin = Math.min(...lucros);
  const lucroMax = Math.max(...lucros);

  return {
    pernas,
    somaImplicita,
    isSurebet: somaImplicita < 1,
    total: totalFinal,
    lucroMin,
    lucroMax,
    roi: totalFinal > 0 ? lucroMin / totalFinal : 0,
  };
}
