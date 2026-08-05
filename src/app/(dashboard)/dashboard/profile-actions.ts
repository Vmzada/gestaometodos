"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Profiles is otherwise read-only from the browser (see migration 0006 — RLS
// was tightened after the trial-reset issue), so this writes through the
// admin client, scoped to exactly this field, after confirming the caller's
// own session-derived user id. Mirrors updateGoals/updateBanca.
export async function updateFullName(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) throw new Error("Informe um nome.");

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
