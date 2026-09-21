import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/tilt-card";
import { Logo } from "@/components/ui/logo";
import { RecoveryRedirectHandler } from "@/components/recovery-redirect-handler";
import { HeroStage } from "@/components/landing/hero-stage";
import { CasasMarquee } from "@/components/landing/casas-marquee";
import {
  CalculatorIcon,
  CalendarIcon,
  ChartIcon,
  ChipIcon,
  ClientIcon,
  TicketIcon,
} from "@/components/landing/icons";

const FEATURES = [
  {
    title: "Bilhete por bilhete",
    description:
      "Casa, odd, valor, green ou red. Cada aposta vira um lançamento com o lucro já calculado.",
    Icon: TicketIcon,
  },
  {
    title: "Quatro mercados",
    description:
      "Métodos, rodadas grátis, delay esportivo e mercado de erro — cada um com a sua aba e os seus campos.",
    Icon: ChipIcon,
  },
  {
    title: "Totais em tempo real",
    description: "Hoje, esta semana e este mês somados sozinhos, com e sem os gastos.",
    Icon: ChartIcon,
  },
  {
    title: "Parte do cliente",
    description:
      "Registre o cliente e quanto é dele. O painel separa o que é seu do que é dele em todo lançamento.",
    Icon: ClientIcon,
  },
  {
    title: "Calendário do mês",
    description: "Navegue por mês e ano e veja o resultado de cada dia num só lugar.",
    Icon: CalendarIcon,
  },
  {
    title: "Calculadora de dutching",
    description: "Distribua o valor entre as odds e veja o retorno de cada perna antes de apostar.",
    Icon: CalculatorIcon,
  },
];

const PLAN_INCLUDES = [
  "Lucro com Método calculado automaticamente",
  "Lucro com Delay Esportivo calculado automaticamente",
  "Dashboard completo com totais em tempo real",
  "Calendário com o histórico de todos os dias",
  "Pagamento por Pix",
  "Suporte via WhatsApp",
];

/** Greens de exemplo na seção do cliente — os mesmos campos que o painel grava. */
const GREENS = [
  {
    casa: "Betano",
    logo: "/casas/betano.png",
    cliente: "Marina Lima",
    mercado: "Rodadas grátis",
    total: "R$ 240,00",
    parte: "R$ 120,00",
  },
  {
    casa: "KTO",
    logo: "/casas/kto.png",
    cliente: "Carlos Souza",
    mercado: "Mercado de erro",
    total: "R$ 131,50",
    parte: "R$ 65,75",
  },
  {
    casa: "Superbet",
    logo: "/casas/superbet.png",
    cliente: "Rafael Dias",
    mercado: "Delay esportivo",
    total: "R$ 418,00",
    parte: "R$ 209,00",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <RecoveryRedirectHandler />
      <header className="sticky top-0 z-30 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md">
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
        {/* ---- Hero ---------------------------------------------------- */}
        <section className="bg-felt relative overflow-hidden">
          <div className="bg-mesh absolute inset-0" />
          <div className="bg-grid absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-28 pt-16 lg:grid-cols-2 lg:pt-24">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Feito para operações profissionais
              </span>
              <h1 className="text-glow mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl">
                Todo green vira{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  número no seu caixa
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400 lg:mx-0">
                O painel de quem trabalha com método, rodadas grátis, delay e mercado de erro nas
                casas de apostas. Lançou o bilhete, o lucro seu e a parte do cliente já estão
                somados.
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

            <div className="mt-8 lg:mt-0">
              <HeroStage />
            </div>
          </div>
        </section>

        {/* ---- Esteira de casas ---------------------------------------- */}
        <section className="relative overflow-hidden border-y border-white/5 bg-neutral-950 py-14">
          <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-neutral-600">
            Funciona com as casas que você já usa
          </p>
          <CasasMarquee />
        </section>

        {/* ---- O que o painel faz -------------------------------------- */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
              A planilha não some.{" "}
              <span className="text-emerald-400">Ela vira painel.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
              Tudo que você anotava em coluna, agora com total automático e histórico.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, description, Icon }) => (
              <TiltCard key={title} maxTilt={10}>
                <Card className="h-full text-left transition-colors hover:border-emerald-500/30">
                  <span className="inline-flex rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.6)]">
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-semibold text-neutral-100">{title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{description}</p>
                </Card>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ---- O cliente ----------------------------------------------- */}
        <section className="relative overflow-hidden border-y border-white/5 bg-neutral-950/60">
          <div className="bg-mesh absolute inset-0 opacity-60" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Transparência com quem joga com você
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
                Cada green mostra{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  quanto é do cliente
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-neutral-400">
                Você lança o nome e a parte dele uma vez. O painel desconta sozinho em todo mercado
                — método, rodadas grátis, delay e erro — e mostra o seu lucro líquido separado do
                que é dele. Fim da conta no papel no fim do dia.
              </p>

              <p className="mt-8 text-sm text-neutral-500">
                Divida como combinou: metade, terço, valor fixo.
              </p>
            </div>

            {/* Pilha de greens em profundidade: cada cartão um pouco mais fundo. */}
            <div className="scene">
              <div className="preserve-3d space-y-4 [transform:rotateX(12deg)_rotateY(-10deg)]">
                {GREENS.map((green, i) => (
                  <TiltCard key={green.casa} maxTilt={8}>
                    <Card
                      className="border-white/10 bg-neutral-900/80"
                      style={{ transform: `translateZ(${i * 26}px)` }}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={green.logo}
                          alt=""
                          width={36}
                          height={36}
                          unoptimized
                          className="h-9 w-9 rounded-lg object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-neutral-100">
                            {green.casa}
                          </p>
                          <p className="truncate text-xs text-neutral-500">{green.mercado}</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                          GREEN
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                            Total
                          </p>
                          <p className="text-lg font-bold text-neutral-100">{green.total}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                            {green.cliente}
                          </p>
                          <p className="text-lg font-bold text-emerald-400">{green.parte}</p>
                        </div>
                      </div>
                    </Card>
                  </TiltCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Preço --------------------------------------------------- */}
        <section id="precos" className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            Um plano, tudo liberado
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Menos que uma aposta de R$ 15 — e essa não dá red.
          </p>

          <div className="scene mt-12">
            <TiltCard maxTilt={10} className="mx-auto w-full max-w-sm">
              <Card className="relative overflow-hidden border-emerald-500/25 bg-gradient-to-b from-neutral-900 to-neutral-900/60 shadow-[0_40px_90px_-30px_rgba(16,185,129,0.5)]">
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent animate-sheen" />
                <p className="text-sm text-neutral-400">Plano único</p>
                <p className="my-3 text-5xl font-bold text-neutral-100">
                  R$ 14,99
                  <span className="text-base font-normal text-neutral-400">/mês</span>
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
                  <Button className="w-full py-3 text-base">Assinar agora</Button>
                </Link>
              </Card>
            </TiltCard>
          </div>
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
