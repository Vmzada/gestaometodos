import Image from "next/image";
import { CASAS_DE_APOSTA } from "@/lib/casas-de-aposta";

/**
 * Casas em destaque na esteira. São marcas reconhecíveis, escolhidas a dedo
 * para a vitrine — o painel aceita todas as 188 da lista oficial. Referencia
 * pelo ícone porque é a chave estável: se a SPA revogar uma bet e ela sair de
 * CASAS_DE_APOSTA, o lookup abaixo simplesmente a ignora.
 */
const DESTAQUES = [
  "/casas/bet365.png",
  "/casas/betano.png",
  "/casas/superbet.png",
  "/casas/kto.png",
  "/casas/estrelabet.png",
  "/casas/betnacional.png",
  "/casas/sportingbet.png",
  "/casas/blaze.png",
  "/casas/stake.png",
  "/casas/vaidebet.png",
  "/casas/betfair.png",
  "/casas/novibet.png",
  "/casas/7games.png",
  "/casas/esportesdasorte.png",
  "/casas/br4.png",
  "/casas/betpix365.png",
  "/casas/jonbet.png",
  "/casas/pinnacle.png",
  "/casas/betsson.png",
  "/casas/lotogreen.png",
  "/casas/mcgames.png",
  "/casas/brazino777.png",
  "/casas/bullsbet.png",
  "/casas/apostaganha.png",
  "/casas/f12.png",
  "/casas/galera.png",
  "/casas/betmgm.png",
  "/casas/rivalo.png",
];

const CASAS_DESTAQUE = DESTAQUES.map((icone) =>
  CASAS_DE_APOSTA.find((casa) => casa.icone === icone),
).filter((casa): casa is NonNullable<typeof casa> => Boolean(casa));

const METADE = Math.ceil(CASAS_DESTAQUE.length / 2);
const LINHA_A = CASAS_DESTAQUE.slice(0, METADE);
const LINHA_B = CASAS_DESTAQUE.slice(METADE);

function Pastilha({ nome, icone }: { nome: string; icone: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/10 bg-neutral-900/70 px-4 py-2.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.9)]">
      <Image
        src={icone}
        alt=""
        width={24}
        height={24}
        unoptimized
        className="h-6 w-6 rounded object-contain"
      />
      <span className="whitespace-nowrap text-sm font-medium text-neutral-300">{nome}</span>
    </div>
  );
}

/** Uma faixa que rola sem fim: o conteúdo é duplicado e a animação anda -50%. */
function Faixa({
  casas,
  direcao,
}: {
  casas: typeof CASAS_DESTAQUE;
  direcao: "left" | "right";
}) {
  const conteudo = [...casas, ...casas];
  return (
    <div className="overflow-hidden">
      <div
        className={
          direcao === "left"
            ? "flex w-max gap-3 animate-marquee-left"
            : "flex w-max gap-3 animate-marquee-right"
        }
      >
        {conteudo.map((casa, i) => (
          <Pastilha key={`${casa.nome}-${i}`} nome={casa.nome} icone={casa.icone!} />
        ))}
      </div>
    </div>
  );
}

export function CasasMarquee() {
  return (
    <div className="scene-flat relative">
      {/* As duas faixas ficam num plano inclinado, como o painel de odds de uma
          casa visto de baixo. */}
      <div className="preserve-3d space-y-3 [transform:rotateX(26deg)_rotateZ(-1.5deg)]">
        <Faixa casas={LINHA_A} direcao="left" />
        <Faixa casas={LINHA_B} direcao="right" />
      </div>

      {/* Esfuma as pontas pra faixa nascer e morrer no escuro. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent sm:w-40" />
    </div>
  );
}
