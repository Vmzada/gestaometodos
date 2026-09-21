"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TiltCard } from "@/components/ui/tilt-card";
import { BetSlip, type Slip } from "@/components/landing/bet-slip";

/**
 * Um lançamento de cada mercado do painel. Os campos do meio mudam junto com a
 * casa porque é assim que o app grava: método é depósito/saque/CPA, rodadas
 * grátis conta giros e delay/erro giram em torno de odd.
 */
const SLIPS: Slip[] = [
  {
    casa: "Bet365",
    logo: "/casas/bet365.png",
    mercado: "Delay esportivo",
    linha: "Flamengo x Palmeiras · Mais de 2.5",
    cells: [
      { label: "Odd", value: "2.10" },
      { label: "Valor", value: "R$ 300,00" },
      { label: "Retorno", value: "R$ 630,00", green: true },
    ],
    clienteNome: "Carlos Souza",
    clienteParte: "R$ 165,00",
  },
  {
    casa: "Superbet",
    logo: "/casas/superbet.png",
    mercado: "Mercado de erro",
    linha: "Real Madrid x Barcelona · Handicap +1",
    cells: [
      { label: "Odd", value: "4.50" },
      { label: "Valor", value: "R$ 200,00" },
      { label: "Retorno", value: "R$ 900,00", green: true },
    ],
    clienteNome: "Rafael Dias",
    clienteParte: "R$ 350,00",
  },
  {
    casa: "Betano",
    logo: "/casas/betano.png",
    mercado: "Rodadas grátis",
    linha: "Promoção da casa · 20 giros",
    cells: [
      { label: "Giros", value: "20" },
      { label: "Aposta", value: "Grátis" },
      { label: "Ganho", value: "R$ 240,00", green: true },
    ],
    clienteNome: "Marina Lima",
    clienteParte: "R$ 120,00",
  },
  {
    casa: "KTO",
    logo: "/casas/kto.png",
    mercado: "Método",
    linha: "Depósito e saque no mesmo dia",
    cells: [
      { label: "Depósito", value: "R$ 150,00" },
      { label: "Saque", value: "R$ 420,00" },
      { label: "CPA", value: "R$ 90,00", green: true },
    ],
    clienteNome: "Bruno Alves",
    clienteParte: "R$ 180,00",
  },
];

const INTERVALO_MS = 4200;

export function RotatingBetSlip() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SLIPS.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  const slip = SLIPS[i];

  return (
    <div className="relative">
      <TiltCard maxTilt={14}>
        {/* A key remonta o nó a cada troca, e com isso a animação de virada
            recomeça — sem ela o CSS não teria o que reiniciar. */}
        <div key={i} className="animate-flip-in preserve-3d">
          <BetSlip slip={slip} />
        </div>
      </TiltCard>

      {/* Marcadores de qual lançamento está na vez. */}
      <div className="mt-5 flex justify-center gap-2">
        {SLIPS.map((s, n) => (
          <button
            key={s.casa}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Ver lançamento de ${s.casa} — ${s.mercado}`}
            aria-current={n === i}
            className={
              n === i
                ? "flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 ring-1 ring-emerald-400/40 transition-colors"
                : "flex items-center gap-1.5 rounded-full px-2.5 py-1 opacity-45 transition-opacity hover:opacity-80"
            }
          >
            <Image
              src={s.logo}
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 rounded object-contain"
            />
            <span className="text-[10px] font-medium text-neutral-300">{s.mercado}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
