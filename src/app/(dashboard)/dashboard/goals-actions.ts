"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function parseGoal(raw: FormDataEntryValue | null) {
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  if (Number.isNaN(value) || value < 0) {
    throw new Error("Meta inválida.");
  }
  return value;
}

// Profiles is otherwise read-only from the browser (see migration 0006 — RLS
// was tightened after the trial-reset issue), so this writes through the
// admin client, scoped to exactly the two goal fields, after confirming the
// caller's own session-derived user id.
export async function updateGoals(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const meta_semanal = parseGoal(formData.get("meta_semanal"));
  const meta_mensal = parseGoal(formData.get("meta_mensal"));

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ meta_semanal, meta_mensal }).eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function updateBanca(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const banca_inicial = parseGoal(formData.get("banca_inicial"));

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ banca_inicial }).eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
