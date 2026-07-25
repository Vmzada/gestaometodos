import { Navbar } from "@/components/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-mesh relative min-h-screen bg-neutral-950">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
