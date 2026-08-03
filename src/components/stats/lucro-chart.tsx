"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/date-helpers";

type Point = { key: string; label: string; value: number };

const GOOD = "#34d399";
const CRITICAL = "#f87171";

export function LucroChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const width = 720;
  const height = 220;
  const padding = { top: 20, right: 8, bottom: 26, left: 8 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const maxPos = Math.max(0, ...data.map((d) => d.value));
  const maxNeg = Math.max(0, ...data.map((d) => -d.value));
  const range = maxPos + maxNeg || 1;
  const baselineY = padding.top + (maxPos / range) * plotH;

  const step = plotW / data.length;
  const barW = Math.min(24, step - 8);

  const extremeIdx = data.reduce(
    (best, d, i) => (Math.abs(d.value) > Math.abs(data[best].value) ? i : best),
    0,
  );

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Lucro por mês">
        <line
          x1={padding.left}
          y1={baselineY}
          x2={width - padding.right}
          y2={baselineY}
          stroke="#383835"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const x = padding.left + i * step + (step - barW) / 2;
          const barH = (Math.abs(d.value) / range) * plotH;
          const y = d.value >= 0 ? baselineY - barH : baselineY;
          const color = d.value >= 0 ? GOOD : CRITICAL;
          const isHover = hover === i;
          return (
            <g key={d.key}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 1)}
                rx={4}
                fill={color}
                opacity={isHover ? 1 : 0.85}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                style={{ cursor: "pointer" }}
              />
              {i === extremeIdx && (
                <text
                  x={x + barW / 2}
                  y={d.value >= 0 ? y - 6 : y + barH + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#c3c2b7"
                >
                  {formatBRL(d.value)}
                </text>
              )}
              <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="#898781">
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
          <p className={`font-medium ${data[hover].value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatBRL(data[hover].value)}
          </p>
          <p className="text-neutral-400">{data[hover].label}</p>
        </div>
      )}
    </div>
  );
}
