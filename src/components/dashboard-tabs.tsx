import Link from "next/link";
import { cn } from "@/lib/utils";
import { ABAS, abaHref, type Aba } from "@/lib/mercados";

export function DashboardTabs({ active }: { active: Aba }) {
  return (
    // No celular são duas colunas ocupando a largura toda: com quatro abas de
    // nome longo, uma única linha deixaria cada uma com ~85px e o texto viraria
    // três linhas. A partir do sm volta a ser a tira compacta.
    <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-neutral-900/60 p-1 sm:inline-flex sm:w-auto">
      {ABAS.map(({ aba, label }) => (
        <Link
          key={aba}
          href={abaHref(aba)}
          className={cn(
            "rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors sm:px-4 sm:text-sm",
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
