"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePassword } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

export default function RedefinirSenhaPage() {
  const [state, formAction, pending] = useActionState(updatePassword, { error: null });
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    // Recovery links from Supabase can arrive either via the PKCE `?code=` flow
    // (already exchanged for a session server-side in /auth/callback) or via
    // the implicit flow, which puts the tokens in the URL fragment instead —
    // fragments never reach the server, so we have to pick them up here.
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        const supabase = createClient();
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (error) setSessionError("Link inválido ou expirado. Solicite um novo.");
          window.history.replaceState(null, "", window.location.pathname);
          setReady(true);
        });
        return;
      }
    }
    // No fragment tokens to process — this branch only runs once on mount to
    // read `window.location`, which isn't available during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <Card className="text-center">
        <p className="text-sm text-neutral-400">Carregando...</p>
      </Card>
    );
  }

  if (sessionError) {
    return (
      <Card className="text-center">
        <h1 className="mb-3 text-2xl font-semibold text-neutral-100">Link inválido</h1>
        <p className="text-sm text-neutral-400">{sessionError}</p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-2 text-center text-2xl font-semibold text-neutral-100">Nova senha</h1>
      <p className="mb-6 text-center text-sm text-neutral-400">
        Escolha uma nova senha para sua conta.
      </p>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="password">Nova senha</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </Card>
  );
}
