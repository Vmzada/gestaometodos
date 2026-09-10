"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { GoalProgress } from "@/components/goal-progress";
import { formatBRL } from "@/lib/date-helpers";

function EyeToggle({ hidden, onClick }: { hidden: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hidden ? "Mostrar detalhes" : "Ocultar detalhes"}
      title={hidden ? "Mostrar detalhes" : "Ocultar detalhes"}
      className="text-neutral-500 transition-colors hover:text-neutral-300"
    >
      {hidden ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
          <path d="M3 3l18 18" strokeLinecap="round" />
          <path
            d="M10.6 10.6a3 3 0 0 0 4.24 4.24M9.75 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-3.09 3.9M6.2 6.2C4.04 7.54 2 12 2 12a13.4 13.4 0 0 0 4.1 4.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

/**
 * Mostra de onde veio o número: ganhos, reds e gastos do período. Os três
 * aparecem sempre que existirem — o alternador decide só se os gastos saem do
 * número grande, não se aparecem aqui. Reds já estão embutidos no total (o
 * lucro de um red é gravado negativo), então nunca são descontados de novo.
 */
function Detalhe({
  ganhos,
  reds,
  gastos,
}: {
  ganhos: number;
  reds: number;
  gastos: number;
}) {
  const temReds = reds < 0;
  const temGastos = gastos > 0;
  if (!temReds && !temGastos) return null;

  return (
    <div className="mt-1.5 space-y-0.5 text-xs">
      {temReds && (
        <>
          <p className="text-neutral-500">
            Ganhos <span className="text-neutral-300">{formatBRL(ganhos)}</span>
          </p>
          <p className="text-neutral-500">
            Reds <span className="text-red-400">{formatBRL(reds)}</span>
          </p>
        </>
      )}
      {temGastos && (
        <p className="text-neutral-500">
          Gastos <span className="text-red-400">−{formatBRL(gastos)}</span>
        </p>
      )}
    </div>
  );
}

export function SummaryCards({
  hoje,
  semana,
  mes,
  mesLabel,
  mesPrevHref,
  mesNextHref,
  mesIsCurrent = true,
  metaSemanal = null,
  metaMensal = null,
  gastosHoje = 0,
  gastosSemana = 0,
  gastosMes = 0,
  ganhosHoje = 0,
  redsHoje = 0,
  ganhosSemana = 0,
  redsSemana = 0,
  ganhosMes = 0,
  redsMes = 0,
}: {
  hoje: number;
  semana: number;
  mes: number;
  mesLabel?: string;
  mesPrevHref?: string;
  mesNextHref?: string;
  mesIsCurrent?: boolean;
  metaSemanal?: number | null;
  metaMensal?: number | null;
  gastosHoje?: number;
  gastosSemana?: number;
  gastosMes?: number;
  /** Soma só dos lançamentos positivos do período. */
  ganhosHoje?: number;
  /** Soma dos reds — já vem negativa e já está dentro do total. */
  redsHoje?: number;
  ganhosSemana?: number;
  redsSemana?: number;
  ganhosMes?: number;
  redsMes?: number;
}) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setHidden((h) => ({ ...h, [key]: !h[key] }));

  // Os lançamentos (métodos + delay esportivo + erro) somam o lucro bruto; os
  // gastos ficam numa tabela à parte e nunca entravam nesse número. O botão
  // troca entre os dois jeitos de ver, em vez de escolher um só.
  const [comGastos, setComGastos] = useState(false);

  const valorHoje = comGastos ? hoje - gastosHoje : hoje;
  const valorSemana = comGastos ? semana - gastosSemana : semana;
  const valorMes = comGastos ? mes - gastosMes : mes;
  const temGastos = gastosHoje > 0 || gastosSemana > 0 || gastosMes > 0;

  return (
    <div className="space-y-4">
      {temGastos && (
        <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-neutral-900/60 p-1 sm:inline-flex sm:w-auto">
          <button
            type="button"
            onClick={() => setComGastos(false)}
            className={`rounded-md px-3 py-1.5 text-center text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              comGastos
                ? "text-neutral-400 hover:text-neutral-100"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            Sem gastos
          </button>
          <button
            type="button"
            onClick={() => setComGastos(true)}
            className={`rounded-md px-3 py-1.5 text-center text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              comGastos
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            Com gastos
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <TiltCard maxTilt={6} className="h-full">
        <Card className="h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-neutral-400">Hoje</p>
                <EyeToggle hidden={!!hidden.hoje} onClick={() => toggle("hoje")} />
              </div>
              <p
                className={`mt-1 text-2xl font-semibold ${valorHoje >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {formatBRL(valorHoje)}
              </p>
              {!hidden.hoje && <Detalhe ganhos={ganhosHoje} reds={redsHoje} gastos={gastosHoje} />}
            </div>
            <span className="text-2xl opacity-70">☀️</span>
          </div>
        </Card>
      </TiltCard>

      <TiltCard maxTilt={6} className="h-full">
        <Card className="h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-neutral-400">Esta semana</p>
                <EyeToggle hidden={!!hidden.semana} onClick={() => toggle("semana")} />
              </div>
              <p
                className={`mt-1 text-2xl font-semibold ${valorSemana >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {formatBRL(valorSemana)}
              </p>
              {!hidden.semana && <Detalhe ganhos={ganhosSemana} reds={redsSemana} gastos={gastosSemana} />}
            </div>
            <span className="text-2xl opacity-70">📅</span>
          </div>
          <GoalProgress
            current={valorSemana}
            goal={metaSemanal}
            fieldName="meta_semanal"
            otherFieldName="meta_mensal"
            otherValue={metaMensal}
          />
        </Card>
      </TiltCard>

      <TiltCard maxTilt={6} className="h-full">
        <Card className="h-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-neutral-400">Este mês{mesLabel ? ` (${mesLabel})` : ""}</p>
                <EyeToggle hidden={!!hidden.mes} onClick={() => toggle("mes")} />
              </div>
              <p
                className={`mt-1 text-2xl font-semibold ${valorMes >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {formatBRL(valorMes)}
              </p>
              {!hidden.mes && <Detalhe ganhos={ganhosMes} reds={redsMes} gastos={gastosMes} />}
            </div>
            {mesPrevHref && mesNextHref ? (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1">
                  <Link
                    href={mesPrevHref}
                    aria-label="Mês anterior"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors hover:border-emerald-500/40 hover:text-neutral-100"
                  >
                    ‹
                  </Link>
                  <Link
                    href={mesNextHref}
                    aria-label="Próximo mês"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors hover:border-emerald-500/40 hover:text-neutral-100"
                  >
                    ›
                  </Link>
                </div>
                {!mesIsCurrent && (
                  <Link href="/dashboard" className="text-xs text-emerald-400 hover:underline">
                    Hoje
                  </Link>
                )}
              </div>
            ) : (
              <span className="text-2xl opacity-70">📈</span>
            )}
          </div>
          {mesIsCurrent && (
            <GoalProgress
              current={valorMes}
              goal={metaMensal}
              fieldName="meta_mensal"
              otherFieldName="meta_semanal"
              otherValue={metaSemanal}
            />
          )}
        </Card>
      </TiltCard>
      </div>
    </div>
  );
}
