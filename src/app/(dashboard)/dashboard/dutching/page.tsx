import { Card } from "@/components/ui/card";
import { DutchingCalculator } from "@/components/dutching-calculator";

export default function DutchingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Calculadora de Dutching
        </h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Distribua o valor entre as seleções com precisão matemática para um lucro uniforme,
          ganhe qual ganhar.
        </p>
      </div>

      <Card>
        <DutchingCalculator />
      </Card>
    </div>
  );
}
