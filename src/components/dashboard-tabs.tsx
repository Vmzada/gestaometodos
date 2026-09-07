import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Aba } from "@/lib/mercados";

const ABAS: { aba: Aba; label: string; href: string }[] = [
  { aba: "metodo", label: "Método", href: "/dashboard" },
  { aba: "delay", label: "Delay", href: "/dashboard?aba=delay" },
  { aba: "erro", label: "Erro", href: "/dashboard?aba=erro" },
];

export function DashboardTabs({ active }: { active: Aba }) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-white/10 bg-neutral-900/60 p-1">
      {ABAS.map(({ aba, label, href }) => (
        <Link
          key={aba}
          href={href}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            active === aba
              ? "bg-emerald-500/15 text-emerald-300"
              : "text-neutral-400 hover:text-neutral-100",
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
