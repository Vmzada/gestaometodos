import Image from "next/image";
import { RotatingBetSlip } from "@/components/landing/rotating-bet-slip";

/**
 * Logos que orbitam o bilhete, cada um no seu plano de profundidade.
 *
 * As posições vivem na calha que o padding do palco abre em volta do bilhete —
 * dentro dela, a órbita passaria por cima do selo de GREEN e do confronto.
 * São casas diferentes das que aparecem no bilhete, pra cena não repetir logo.
 */
const ORBITA = [
  { icone: "/casas/estrelabet.png", classe: "-left-14 top-6", z: 90, atraso: "0s" },
  { icone: "/casas/betnacional.png", classe: "-right-14 top-2", z: 60, atraso: "1.4s" },
  { icone: "/casas/sportingbet.png", classe: "-left-16 top-1/2", z: 120, atraso: "2.6s" },
  { icone: "/casas/vaidebet.png", classe: "-right-16 bottom-40", z: 40, atraso: "3.8s" },
  { icone: "/casas/blaze.png", classe: "-left-12 bottom-0", z: 30, atraso: "1.9s" },
  { icone: "/casas/novibet.png", classe: "-right-12 bottom-10", z: 100, atraso: "3.1s" },
];

export function HeroStage() {
  return (
    // O padding lateral é a órbita: o bilhete fica no miolo e os logos giram na
    // borda, sem encostar nele.
    <div className="scene relative mx-auto w-full max-w-md sm:max-w-xl sm:px-20 sm:py-10">
      <div className="preserve-3d relative">
        {/* Logos soltos no espaço, cada um empurrado num Z diferente pra cena
            ter camadas em vez de tudo colado no mesmo plano. */}
        {ORBITA.map((item) => (
          <div
            key={item.icone}
            aria-hidden="true"
            // Some no celular: a órbita passa das bordas do palco em telas
            // estreitas e empurraria a página pro lado.
            className={`absolute z-10 hidden animate-float-3d sm:block ${item.classe}`}
            style={{ transform: `translateZ(${item.z}px)`, animationDelay: item.atraso }}
          >
            <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-sm">
              <Image
                src={item.icone}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded-md object-contain"
              />
            </div>
          </div>
        ))}

        {/* O bilhete, no centro, trocando de casa e de mercado sozinho. */}
        <div className="relative z-20 animate-float">
          <RotatingBetSlip />
        </div>

        {/* Sombra projetada no "chão" da mesa, ancorando a cena. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -bottom-10 h-16 rounded-[100%] bg-emerald-500/20 blur-2xl"
        />
      </div>
    </div>
  );
}
