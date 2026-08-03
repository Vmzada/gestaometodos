"use client";

import { useRef, useState, useTransition } from "react";
import { formatBRL } from "@/lib/date-helpers";
import { updateGoals } from "@/app/(dashboard)/dashboard/goals-actions";

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

export function GoalProgress({
  current,
  goal,
  fieldName,
  otherFieldName,
  otherValue,
}: {
  current: number;
  goal: number | null;
  fieldName: "meta_semanal" | "meta_mensal";
  otherFieldName: "meta_semanal" | "meta_mensal";
  otherValue: number | null;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function nudge(delta: number) {
    const el = inputRef.current;
    if (!el) return;
    const next = Math.max(0, Number(el.value || 0) + delta);
    el.value = String(next);
  }

  function handleSave(formData: FormData) {
    formData.set(otherFieldName, otherValue != null ? String(otherValue) : "");
    startTransition(async () => {
      try {
        await updateGoals(formData);
        setError(null);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao salvar meta.");
      }
    });
  }

  function handleDelete() {
    const formData = new FormData();
    formData.set(fieldName, "");
    formData.set(otherFieldName, otherValue != null ? String(otherValue) : "");
    startTransition(async () => {
      try {
        await updateGoals(formData);
        setError(null);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao excluir meta.");
      }
    });
  }

  if (editing) {
    return (
      <form action={handleSave} className="mt-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center overflow-hidden rounded-md border border-white/10 bg-neutral-800/80 transition-colors focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30">
            <span className="pl-2 text-xs font-medium text-neutral-500">R$</span>
            <input
              ref={inputRef}
              type="number"
              name={fieldName}
              step="0.01"
              min="0"
              defaultValue={goal ?? ""}
              placeholder="0"
              autoFocus
              className="w-16 bg-transparent py-1 pl-1 pr-1 text-xs text-neutral-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="flex flex-col border-l border-white/10">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => nudge(STEP)}
                aria-label="Aumentar"
                className="flex h-3.5 w-5 items-center justify-center text-neutral-500 hover:bg-white/5 hover:text-emerald-400"
              >
                <ChevronIcon direction="up" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => nudge(-STEP)}
                aria-label="Diminuir"
                className="flex h-3.5 w-5 items-center justify-center border-t border-white/10 text-neutral-500 hover:bg-white/5 hover:text-emerald-400"
              >
                <ChevronIcon direction="down" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            aria-label="Salvar"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
          >
            <CheckIcon />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={pending}
            aria-label="Cancelar"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-200 disabled:opacity-50"
          >
            <CloseIcon />
          </button>
          {goal !== null && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              aria-label="Excluir meta"
              className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </form>
    );
  }

  if (goal === null || goal <= 0) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-2 text-xs font-medium text-emerald-400/80 transition-colors hover:text-emerald-400 hover:underline"
      >
        + Definir meta
      </button>
    );
  }

  const pct = Math.min(100, Math.max(0, (current / goal) * 100));
  const reached = current >= goal;
  const remaining = goal - current;

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-300 ${reached ? "bg-emerald-400" : "bg-emerald-500/70"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-neutral-500">
          {reached
            ? `🎉 Meta de ${formatBRL(goal)} batida!`
            : `Faltam ${formatBRL(remaining)} da meta de ${formatBRL(goal)}`}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-xs text-neutral-600 hover:text-neutral-400"
        >
          editar
        </button>
      </div>
    </div>
  );
}
