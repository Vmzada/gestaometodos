"use client";

import { useRef, useState, useTransition } from "react";
import { createDelayEntry, createErroEntry } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GreenRedToggle } from "@/components/ui/green-red-toggle";
import { DatePicker, type DatePickerHandle } from "@/components/ui/date-picker";
import { formatBRL, todayISO } from "@/lib/date-helpers";
import type { Mercado } from "@/lib/mercados";

const CREATE_ACTION = {
  delay: createDelayEntry,
  erro: createErroEntry,
};

/**
 * Formulário de lançamento dos mercados esportivos (delay e erro). Os dois têm
 * os mesmos campos e a mesma fórmula de lucro — só mudam a tabela de destino e
 * os ids dos campos.
 */
export function MarketEntryForm({ mercado }: { mercado: Mercado }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [odd, setOdd] = useState(0);
  const [valor, setValor] = useState(0);
  const [clienteParte, setClienteParte] = useState(0);
  const [resultado, setResultado] = useState<"green" | "red">("green");
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<DatePickerHandle>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await CREATE_ACTION[mercado]({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
      dateRef.current?.reset();
      setOdd(0);
      setValor(0);
      setClienteParte(0);
      setResultado("green");
    });
  }

  const lucro = (resultado === "red" ? -valor : valor * (odd - 1)) - clienteParte;

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-7">
      <div>
        <Label htmlFor={`${mercado}_entry_date`}>Data</Label>
        <DatePicker
          ref={dateRef}
          id={`${mercado}_entry_date`}
          name="entry_date"
          defaultValue={todayISO()}
          required
        />
      </div>
      <div>
        <Label htmlFor={`${mercado}_casa_aposta`}>Casa de aposta</Label>
        <Input
          id={`${mercado}_casa_aposta`}
          name="casa_aposta"
          placeholder="Ex: Bet365"
          required
        />
      </div>
      <div>
        <Label>Resultado</Label>
        <GreenRedToggle value={resultado} onChange={setResultado} />
      </div>
      <div>
        <Label htmlFor={`${mercado}_odd`}>Odd</Label>
        <Input
          id={`${mercado}_odd`}
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
        <Label htmlFor={`${mercado}_valor`}>Valor (R$)</Label>
        <Input
          id={`${mercado}_valor`}
          name="valor"
          type="number"
          step="0.01"
          defaultValue="0"
          required
          onChange={(e) => setValor(Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor={`${mercado}_cliente_nome`}>Cliente (opcional)</Label>
        <Input id={`${mercado}_cliente_nome`} name="cliente_nome" placeholder="Nome do cliente" />
      </div>
      <div>
        <Label htmlFor={`${mercado}_cliente_parte`}>Parte do cliente (R$)</Label>
        <Input
          id={`${mercado}_cliente_parte`}
          name="cliente_parte"
          type="number"
          step="0.01"
          defaultValue="0"
          onChange={(e) => setClienteParte(Number(e.target.value) || 0)}
        />
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
