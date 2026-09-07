"use client";

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/date-helpers";
import { calcularDutching, parseNumero } from "@/lib/dutching";

type Perna = { id: number; odd: string };

let nextId = 3;

function novoId() {
  return nextId++;
}

function copyKey(id: string | number) {
  return `stake-${id}`;
}

/**
 * Máscara de odd: os dígitos entram da direita pra esquerda e o ponto decimal
 * se ajusta sozinho, como num campo de dinheiro — digitar "250" vira "2.50"
 * sem precisar apertar o ponto. Backspace some com o último dígito.
 */
function maskOdd(raw: string): string {
  const digitos = raw.replace(/\D/g, "");
  if (!digitos) return "";
  return (Number(digitos) / 100).toFixed(2);
}

// --- ícones (mesmo estilo inline usado no resto do app) -------------------

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="9" y="9" width="11" height="11" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path
        d="M4 7h16M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m-8 0l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path
        d="M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0 0 14.5 3.5M19.5 9A8 8 0 0 0 5 5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Calculadora de dutching / surebet: distribui um valor entre as seleções de
 * um mesmo evento para igualar o retorno. Roda inteira no navegador — não lê
 * nem grava nada no banco.
 */
export function DutchingCalculator() {
  const [pernas, setPernas] = useState<Perna[]>([
    { id: 1, odd: "" },
    { id: 2, odd: "" },
  ]);
  const [totalStr, setTotalStr] = useState("100");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const total = parseNumero(totalStr);
  const odds = pernas.map((p) => parseNumero(p.odd));

  const resultado = useMemo(() => {
    if (odds.some(Number.isNaN) || !Number.isFinite(total) || total <= 0) return null;
    return calcularDutching({ odds, total });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pernas, total]);

  function addLinha() {
    setPernas((prev) => [...prev, { id: novoId(), odd: "" }]);
  }

  function removeLinha(id: number) {
    setPernas((prev) => (prev.length > 2 ? prev.filter((p) => p.id !== id) : prev));
  }

  function updateOdd(id: number, odd: string) {
    setPernas((prev) => prev.map((p) => (p.id === id ? { ...p, odd } : p)));
  }

  function reiniciar() {
    setPernas([
      { id: novoId(), odd: "" },
      { id: novoId(), odd: "" },
    ]);
    setTotalStr("100");
  }

  function copiar(texto: string, key: string) {
    navigator.clipboard
      ?.writeText(texto)
      .then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1200);
      })
      .catch(() => {});
  }

  const lucro = resultado?.lucroMin ?? 0;
  const retorno = resultado?.pernas[0]?.retorno ?? 0;
  const roiPct = (resultado?.roi ?? 0) * 100;

  return (
    <div className="space-y-5">
      {/* Stake total */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold tracking-wide text-neutral-400">STAKE</span>
          {resultado && (
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                resultado.isSurebet
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              {resultado.isSurebet ? "Surebet" : "Sem margem"}
            </span>
          )}
        </div>

        <div className="relative flex items-center justify-center rounded-lg border border-white/10 bg-neutral-950/60 px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-emerald-400">R$</span>
            <input
              inputMode="decimal"
              value={totalStr}
              onChange={(e) => setTotalStr(e.target.value)}
              size={Math.max(totalStr.length, 3)}
              className="bg-transparent text-center text-2xl font-bold text-neutral-100 outline-none"
              aria-label="Valor total (R$)"
            />
          </div>
          <button
            type="button"
            onClick={() => copiar(formatBRL(total || 0), "total")}
            className="absolute right-4 text-neutral-500 transition-colors hover:text-neutral-200"
            aria-label="Copiar valor total"
          >
            {copiedKey === "total" ? <IconCheck /> : <IconCopy />}
          </button>
        </div>
      </div>

      {/* Tabela de seleções */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold tracking-wide text-neutral-500">
              <th className="w-10 py-2 font-semibold">#</th>
              <th className="py-2 font-semibold">ODDS</th>
              <th className="py-2 font-semibold">STAKE</th>
              <th className="py-2 font-semibold">%</th>
              <th className="w-10 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {pernas.map((perna, i) => {
              const stake = resultado?.pernas[i]?.stake ?? 0;
              const pct =
                resultado && resultado.total > 0 ? (stake / resultado.total) * 100 : null;
              return (
                <tr key={perna.id} className="border-t border-white/5">
                  <td className="py-2 text-neutral-500">{i + 1}</td>
                  <td className="py-2 pr-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0.00"
                      value={perna.odd}
                      onChange={(e) => updateOdd(perna.id, maskOdd(e.target.value))}
                      className="w-24 rounded-md border border-white/10 bg-neutral-950/60 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:border-emerald-400/60"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-emerald-400">{formatBRL(stake)}</span>
                      <button
                        type="button"
                        onClick={() => copiar(formatBRL(stake), copyKey(perna.id))}
                        className="text-neutral-500 transition-colors hover:text-neutral-200"
                        aria-label="Copiar stake"
                      >
                        {copiedKey === copyKey(perna.id) ? <IconCheck /> : <IconCopy />}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-neutral-400">
                    {pct === null ? "-" : `${pct.toFixed(1)}%`}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeLinha(perna.id)}
                      disabled={pernas.length <= 2}
                      className="text-neutral-500 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-neutral-500"
                      aria-label="Remover seleção"
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={addLinha}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-500 py-2 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5"
        >
          <IconPlus />
          Adicionar linha
        </button>
        <button
          type="button"
          onClick={reiniciar}
          className="flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-neutral-900/60 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-white/20 hover:text-neutral-100"
        >
          <IconRefresh />
          Reiniciar
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-3 text-center">
          <p className="text-xs font-medium tracking-wide text-neutral-500">LUCRO</p>
          <p className={`mt-1 text-lg font-bold ${lucro >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatBRL(lucro)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-3 text-center">
          <p className="text-xs font-medium tracking-wide text-neutral-500">RETORNO</p>
          <p className="mt-1 text-lg font-bold text-neutral-100">{formatBRL(retorno)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-3 text-center">
          <p className="text-xs font-medium tracking-wide text-neutral-500">ROI</p>
          <p
            className={`mt-1 text-lg font-bold ${roiPct >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {roiPct >= 0 ? "+" : ""}
            {roiPct.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
