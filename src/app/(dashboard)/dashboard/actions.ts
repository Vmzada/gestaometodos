"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

function parseEntryFields(formData: FormData) {
  const entry_date = String(formData.get("entry_date") ?? "");
  const casa_aposta = String(formData.get("casa_aposta") ?? "").trim();
  const cliente_nome = String(formData.get("cliente_nome") ?? "").trim();
  const cliente_parte = Number(formData.get("cliente_parte"));
  const deposito = Number(formData.get("deposito"));
  const saque = Number(formData.get("saque"));

  if (
    !entry_date ||
    !casa_aposta ||
    !cliente_nome ||
    Number.isNaN(cliente_parte) ||
    Number.isNaN(deposito) ||
    Number.isNaN(saque)
  ) {
    return null;
  }

  const lucro = saque - deposito;

  return { entry_date, casa_aposta, cliente_nome, cliente_parte, deposito, saque, lucro };
}

function parseDelayEntryFields(formData: FormData) {
  const entry_date = String(formData.get("entry_date") ?? "");
  const casa_aposta = String(formData.get("casa_aposta") ?? "").trim();
  const odd = Number(formData.get("odd"));
  const valor = Number(formData.get("valor"));
  const cliente_nome = String(formData.get("cliente_nome") ?? "").trim();
  const cliente_parte_raw = formData.get("cliente_parte");
  const cliente_parte = cliente_parte_raw ? Number(cliente_parte_raw) : 0;

  if (
    !entry_date ||
    !casa_aposta ||
    Number.isNaN(odd) ||
    odd <= 0 ||
    Number.isNaN(valor) ||
    Number.isNaN(cliente_parte)
  ) {
    return null;
  }

  const lucro = valor * (odd - 1);

  return {
    entry_date,
    casa_aposta,
    odd,
    valor,
    cliente_nome: cliente_nome || null,
    cliente_parte,
    lucro,
  };
}

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calendario");
}

type FormState = { error: string | null };

export async function createEntry(_prevState: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const fields = parseEntryFields(formData);
  if (!fields) return { error: "Preencha todos os campos corretamente." };

  const { error } = await supabase.from("entries").insert({ user_id: user.id, ...fields });
  if (error) return { error: error.message };

  revalidateDashboard();
  return { error: null };
}

export async function updateEntry(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const fields = parseEntryFields(formData);
  if (!fields) throw new Error("Preencha todos os campos corretamente.");

  const { error } = await supabase.from("entries").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDashboard();
}

export async function deleteEntry(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDashboard();
}

export async function createDelayEntry(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const fields = parseDelayEntryFields(formData);
  if (!fields) return { error: "Preencha todos os campos corretamente." };

  const { error } = await supabase.from("delay_entries").insert({ user_id: user.id, ...fields });
  if (error) return { error: error.message };

  revalidateDashboard();
  return { error: null };
}

export async function updateDelayEntry(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const fields = parseDelayEntryFields(formData);
  if (!fields) throw new Error("Preencha todos os campos corretamente.");

  const { error } = await supabase.from("delay_entries").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDashboard();
}

export async function deleteDelayEntry(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("delay_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDashboard();
}
