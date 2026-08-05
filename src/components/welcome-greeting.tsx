"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Cada lançamento registrado é um passo a mais no controle da sua banca. Bora manter a disciplina hoje.",
  "Gestão de banca é o que separa quem joga por sorte de quem joga por estratégia. Continue registrando tudo.",
  "Um dia de cada vez: anote seus lançamentos e deixe os números te mostrarem o caminho.",
  "A disciplina de hoje é o lucro de amanhã. Vamos organizar sua banca?",
  "Quem controla os números, controla o jogo. Bora dar uma olhada nos seus lançamentos.",
];

export function WelcomeGreeting({ userId, firstName }: { userId: string; firstName: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    const key = `welcome_seen_${userId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    setOpen(true);
  }, [userId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center shadow-2xl shadow-black/60">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-2xl">
          👋
        </div>
        <h2 className="text-xl font-semibold text-neutral-100">Olá, {firstName}!</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{message}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-6px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_28px_-4px_rgba(16,185,129,0.75)]"
        >
          Vamos organizar!
        </button>
      </div>
    </div>
  );
}
