"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "0123456789";
const FONT_SIZE = 14;
// Светлые/серые/стальные тона дорожек (LIGHT MATRIX, DESIGN.md §1)
const PALETTE = ["#9aa7b8", "#b6c2d1", "#c9d3de", "#dfe6ee"];

/**
 * «Цифровой дождь» строго на белом фоне: светло-серые дорожки цифр,
 * медленно стекающие вниз. Уважает prefers-reduced-motion (статичный кадр).
 */
export function DigitalRain({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      cols = Math.ceil(w / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
    };

    const drawFrame = (speed: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Полупрозрачный белый слой — хвосты плавно растворяются в белом
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${FONT_SIZE}px "Space Grotesk", ui-monospace, monospace`;
      for (let i = 0; i < cols; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = PALETTE[i % PALETTE.length];
        ctx.fillText(glyph, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > h && Math.random() > 0.976) drops[i] = 0;
        drops[i] += speed;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      for (let i = 0; i < 24; i++) drawFrame(1);
    } else {
      const loop = () => {
        drawFrame(0.55);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}