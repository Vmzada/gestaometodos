import Link from "next/link";
import { cn } from "@/lib/utils";
import { MERCADOS, type Aba } from "@/lib/mercados";

// Método é a aba padrão; as demais saem de MERCADOS, para o nome do mercado
// viver num lugar só.
const ABAS: { aba: Aba; label: string; href: string }[] = [
  { aba: "metodo", label: "Métodos", href: "/dashboard" },
  ...Object.entries(MERCADOS).map(([aba, { label }]) => ({
    aba: aba as Aba,
    label,
    href: `/dashboard?aba=${aba}`,
  })),
];

export function DashboardTabs({ active }: { active: Aba }) {
  return (
    // No celular são três colunas iguais ocupando a largura toda: os nomes são
    // longos e, soltos em linha, quebravam pra segunda linha. A partir do sm
    // volta a ser uma tira que ocupa só o espaço que precisa.
    <div className="grid w-full grid-cols-3 gap-1 rounded-lg border border-white/10 bg-neutral-900/60 p-1 sm:inline-flex sm:w-auto">
      {ABAS.map(({ aba, label, href }) => (
        <Link
          key={aba}
          href={href}
          className={cn(
            "rounded-md px-1 py-1.5 text-center text-xs font-medium transition-colors sm:px-4 sm:text-sm",
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
