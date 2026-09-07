"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Início" },
  { href: "/dashboard/calendario", label: "Calendário" },
  { href: "/dashboard/gastos", label: "Gastos" },
  { href: "/dashboard/estatisticas", label: "Estatísticas" },
  { href: "/dashboard/dutching", label: "Calculadora Dutching" },
];

function SubscriptionBadge({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 5;
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
        urgent
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {daysLeft > 0 ? `${daysLeft} dia${daysLeft === 1 ? "" : "s"} restantes` : "Expirada"}
    </span>
  );
}

/**
 * A navegação vive em dois lugares: uma barra superior com menu suspenso no
 * celular (pouca largura horizontal pra sobrar espaço de sidebar), e uma
 * coluna fixa à esquerda a partir do breakpoint sm.
 */
export function Navbar({
  subscriptionDaysLeft = null,
}: {
  subscriptionDaysLeft?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Barra superior — só no celular */}
      <nav className="sticky top-0 z-20 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md sm:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Logo textClassName="text-base" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="text-neutral-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-1 border-t border-white/5 px-4 pb-4 pt-2">
            {subscriptionDaysLeft !== null && (
              <div className="px-2 py-2">
                <SubscriptionBadge daysLeft={subscriptionDaysLeft} />
              </div>
            )}
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-2 py-2 text-sm transition-colors",
                  pathname === link.href
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "text-neutral-300 hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            ))}
            <form action={signOut}>
              <Button type="submit" variant="ghost" className="w-full justify-start">
                Sair
              </Button>
            </form>
          </div>
        )}
      </nav>

      {/* Sidebar — a partir do sm */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-neutral-950/70 backdrop-blur-md sm:flex">
        <div className="px-5 py-6">
          <Logo textClassName="text-base" className="flex-wrap" />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t border-white/5 px-3 py-4">
          {subscriptionDaysLeft !== null && <SubscriptionBadge daysLeft={subscriptionDaysLeft} />}
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="w-full justify-start">
              Sair
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
