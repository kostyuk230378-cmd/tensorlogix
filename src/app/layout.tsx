import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@/lib/tensorlogix-ui/styles.css";

// Основной текст — системный стек Inter (.clinerules);
// дисплей/бренд — Space Grotesk (ТЗ v2.0, DESIGN.md §2).
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TensorLogix — умные сайты и Telegram Mini Apps с ИИ-логикой",
  description:
    "IT-агентство полного цикла и B2B-платформа: сайты, TMA, единый терминал управления, интеллектуальная автоматизация, digital SMM. Open-source скилл @tensorlogix/ui-core (MIT).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#04060b] text-zinc-200">{children}</body>
    </html>
  );
}
