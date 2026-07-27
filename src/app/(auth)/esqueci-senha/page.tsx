"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EsqueciSenhaPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {
    error: null,
    sent: false,
  });

  if (state.sent) {
    return (
      <Card className="text-center">
        <h1 className="mb-3 text-2xl font-semibold text-neutral-100">Verifique seu email</h1>
        <p className="text-sm text-neutral-400">
          Se esse email estiver cadastrado, enviamos um link para você redefinir sua senha.
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
          Voltar para o login
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-2 text-center text-2xl font-semibold text-neutral-100">
        Esqueci minha senha
      </h1>
      <p className="mb-6 text-center text-sm text-neutral-400">
        Informe seu email e enviaremos um link para redefinir sua senha.
      </p>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-400">
        <Link href="/login" className="text-emerald-400 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </Card>
  );
}
