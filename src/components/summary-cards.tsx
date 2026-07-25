import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatBRL } from "@/lib/date-helpers";

export function SummaryCards({
  hoje,
  semana,
  mes,
}: {
  hoje: number;
  semana: number;
  mes: number;
}) {
  const items = [
    { label: "Hoje", value: hoje, icon: "☀️" },
    { label: "Esta semana", value: semana, icon: "📅" },
    { label: "Este mês", value: mes, icon: "📈" },
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
    </div>
  );
}
