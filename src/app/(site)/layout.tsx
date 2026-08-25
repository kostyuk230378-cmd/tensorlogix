import { Header } from "@/components/layout/Header";

/** Каркас публичного сайта (роут-группа (site)), DEEP DARK v2.0. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[#04060b] text-zinc-200">
      <Header />
      {children}
    </div>
  );
}