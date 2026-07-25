"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(signUp, { error: null });

  return (
    <Card>
      <h1 className="mb-6 text-center text-2xl font-semibold text-neutral-100">Criar conta</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-400">
        Já tem conta?{" "}
        <Link href="/login" className="text-emerald-400 hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
