import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardTabs({ active }: { active: "metodo" | "delay" }) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-white/10 bg-neutral-900/60 p-1">
      <Link
        href="/dashboard"
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
          active === "metodo"
            ? "bg-emerald-500/15 text-emerald-300"
            : "text-neutral-400 hover:text-neutral-100",
        )}
      >
        Método
      </Link>
      <Link
        href="/dashboard?aba=delay"
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
          active === "delay"
            ? "bg-emerald-500/15 text-emerald-300"
            : "text-neutral-400 hover:text-neutral-100",
        )}
      >
        Delay
      </Link>
    </div>
  );
}
