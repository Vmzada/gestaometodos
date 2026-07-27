import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";

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

const MOCK_ROWS = [
  { casa: "Bet365", cliente: "Carlos Souza", lucro: "R$ 120,50" },
  { casa: "Betano", cliente: "Marina Lima", lucro: "R$ 80,00" },
  { casa: "KTO", cliente: "Carlos Souza", lucro: "R$ 65,75" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-neutral-100">Gestão dos Métodos</span>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button>Criar conta</Button>
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
              <Link href="/cadastro">
                <Button className="w-full">Assinar agora</Button>
              </Link>
            </Card>
          </TiltCard>
        </section>
      </main>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} Gestão dos Métodos
      </footer>
    </div>
  );
}
