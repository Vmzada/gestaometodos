"use client";

import { useRef, useTransition, useState } from "react";
import { createGasto } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker, type DatePickerHandle } from "@/components/ui/date-picker";
import { todayISO } from "@/lib/date-helpers";

const CATEGORIAS_SUGERIDAS = ["Água", "Luz", "Internet", "Mercado", "Aluguel", "Transporte", "Outros"];

export function GastoForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<DatePickerHandle>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createGasto({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
      dateRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <div>
        <Label htmlFor="gasto_date">Data</Label>
        <DatePicker ref={dateRef} id="gasto_date" name="gasto_date" defaultValue={todayISO()} required />
      </div>
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Input
          id="categoria"
          name="categoria"
          placeholder="Ex: Água, Luz, Mercado"
          list="categorias-gasto"
          required
        />
        <datalist id="categorias-gasto">
          {CATEGORIAS_SUGERIDAS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <Label htmlFor="valor">Valor (R$)</Label>
        <Input id="valor" name="valor" type="number" step="0.01" defaultValue="0" required />
      </div>
      <div className="col-span-2 sm:col-span-2">
        <Label htmlFor="descricao">Descrição — opcional</Label>
        <Input id="descricao" name="descricao" placeholder="Detalhes do gasto" />
      </div>
      <div className="col-span-2 flex items-end sm:col-span-5">
        {error && <p className="mb-2 mr-4 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar gasto"}
        </Button>
      </div>
    </form>
  );
}
