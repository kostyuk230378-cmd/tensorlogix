import Image from "next/image";

/** Шапка сайта: лаконичный логотип в левом верхнем углу (ТЗ раздел II.1). */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
      <a href="/" aria-label="TensorLogix — на главную" className="flex items-center gap-3">
        <Image src="/logo.svg" alt="" width={34} height={34} priority />
        <span className="font-display text-[13px] font-semibold uppercase tracking-[0.32em] text-zinc-600">
          TensorLogix
        </span>
      </a>
    </header>
  );
}