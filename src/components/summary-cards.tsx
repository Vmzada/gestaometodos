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
      aria-label={hidden ? "Mostrar valor" : "Ocultar valor"}
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
}) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setHidden((h) => ({ ...h, [key]: !h[key] }));

  return (
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
                className={`mt-1 text-2xl font-semibold ${hoje >= 0 ? "text-emerald-400" : "text-red-400"} ${
                  hidden.hoje ? "select-none blur-sm" : ""
                }`}
              >
                {formatBRL(hoje)}
              </p>
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
                className={`mt-1 text-2xl font-semibold ${semana >= 0 ? "text-emerald-400" : "text-red-400"} ${
                  hidden.semana ? "select-none blur-sm" : ""
                }`}
              >
                {formatBRL(semana)}
              </p>
            </div>
            <span className="text-2xl opacity-70">📅</span>
          </div>
          <GoalProgress
            current={semana}
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
                className={`mt-1 text-2xl font-semibold ${mes >= 0 ? "text-emerald-400" : "text-red-400"} ${
                  hidden.mes ? "select-none blur-sm" : ""
                }`}
              >
                {formatBRL(mes)}
              </p>
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
              current={mes}
              goal={metaMensal}
              fieldName="meta_mensal"
              otherFieldName="meta_semanal"
              otherValue={metaSemanal}
            />
          )}
        </Card>
      </TiltCard>
    </div>
  );
}
