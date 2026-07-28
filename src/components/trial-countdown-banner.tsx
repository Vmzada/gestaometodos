"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TrialCountdownBanner({ endsAt }: { endsAt: string }) {
  const router = useRouter();
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      const next = new Date(endsAt).getTime() - Date.now();
      setRemainingMs(next);
      if (next <= 0) {
        router.push("/assinatura");
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, router]);

  if (remainingMs === null || remainingMs <= 0) return null;

  const totalSeconds = Math.floor(remainingMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 px-6 py-2 text-center text-sm text-amber-300">
      Teste grátis: acesso completo por mais{" "}
      <span className="font-mono font-semibold tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>{" "}
      —{" "}
      <Link href="/assinatura" className="font-medium underline">
        Assinar agora
      </Link>
    </div>
  );
}
