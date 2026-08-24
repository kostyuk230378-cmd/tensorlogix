import { Header } from "@/components/layout/Header";

/** Каркас публичного сайта (роут-группа (site)). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-white text-zinc-900">
      <Header />
      {children}
    </div>
  );
}