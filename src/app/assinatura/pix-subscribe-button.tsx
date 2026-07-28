"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "form" | "loading" | "qr" | "confirmed" | "error";

export function PixSubscribeButton() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleGenerate() {
    setError(null);
    setStep("loading");
    try {
      const res = await fetch("/api/mercadopago/create-pix-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });
      const data = await res.json();
      if (!res.ok || !data.qrCode) {
        throw new Error(data.error ?? "Falha ao gerar o Pix.");
      }
      setQrCode(data.qrCode);
      setQrCodeBase64(data.qrCodeBase64);
      setStep("qr");

      pollRef.current = setInterval(async () => {
        const statusRes = await fetch(
          `/api/mercadopago/subscription-status?paymentId=${data.paymentId}`,
        );
        const statusData = await statusRes.json();
        if (statusData.active) {
          if (pollRef.current) clearInterval(pollRef.current);
          setStep("confirmed");
          setTimeout(() => router.push("/dashboard"), 1500);
        }
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar o Pix.");
      setStep("error");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === "confirmed") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="mt-3 font-medium text-emerald-400">Pagamento confirmado!</p>
        <p className="mt-1 text-xs text-neutral-400">Liberando sua planilha...</p>
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URI, next/image can't optimize it */}
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR code Pix"
          className="mx-auto h-48 w-48 rounded-md bg-white p-2"
        />
        <p className="mt-3 text-xs text-neutral-400">
          Escaneie o QR code ou copie o código abaixo no app do seu banco.
        </p>
        <Button variant="secondary" className="mt-3 w-full" onClick={handleCopy}>
          {copied ? "Copiado!" : "Copiar código Pix"}
        </Button>
        <p className="mt-3 text-xs text-neutral-500">
          Aguardando confirmação do pagamento... isso libera o acesso automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div>
      {step === "form" && (
        <div className="space-y-2 text-left">
          <Label htmlFor="pix-cpf">CPF (necessário para gerar o Pix)</Label>
          <Input
            id="pix-cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </div>
      )}
      <Button
        variant="secondary"
        className="mt-2 w-full"
        onClick={handleGenerate}
        disabled={step === "loading"}
      >
        {step === "loading" ? "Gerando QR code..." : "Pagar com Pix"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
