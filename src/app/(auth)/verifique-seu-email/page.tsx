import { Card } from "@/components/ui/card";

export default function VerifiqueSeuEmailPage() {
  return (
    <Card className="text-center">
      <h1 className="mb-3 text-2xl font-semibold text-neutral-100">Confirme seu email</h1>
      <p className="text-sm text-neutral-400">
        Enviamos um link de confirmação para o seu email. Clique nele para ativar sua conta e
        continuar para a assinatura.
      </p>
    </Card>
  );
}
