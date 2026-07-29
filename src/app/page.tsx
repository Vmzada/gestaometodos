import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { Logo } from "@/components/ui/logo";
import { RecoveryRedirectHandler } from "@/components/recovery-redirect-handler";

const FEATURES = [
  {
    title: "Lançamentos organizados",
    description: "Registre casa de aposta, cliente, parte do cliente e lucro em cada operação.",
    icon: "📋",
  },
  {
    title: "Totais automáticos",
    description: "Veja quanto lucrou hoje, nesta semana e neste mês, sem planilhas.",
    icon: "📈",
  },
  {
    title: "Calendário completo",
    description: "Navegue por mês e ano e veja o resultado de cada dia num só lugar.",
    icon: "🗓️",
  },
];

const PLAN_INCLUDES = [
  "Lucro com Método calculado automaticamente",
  "Lucro com Delay calculado automaticamente",
  "Dashboard completo com totais em tempo real",
  "Calendário com o histórico de todos os dias",
  "Pagamento por Pix",
  "Suporte via WhatsApp",
];

const MOCK_ROWS = [
  { casa: "Bet365", cliente: "Carlos Souza", lucro: "R$ 120,50" },
  { casa: "Betano", cliente: "Marina Lima", lucro: "R$ 80,00" },
  { casa: "KTO", cliente: "Carlos Souza", lucro: "R$ 65,75" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <RecoveryRedirectHandler />
      <header className="sticky top-0 z-20 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
          <Logo textClassName="hidden sm:inline" />
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="px-3 sm:px-4">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button className="px-3 sm:px-4">Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-mesh relative overflow-hidden">
          <div className="bg-grid absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Feito para operações profissionais
              </span>
              <h1 className="text-glow mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl">
                Gestão financeira para quem trabalha com{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  métodos e delay em casas de apostas
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400 lg:mx-0">
                Substitua a planilha por um painel: lançamentos por casa de aposta e cliente,
                totais automáticos e calendário mensal.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/cadastro">
                  <Button className="px-8 py-3 text-base">Começar agora</Button>
                </Link>
                <Link href="#precos">
                  <Button variant="secondary" className="px-8 py-3 text-base">
                    Ver preço
                  </Button>
                </Link>
              </div>
            </div>

            <div className="perspective-container hidden lg:block">
              <div className="animate-float">
                <TiltCard maxTilt={10} className="mx-auto w-full max-w-md">
                  <Card className="border-white/10 bg-neutral-900/80 p-0 shadow-[0_30px_80px_-20px_rgba(16,185,129,0.35)]">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <span className="text-sm font-semibold text-neutral-200">Este mês</span>
                      <span className="text-lg font-bold text-emerald-400">R$ 4.280,00</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {MOCK_ROWS.map((row) => (
                        <div key={row.casa} className="flex items-center justify-between px-5 py-3 text-sm">
                          <div>
                            <p className="font-medium text-neutral-200">{row.casa}</p>
                            <p className="text-xs text-neutral-500">{row.cliente}</p>
                          </div>
                          <span className="font-medium text-emerald-400">{row.lucro}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <TiltCard key={feature.title}>
                <Card className="h-full text-left">
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="mt-3 font-semibold text-neutral-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{feature.description}</p>
                </Card>
              </TiltCard>
            ))}
          </div>
        </section>

        <section id="precos" className="mx-auto max-w-6xl px-6 pb-28 text-center">
          <TiltCard maxTilt={6} className="mx-auto w-full max-w-sm">
            <Card className="border-emerald-500/20 bg-gradient-to-b from-neutral-900 to-neutral-900/60 shadow-[0_30px_80px_-30px_rgba(16,185,129,0.4)]">
              <p className="text-sm text-neutral-400">Plano único</p>
              <p className="my-3 text-4xl font-bold text-neutral-100">
                R$ 14,99<span className="text-base font-normal text-neutral-400">/mês</span>
              </p>

              <ul className="mb-6 space-y-2.5 text-left">
                {PLAN_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
                      <path
                        d="M7.5 12.5l3 3 6-6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/cadastro">
                <Button className="w-full">Assinar agora</Button>
              </Link>
            </Card>
          </TiltCard>
        </section>
      </main>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-xs text-neutral-600">
        <p>© {new Date().getFullYear()} Gestão dos Métodos</p>
        <a
          href="https://wa.me/5551984084536"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.06-1.33A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3 .79.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.52-6.13c-.25-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31s-.85.83-.85 2.03.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
          </svg>
          Suporte via WhatsApp: (51) 98408-4536
        </a>
      </footer>
    </div>
  );
}
