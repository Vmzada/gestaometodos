"use client";

import { useRef, useState, useTransition } from "react";
import { createDelayEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GreenRedToggle } from "@/components/ui/green-red-toggle";
import { DatePicker, type DatePickerHandle } from "@/components/ui/date-picker";
import { formatBRL, todayISO } from "@/lib/date-helpers";

export function DelayEntryForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [odd, setOdd] = useState(0);
  const [valor, setValor] = useState(0);
  const [resultado, setResultado] = useState<"green" | "red">("green");
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<DatePickerHandle>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createDelayEntry({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
      dateRef.current?.reset();
      setOdd(0);
      setValor(0);
      setResultado("green");
    });
  }

  const lucro = resultado === "red" ? -valor : valor * (odd - 1);

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-7">
      <div>
        <Label htmlFor="delay_entry_date">Data</Label>
        <DatePicker
          ref={dateRef}
          id="delay_entry_date"
          name="entry_date"
          defaultValue={todayISO()}
          required
        />
      </div>
      <div>
        <Label htmlFor="delay_casa_aposta">Casa de aposta</Label>
        <Input id="delay_casa_aposta" name="casa_aposta" placeholder="Ex: Bet365" required />
      </div>
      <div>
        <Label>Resultado</Label>
        <GreenRedToggle value={resultado} onChange={setResultado} />
      </div>
      <div>
        <Label htmlFor="odd">Odd</Label>
        <Input
          id="odd"
          name="odd"
          type="number"
          step="0.01"
          min="1.01"
          defaultValue="0"
          required
          onChange={(e) => setOdd(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="valor">Valor (R$)</Label>
        <Input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          defaultValue="0"
          required
          onChange={(e) => setValor(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="delay_cliente_nome">Cliente (opcional)</Label>
        <Input id="delay_cliente_nome" name="cliente_nome" placeholder="Nome do cliente" />
      </div>
      <div>
        <Label htmlFor="delay_cliente_parte">Parte do cliente (R$)</Label>
        <Input id="delay_cliente_parte" name="cliente_parte" type="number" step="0.01" defaultValue="0" />
      </div>
      <div className="col-span-2 flex items-end justify-between gap-4 sm:col-span-7">
        <p className="text-sm text-neutral-400">
          Lucro calculado:{" "}
          <span className={lucro >= 0 ? "font-medium text-emerald-400" : "font-medium text-red-400"}>
            {formatBRL(lucro)}
          </span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-7">
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar lançamento"}
        </Button>
      </div>
    </form>
  );
}
