"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mercadopago/create-subscription", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? "Falha ao iniciar assinatura.");
      }
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao iniciar assinatura.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button className="w-full" onClick={handleClick} disabled={loading}>
        {loading ? "Redirecionando..." : "Assinar por R$ 14,99/mês"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
