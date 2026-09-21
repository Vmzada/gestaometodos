import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Um lançamento do painel, desenhado como bilhete de aposta.
 *
 * Os três campos do meio vêm de fora porque cada mercado tem os seus: delay e
 * erro giram em torno de odd e valor, método é depósito/saque/CPA e rodadas
 * grátis não tem odd nenhuma. Mostrar "Odd" num giro promocional seria mentira.
 */
export type SlipCell = { label: string; value: string; green?: boolean };

export type Slip = {
  casa: string;
  logo: string;
  mercado: string;
  linha: string;
  cells: [SlipCell, SlipCell, SlipCell];
  clienteNome: string;
  clienteParte: string;
};

export function BetSlip({ slip, className }: { slip: Slip; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-neutral-900/90 backdrop-blur-md",
        "shadow-[0_40px_90px_-20px_rgba(16,185,129,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        className,
      )}
    >
      {/* Reflexo atravessando o cartão. pointer-events-none pra não roubar o hover do tilt. */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen" />

      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
        <Image
          src={slip.logo}
          alt=""
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 rounded-md object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-100">{slip.casa}</p>
          <p className="truncate text-[11px] text-neutral-500">{slip.mercado}</p>
        </div>
        <span className="shrink-0 animate-pulse-green rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
          GREEN
        </span>
      </div>

      <div className="px-4 py-3">
        <p className="truncate text-sm font-medium text-neutral-200">{slip.linha}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {slip.cells.map((cell) => (
            <div key={cell.label} className="rounded-lg border border-white/5 bg-white/[0.03] py-2">
              <p className="text-[10px] uppercase tracking-wide text-neutral-500">{cell.label}</p>
              <p
                className={cn(
                  "mt-0.5 text-sm font-bold",
                  cell.green ? "text-emerald-400" : "text-neutral-100",
                )}
              >
                {cell.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recorte de canhoto: a linha tracejada com as duas "mordidas" nas pontas. */}
      <div className="relative border-t border-dashed border-white/15">
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-neutral-950" />
        <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-neutral-950" />
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-neutral-500">Parte do cliente</p>
            <p className="truncate text-sm font-medium text-neutral-200">{slip.clienteNome}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-base font-bold text-emerald-400 ring-1 ring-emerald-400/25">
            {slip.clienteParte}
          </span>
        </div>
      </div>
    </div>
  );
}
