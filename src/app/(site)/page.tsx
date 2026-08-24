import { DigitalRain } from "@/components/matrix/DigitalRain";
import { Hero } from "@/components/hero/Hero";

/**
 * Главная страница (тикет UI-01):
 * цифровой дождь на белом (LIGHT MATRIX) + монументальный заголовок.
 */
export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <DigitalRain className="absolute inset-0 z-0 h-full w-full" />
      <Hero />
    </main>
  );
}