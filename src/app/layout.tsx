import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Основной текст — системный стек Inter (.clinerules);
// дисплейный шрифт надписей — Space Grotesk, строгий геометрический гротеск (ТЗ раздел II.2).
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TensorLogix — цифровая инфраструктура под ключ",
  description:
    "IT-агентство полного цикла и B2B-платформа: Сайт + Telegram Mini App + Единая админка. Интеграции ЮKassa, Т-Банк, СДЭК. Интернет-маркетинг: SEO, контекстная реклама, продвижение.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900">{children}</body>
    </html>
  );
}
