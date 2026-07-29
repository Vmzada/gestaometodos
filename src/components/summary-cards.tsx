import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatBRL } from "@/lib/date-helpers";

export function SummaryCards({
  hoje,
  semana,
  mes,
  mesLabel,
  mesPrevHref,
  mesNextHref,
  mesIsCurrent = true,
}: {
  hoje: number;
  semana: number;
  mes: number;
  mesLabel?: string;
  mesPrevHref?: string;
  mesNextHref?: string;
  mesIsCurrent?: boolean;
}) {
  const items = [
    { label: "Hoje", value: hoje, icon: "☀️" },
    { label: "Esta semana", value: semana, icon: "📅" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <TiltCard key={item.label} maxTilt={6}>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">{item.label}</p>
              <p
                className={`mt-1 text-2xl font-semibold ${item.value >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {formatBRL(item.value)}
              </p>
            </div>
            <span className="text-2xl opacity-70">{item.icon}</span>
          </Card>
        </TiltCard>
      ))}

      <TiltCard maxTilt={6}>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Este mês{mesLabel ? ` (${mesLabel})` : ""}</p>
            <p
              className={`mt-1 text-2xl font-semibold ${mes >= 0 ? "text-emerald-400" : "text-red-400"}`}
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
        </Card>
      </TiltCard>
    </div>
  );
}
