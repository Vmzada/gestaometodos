# StakeFlow

Painel de gestão financeira para quem trabalha com método em casas de apostas: lançamentos por
casa de aposta e cliente, totais de hoje/semana/mês e calendário. Acesso por login (email/senha) e
assinatura mensal de R$ 14,99 via Mercado Pago.

Stack: Next.js (App Router) + Supabase (Postgres, Auth, RLS) + Mercado Pago (assinaturas).

## Configuração

### 1. Supabase
1. Crie um projeto em [supabase.com](https://supabase.com) (plano grátis serve).
2. Em **Project Settings > API**, copie a `Project URL`, a `anon public key` e a
   `service_role key`.
3. Em **SQL Editor**, rode o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Isso cria as tabelas `profiles` e `entries`, ativa Row Level Security (cada usuário só vê os
   próprios dados) e um trigger que cria o `profile` automaticamente no cadastro.
4. Em **Authentication > Emails**, confirme que a confirmação de email está ativada (é o padrão).

### 2. Mercado Pago
1. Crie uma conta em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers).
2. Em **Suas integrações > credenciais**, copie o `Access Token` (use as credenciais de teste
   primeiro, para simular assinaturas em sandbox).
3. Em **Suas integrações > Webhooks**, configure a URL `https://SEU_DOMINIO/api/mercadopago/webhook`
   para o evento `subscription_preapproval`, e copie a "assinatura secreta" gerada.

### 3. Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha com os valores acima:

```bash
cp .env.example .env.local
```

### 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> Para testar o webhook do Mercado Pago localmente, exponha a porta 3000 com um túnel (ex.:
> `ngrok http 3000`) e use essa URL pública ao configurar o webhook.

## Fluxo do app
1. `/cadastro` → cria conta (email + senha) → Supabase envia email de confirmação.
2. Link do email → `/auth/callback` → cria a sessão → redireciona para `/assinatura`.
3. `/assinatura` → botão "Assinar" cria uma assinatura recorrente no Mercado Pago e redireciona
   para o checkout.
4. Webhook do Mercado Pago (`/api/mercadopago/webhook`) atualiza `profiles.subscription_status`
   para `active` quando o pagamento é aprovado.
5. Com assinatura ativa, `/dashboard` fica liberado: lançamentos, totais e calendário
   (`/dashboard/calendario`).

O middleware (`src/middleware.ts`) protege as rotas: sem login → `/login`; logado mas sem
assinatura ativa → `/assinatura`; com assinatura ativa → acesso liberado ao `/dashboard`.
