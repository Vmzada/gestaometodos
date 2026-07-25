import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-neutral-950/70 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold tracking-tight text-neutral-100">StakeFlow</span>
        <Link
          href="/dashboard"
          className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
        >
          Lançamentos
        </Link>
        <Link
          href="/dashboard/calendario"
          className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
        >
          Calendário
        </Link>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="ghost">
          Sair
        </Button>
      </form>
    </nav>
  );
}
