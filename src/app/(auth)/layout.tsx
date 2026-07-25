import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-mesh relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative flex w-full flex-col items-center">
        <Link href="/" className="mb-8 text-xl font-semibold tracking-tight text-neutral-100">
          StakeFlow
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
