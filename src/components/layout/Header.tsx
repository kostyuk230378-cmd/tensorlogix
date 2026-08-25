import Image from "next/image";
import Link from "next/link";

/**
 * Блок 0 — фирменный хедер (ТЗ v2.0 §2): оригинальный логотип и словознак
 * ОДИНАКОВОЙ высоты = 5 строк базового текста (≈80px desktop / 48px mobile).
 */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-6 py-6 sm:px-10">
      <Link href="/" aria-label="TensorLogix — на главную" className="flex items-center gap-4">
        <Image
          src="/images/logo-mark.svg"
          alt="Логотип TensorLogix"
          width={668}
          height={510}
          className="h-12 w-auto sm:h-20"
          priority
        />
        <span className="tlx-chrome font-display text-[22px] leading-none font-bold tracking-[0.14em] uppercase sm:text-[64px] sm:tracking-[0.18em]">
          TensorLogix
        </span>
      </Link>
    </header>
  );
}
