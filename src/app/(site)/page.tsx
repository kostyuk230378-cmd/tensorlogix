import { Hero } from "@/components/landing/Hero";
import { EcosystemHub } from "@/components/landing/EcosystemHub";
import { Calculator } from "@/components/calculator/Calculator";
import { Footer } from "@/components/landing/Footer";

/** Главная страница v2.0 (DEEP DARK): блоки 1–4 (ТЗ v2.0). */
export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-clip">
      <Hero />
      <EcosystemHub />
      <Calculator />
      <Footer />
    </main>
  );
}