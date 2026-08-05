"use client";

import { useEffect, useState, useTransition } from "react";
import { updateFullName } from "@/app/(dashboard)/dashboard/profile-actions";

const MESSAGES = [
  "Cada lançamento registrado é um passo a mais no controle da sua banca. Bora manter a disciplina hoje.",
  "Gestão de banca é o que separa quem joga por sorte de quem joga por estratégia. Continue registrando tudo.",
  "Um dia de cada vez: anote seus lançamentos e deixe os números te mostrarem o caminho.",
  "A disciplina de hoje é o lucro de amanhã. Vamos organizar sua banca?",
  "Quem controla os números, controla o jogo. Bora dar uma olhada nos seus lançamentos.",
];

export function WelcomeGreeting({
  userId,
  firstName: initialFirstName,
}: {
  userId: string;
  firstName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"name" | "greeting">(initialFirstName ? "greeting" : "name");
  const [firstName, setFirstName] = useState(initialFirstName);
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const key = `welcome_seen_${userId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    setOpen(true);
  }, [userId]);

  if (!open) return null;

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError("Digite seu nome.");
      return;
    }
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("full_name", trimmed);
        await updateFullName(formData);
        setFirstName(trimmed.split(/\s+/)[0]);
        setError(null);
        setStep("greeting");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível salvar.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center shadow-2xl shadow-black/60">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-2xl">
          {step === "name" ? "😊" : "👋"}
        </div>

        {step === "name" ? (
          <>
            <h2 className="text-xl font-semibold text-neutral-100">Como você quer ser chamado?</h2>
            <p className="mt-2 text-sm text-neutral-400">Só pra gente te chamar pelo nome por aqui.</p>
            <form onSubmit={handleSaveName} className="mt-4 space-y-3">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-md border border-white/10 bg-neutral-800/80 px-3 py-2 text-center text-sm text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-6px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_28px_-4px_rgba(16,185,129,0.75)] disabled:opacity-60"
              >
                {pending ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                Agora não
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-neutral-100">Olá, {firstName}!</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{message}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-6px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_28px_-4px_rgba(16,185,129,0.75)]"
            >
              Vamos organizar!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
