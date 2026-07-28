"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { reconcilePayments } from "./actions";

export function ReconcileButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ checked: number; fixed: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await reconcilePayments();
        setResult(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao verificar pagamentos.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleClick} disabled={pending}>
        {pending ? "Verificando..." : "Verificar pagamentos no Mercado Pago"}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && !error && (
        <p className="text-xs text-neutral-400">
          {result.checked} sem acesso verificado{result.checked === 1 ? "" : "s"} contra pagamentos
          recentes.{" "}
          {result.fixed.length > 0
            ? `Liberado agora: ${result.fixed.join(", ")}.`
            : "Nenhum pagamento pendente encontrado."}
        </p>
      )}
    </div>
  );
}
