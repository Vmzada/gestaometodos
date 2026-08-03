"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/date-helpers";

type Point = { key: string; label: string; deposito: number; clienteParte: number; lucro: number };

const SERIES = [
  { key: "deposito" as const, label: "Depósito (investido)", color: "#3987e5" },
  { key: "clienteParte" as const, label: "Parte do cliente", color: "#d95926" },
  { key: "lucro" as const, label: "Lucro", color: "#199e70" },
];

export function ComparativoChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const width = 720;
  const height = 240;
  const padding = { top: 16, right: 8, bottom: 26, left: 8 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const maxVal = Math.max(1, ...data.flatMap((d) => SERIES.map((s) => d[s.key])));
  const step = plotW / data.length;
  const groupGap = 10;
  const groupW = step - groupGap;
  const barGap = 2;
  const barW = Math.min(16, (groupW - barGap * (SERIES.length - 1)) / SERIES.length);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="img"
          aria-label="Depósito, parte do cliente e lucro por mês"
        >
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#383835"
            strokeWidth={1}
          />
          {data.map((d, i) => {
            const groupX = padding.left + i * step + groupGap / 2;
            return (
              <g
                key={d.key}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <rect x={groupX} y={padding.top} width={groupW} height={plotH} fill="transparent" />
                {SERIES.map((s, si) => {
                  const val = d[s.key];
                  const barH = (val / maxVal) * plotH;
                  const x = groupX + si * (barW + barGap);
                  const y = height - padding.bottom - barH;
                  return (
                    <rect
                      key={s.key}
                      x={x}
                      y={y}
                      width={barW}
                      height={Math.max(barH, 1)}
                      rx={3}
                      fill={s.color}
                      opacity={hover === i ? 1 : 0.85}
                    />
                  );
                })}
                <text x={groupX + groupW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#898781">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[110%] rounded-md border border-white/10 bg-neutral-900 px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${((padding.left + hover * step + step / 2) / width) * 100}%`, top: 0 }}
          >
            <p className="mb-1 font-medium text-neutral-100">{data[hover].label}</p>
            {SERIES.map((s) => (
              <p key={s.key} className="flex items-center gap-1.5 text-neutral-300">
                <span className="inline-block h-2 w-3 rounded-sm" style={{ background: s.color }} />
                {formatBRL(data[hover][s.key])}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
