"use client";

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { DIAS_SEMANA_PT, MESES_PT, getCalendarGrid, todayISO } from "@/lib/date-helpers";

export interface DatePickerHandle {
  reset: () => void;
}

interface DatePickerProps {
  id?: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function parseISO(iso: string) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month: month - 1, day };
}

function formatDisplay(iso: string) {
  const parsed = parseISO(iso);
  if (!parsed) return "";
  return `${String(parsed.day).padStart(2, "0")}/${String(parsed.month + 1).padStart(2, "0")}/${parsed.year}`;
}

export const DatePicker = forwardRef<DatePickerHandle, DatePickerProps>(function DatePicker(
  { id, name, defaultValue = "", required, disabled, className },
  ref,
) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const initialView = parseISO(defaultValue) ?? parseISO(todayISO())!;
  const [viewYear, setViewYear] = useState(initialView.year);
  const [viewMonth, setViewMonth] = useState(initialView.month);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setValue(defaultValue);
      const view = parseISO(defaultValue) ?? parseISO(todayISO())!;
      setViewYear(view.year);
      setViewMonth(view.month);
      setOpen(false);
    },
  }));

  useLayoutEffect(() => {
    if (!open) return;
    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const grid = useMemo(() => getCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const today = todayISO();

  function shiftMonth(delta: number) {
    const next = new Date(Date.UTC(viewYear, viewMonth + delta, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  }

  function selectDay(iso: string) {
    setValue(iso);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-neutral-900/80 px-3 py-2 text-left text-sm text-neutral-100 transition-shadow focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      >
        <span className={value ? "" : "text-neutral-500"}>
          {value ? formatDisplay(value) : "dd/mm/aaaa"}
        </span>
        <svg aria-hidden viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-neutral-500">
          <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open &&
        !disabled &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-50 w-72 rounded-xl border border-white/10 bg-neutral-900 p-3 shadow-2xl shadow-black/60"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-md px-2 py-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100"
                aria-label="Mês anterior"
              >
                ‹
              </button>
              <span className="text-sm font-medium text-neutral-100">
                {MESES_PT[viewMonth]} de {viewYear}
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-md px-2 py-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100"
                aria-label="Próximo mês"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[11px] text-neutral-500">
              {DIAS_SEMANA_PT.map((dia) => (
                <div key={dia} className="py-1">
                  {dia[0]}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {grid.map(({ iso, date, inMonth }) => {
                const isSelected = iso === value;
                const isToday = iso === today;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => selectDay(iso)}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-full text-xs transition-colors",
                      inMonth ? "text-neutral-200" : "text-neutral-700",
                      isSelected
                        ? "bg-emerald-500 font-semibold text-white"
                        : isToday
                          ? "border border-emerald-500/60 text-emerald-400"
                          : "hover:bg-white/10",
                    )}
                  >
                    {date.getUTCDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-emerald-400 hover:underline"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => {
                  const view = parseISO(today)!;
                  setValue(today);
                  setViewYear(view.year);
                  setViewMonth(view.month);
                  setOpen(false);
                }}
                className="text-xs font-medium text-emerald-400 hover:underline"
              >
                Hoje
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
});
