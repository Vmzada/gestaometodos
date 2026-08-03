"use client";

import { useRef, useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatBRL } from "@/lib/date-helpers";
import { updateBanca } from "@/app/(dashboard)/dashboard/goals-actions";

const STEP = 50;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 .6 12.2A2 2 0 0 0 8.6 21h6.8a2 2 0 0 0 2-1.8L18 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`h-2.5 w-2.5 ${direction === "down" ? "rotate-180" : ""}`}
    >
      <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BancaCard({
  bancaInicial,
  lucroMes,
  mesLabel,
}: {
  bancaInicial: number | null;
  lucroMes: number;
  mesLabel: string;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function nudge(delta: number) {
    const el = inputRef.current;
    if (!el) return;
    el.value = String(Math.max(0, Number(el.value || 0) + delta));
  }

  function handleSave(formData: FormData) {
    startTransition(async () => {
      try {
        await updateBanca(formData);
        setError(null);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao salvar banca.");
      }
    });
  }

  function handleDelete() {
    const formData = new FormData();
    formData.set("banca_inicial", "");
    startTransition(async () => {
      try {
        await updateBanca(formData);
        setError(null);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao excluir banca.");
      }
    });
  }

  if (editing) {
    return (
      <TiltCard maxTilt={4}>
        <Card>
          <p className="text-sm text-neutral-400">Banca de {mesLabel}</p>
          <form action={handleSave} className="mt-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center overflow-hidden rounded-md border border-white/10 bg-neutral-800/80 transition-colors focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30">
                <span className="pl-2 text-xs font-medium text-neutral-500">R$</span>
                <input
                  ref={inputRef}
                  type="number"
                  name="banca_inicial"
                  step="0.01"
                  min="0"
                  defaultValue={bancaInicial ?? ""}
                  placeholder="0"
                  autoFocus
                  className="w-24 bg-transparent py-1.5 pl-1 pr-1 text-sm text-neutral-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="flex flex-col border-l border-white/10">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => nudge(STEP)}
                    aria-label="Aumentar"
                    className="flex h-4 w-5 items-center justify-center text-neutral-500 hover:bg-white/5 hover:text-emerald-400"
                  >
                    <ChevronIcon direction="up" />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => nudge(-STEP)}
                    aria-label="Diminuir"
                    className="flex h-4 w-5 items-center justify-center border-t border-white/10 text-neutral-500 hover:bg-white/5 hover:text-emerald-400"
                  >
                    <ChevronIcon direction="down" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                aria-label="Salvar"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
              >
                <CheckIcon />
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={pending}
                aria-label="Cancelar"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-200 disabled:opacity-50"
              >
                <CloseIcon />
              </button>
              {bancaInicial !== null && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  aria-label="Excluir banca"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </form>
        </Card>
      </TiltCard>
    );
  }

  if (bancaInicial === null || bancaInicial <= 0) {
    return (
      <TiltCard maxTilt={4}>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Banca de {mesLabel}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Separe um valor só pra métodos e delay, sem misturar com outra renda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            + Definir banca
          </button>
        </Card>
      </TiltCard>
    );
  }

  const saldoAtual = bancaInicial + lucroMes;
  const growthPct = (lucroMes / bancaInicial) * 100;
  const positive = lucroMes >= 0;

  return (
    <TiltCard maxTilt={4}>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-400">Banca de {mesLabel}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-neutral-100">{formatBRL(saldoAtual)}</p>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  positive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                }`}
              >
                {positive ? "+" : ""}
                {growthPct.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Capital inicial: {formatBRL(bancaInicial)} · saldo atual (capital + lucro do mês)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs text-neutral-600 hover:text-neutral-400"
          >
            editar
          </button>
        </div>
      </Card>
    </TiltCard>
  );
}
