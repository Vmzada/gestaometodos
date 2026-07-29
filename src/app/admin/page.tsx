import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { isTrialActive } from "@/lib/subscription";
import { daysUntil } from "@/lib/date-helpers";
import { Navbar } from "@/components/navbar";
import { ReconcileButton } from "./reconcile-button";

export const dynamic = "force-dynamic";

function formatPhone(digits: string) {
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Status = "Pago" | "Em teste" | "Sem acesso";

const STATUS_CLASSES: Record<Status, string> = {
  Pago: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Em teste": "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "Sem acesso": "border-neutral-700 bg-neutral-800/60 text-neutral-400",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select(
      "id, email, full_name, phone, subscription_status, subscription_expires_at, trial_started_at, mp_subscription_id, last_payment_at, created_at",
    )
    .order("created_at", { ascending: false });

  const rows = (profiles ?? []).map((p) => {
    const daysLeft = p.subscription_expires_at ? daysUntil(p.subscription_expires_at) : null;
    const active = p.subscription_status === "active" && (daysLeft === null || daysLeft > 0);

    let status: Status;
    if (active) status = "Pago";
    else if (isTrialActive(p)) status = "Em teste";
    else status = "Sem acesso";

    return { ...p, daysLeft, status };
  });

  const paidCount = rows.filter((r) => r.status === "Pago").length;
  const expiringCount = rows.filter(
    (r) => r.status === "Pago" && r.daysLeft !== null && r.daysLeft <= 5,
  ).length;

  return (
    <div className="bg-mesh relative min-h-screen bg-neutral-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">Clientes</h1>
            <p className="mt-1 text-sm text-neutral-400">
              {paidCount} pago{paidCount === 1 ? "" : "s"} · {expiringCount} expirando em até 5 dias ·{" "}
              {rows.length} cadastro{rows.length === 1 ? "" : "s"} no total
            </p>
          </div>
          <ReconcileButton />
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50 text-left text-neutral-400">
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Nome</th>
                <th className="px-3 py-2 font-medium">WhatsApp</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Dias restantes</th>
                <th className="px-3 py-2 font-medium">Vence em</th>
                <th className="px-3 py-2 font-medium">Cadastro</th>
                <th className="px-3 py-2 font-medium">Data do pagamento</th>
                <th className="px-3 py-2 font-medium">Pagamento MP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-neutral-900 text-neutral-200 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2 text-neutral-400">{r.full_name ?? "—"}</td>
                  <td className="px-3 py-2 text-neutral-400">
                    {r.phone ? formatPhone(r.phone) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {r.status === "Pago" && r.daysLeft !== null ? r.daysLeft : "—"}
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    {r.subscription_expires_at ? formatDateTime(r.subscription_expires_at) : "—"}
                  </td>
                  <td className="px-3 py-2 text-neutral-400">{formatDateTime(r.created_at)}</td>
                  <td className="px-3 py-2 text-neutral-400">
                    {r.last_payment_at ? formatDateTime(r.last_payment_at) : "—"}
                  </td>
                  <td className="px-3 py-2 text-neutral-500">{r.mp_subscription_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
