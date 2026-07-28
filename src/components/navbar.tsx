"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const LINKS = [
  { href: "/dashboard", label: "Lançamentos" },
  { href: "/dashboard/calendario", label: "Calendário" },
];

function SubscriptionBadge({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 5;
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
        urgent
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {daysLeft > 0 ? `${daysLeft} dia${daysLeft === 1 ? "" : "s"} restantes` : "Expirada"}
    </span>
  );
}

export function Navbar({
  subscriptionDaysLeft = null,
}: {
  subscriptionDaysLeft?: number | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Logo textClassName="text-base sm:text-lg" />

        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
          {subscriptionDaysLeft !== null && <SubscriptionBadge daysLeft={subscriptionDaysLeft} />}
          <form action={signOut}>
            <Button type="submit" variant="ghost">
              Sair
            </Button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="text-neutral-300 sm:hidden"
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
        <div className="flex flex-col gap-1 border-t border-white/5 px-4 pb-4 pt-2 sm:hidden">
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
              className="rounded-md px-2 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5"
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
  );
}
