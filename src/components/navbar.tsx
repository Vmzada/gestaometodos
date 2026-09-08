"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "gestaodosmetodos:sidebar-collapsed";

/**
 * Store mínima pro estado de recolhida.
 *
 * Ler o localStorage direto no primeiro render quebrava a hidratação: o
 * servidor não tem localStorage e renderizava expandida, o navegador lia
 * "recolhida", e os dois HTML não batiam. useSyncExternalStore existe pra
 * isso — usa o snapshot do servidor na hidratação e só depois troca pelo
 * valor real, sem erro.
 */
let listeners: (() => void)[] = [];

function subscribeCollapsed(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getCollapsedSnapshot() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

/** No servidor a sidebar sempre começa expandida. */
function getCollapsedServerSnapshot() {
  return false;
}

function setCollapsedStored(next: boolean) {
  try {
    localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
  } catch {
    // Sem storage disponível: a preferência não sobrevive a um reload.
  }
  listeners.forEach((l) => l());
}

// --- ícones (mesmo estilo inline usado no resto do app) -------------------

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <path
        d="M4 10.5L12 4l8 6.5M6 9.5V19a1 1 0 0 0 1 1h3v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h3a1 1 0 0 0 1-1V9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M15.5 14h1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalculator() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="7.5" y="5.5" width="9" height="3.5" rx="0.5" />
      {[13, 16.5].map((cy) =>
        [8.5, 12, 15.5].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" fill="currentColor" stroke="none" />
        )),
      )}
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ícone de painel lateral — o botão de recolher/expandir. */
function IconPanel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9.5 4v16" />
    </svg>
  );
}

function IconLogoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0 text-emerald-400" aria-hidden="true">
      <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 10.5h20" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="14.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

const SECTIONS = [
  {
    label: "Principal",
    links: [
      { href: "/dashboard", label: "Início", Icon: IconHome },
      { href: "/dashboard/calendario", label: "Calendário", Icon: IconCalendar },
    ],
  },
  {
    label: "Financeiro",
    links: [
      { href: "/dashboard/gastos", label: "Gastos", Icon: IconWallet },
      { href: "/dashboard/estatisticas", label: "Estatísticas", Icon: IconChart },
    ],
  },
  {
    label: "Ferramentas",
    links: [{ href: "/dashboard/dutching", label: "Calculadora Dutching", Icon: IconCalculator }],
  },
];

/** Selo do usuário: teste em andamento ou dias de assinatura restantes. */
function StatusBadge({
  isTrial,
  subscriptionDaysLeft,
}: {
  isTrial: boolean;
  subscriptionDaysLeft: number | null;
}) {
  if (isTrial) {
    return (
      <span className="shrink-0 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-300">
        TESTE
      </span>
    );
  }
  if (subscriptionDaysLeft === null) return null;

  const urgent = subscriptionDaysLeft <= 5;
  return (
    <span
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        urgent
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      )}
    >
      {subscriptionDaysLeft > 0 ? `${subscriptionDaysLeft}D` : "EXPIRADA"}
    </span>
  );
}

function BotaoSair() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        title="Sair"
        aria-label="Sair"
        className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100"
      >
        <IconLogout />
      </button>
    </form>
  );
}

type NavbarProps = {
  subscriptionDaysLeft?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  isTrial?: boolean;
};

/**
 * A navegação vive em dois lugares: uma barra superior com menu suspenso até o
 * breakpoint lg (celular e tablet não têm largura pra ceder 256px à sidebar), e
 * a partir do lg uma sidebar recolhível — expandida com os nomes, recolhida
 * numa trilha só de ícones. A preferência de recolhida fica no navegador.
 */
export function Navbar({
  subscriptionDaysLeft = null,
  userName = null,
  userEmail = null,
  isTrial = false,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );

  function toggleCollapsed() {
    setCollapsedStored(!collapsed);
  }

  const displayName = userName?.trim() || null;
  const inicial = (displayName || userEmail || "?").charAt(0).toUpperCase();
  const temUsuario = Boolean(displayName || userEmail);

  return (
    <>
      {/* Barra superior — até o lg */}
      <nav className="sticky top-0 z-20 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="flex min-w-0 items-center gap-2">
            <IconLogoMark />
            <span className="truncate bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
              Gestão dos Métodos
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="shrink-0 text-neutral-300"
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
          <div className="border-t border-white/5 px-3 pb-3 pt-1">
            {SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                  {section.label}
                </p>
                <div className="flex flex-col gap-1">
                  {section.links.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                        pathname === href
                          ? "bg-emerald-500/10 font-medium text-emerald-300"
                          : "text-neutral-300 hover:bg-white/5",
                      )}
                    >
                      <Icon />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
              {temUsuario && (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
                    {inicial}
                  </span>
                  <span className="min-w-0 flex-1">
                    {displayName && (
                      <span className="block truncate text-sm font-medium text-neutral-200">
                        {displayName}
                      </span>
                    )}
                    {userEmail && (
                      <span className="block truncate text-xs text-neutral-500">{userEmail}</span>
                    )}
                  </span>
                  <StatusBadge isTrial={isTrial} subscriptionDaysLeft={subscriptionDaysLeft} />
                </>
              )}
              <BotaoSair />
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar — a partir do lg, recolhível */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/5 bg-neutral-950/70 backdrop-blur-md transition-[width] duration-200 lg:flex",
          collapsed ? "w-16" : "w-72",
        )}
      >
        {/* Cabeçalho: marca + botão de recolher */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-white/5 py-4",
            collapsed ? "flex-col gap-3 px-2" : "gap-2 px-4",
          )}
        >
          {collapsed ? (
            <span className="text-sm font-bold tracking-tight">
              <span className="text-emerald-400">G</span>
              <span className="text-neutral-300">M</span>
            </span>
          ) : (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <IconLogoMark />
              <span className="min-w-0">
                <span className="block truncate bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
                  Gestão dos Métodos
                </span>
                <span className="block truncate text-[11px] text-neutral-500">
                  Gestão financeira
                </span>
              </span>
            </span>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100"
          >
            <IconPanel />
          </button>
        </div>

        {/* Links — rolam sozinhos se a tela for baixa */}
        <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
          {SECTIONS.map((section, i) => (
            <div key={section.label} className="mb-3 last:mb-0">
              {collapsed ? (
                i > 0 && <span className="mx-auto mb-3 block h-px w-6 bg-white/10" />
              ) : (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                  {section.label}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {section.links.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md py-2 text-sm transition-colors",
                      collapsed ? "justify-center px-0" : "px-3",
                      pathname === href
                        ? "bg-emerald-500/15 font-medium text-emerald-300"
                        : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100",
                    )}
                  >
                    <Icon />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Usuário */}
        <div
          className={cn(
            "flex shrink-0 border-t border-white/5 py-3",
            collapsed ? "flex-col items-center gap-2 px-2" : "items-center gap-2 px-3",
          )}
        >
          {temUsuario && (
            <>
              <span
                title={collapsed ? displayName ?? userEmail ?? undefined : undefined}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-sm font-semibold text-emerald-300"
              >
                {inicial}
              </span>
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">
                    {displayName && (
                      <span className="block truncate text-sm font-medium text-neutral-200">
                        {displayName}
                      </span>
                    )}
                    {userEmail && (
                      <span className="block truncate text-xs text-neutral-500">{userEmail}</span>
                    )}
                  </span>
                  <StatusBadge isTrial={isTrial} subscriptionDaysLeft={subscriptionDaysLeft} />
                </>
              )}
            </>
          )}
          <BotaoSair />
        </div>
      </aside>
    </>
  );
}
