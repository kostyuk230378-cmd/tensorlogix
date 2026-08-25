"use client";

import { useEffect, useRef } from "react";

/**
 * @tensorlogix/ui-core — MIT (c) 2026 TensorLogix.
 * Плавно вращающаяся прозрачная удлинённая бипирамида со светящимися
 * нейронными связями внутри. Чистый Canvas 2D + 3D-проекция, ноль зависимостей.
 * Реагирует на наведение курсора: скорость вращения и интенсивность свечения.
 * Уважает prefers-reduced-motion (статичный кадр).
 */

const TAU = Math.PI * 2;

interface V3 {
  x: number;
  y: number;
  z: number;
}
interface Link {
  a: number;
  b: number;
  phase: number;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGeometry() {
  const H = 1.55; // полувысота удлинённой бипирамиды
  const R = 0.62; // радиус «пояса»
  const verts: V3[] = [
    { x: 0, y: -H, z: 0 },
    { x: 0, y: H, z: 0 },
    { x: R, y: 0, z: R },
    { x: -R, y: 0, z: R },
    { x: -R, y: 0, z: -R },
    { x: R, y: 0, z: -R },
  ];
  const edges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 3], [3, 4], [4, 5], [5, 2],
  ];
  const faces: [number, number, number][] = [
    [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2],
    [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5],
  ];
  const rnd = mulberry32(42);
  const nodes: V3[] = [];
  while (nodes.length < 26) {
    const y = (rnd() * 2 - 1) * H * 0.82;
    const rAt = R * (1 - Math.abs(y) / H) * 0.85;
    const a = rnd() * TAU;
    const r = Math.sqrt(rnd()) * rAt;
    nodes.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
  }
  const links: Link[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(
        nodes[i].x - nodes[j].x,
        nodes[i].y - nodes[j].y,
        nodes[i].z - nodes[j].z
      );
      if (d < 0.62) links.push({ a: i, b: j, phase: rnd() * TAU });
    }
  }
  return { verts, edges, faces, nodes, links };
}

export function BipyramidCore({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const geo = buildGeometry();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let angle = 0.6;
    let hover = 0;
    let target = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      target = Math.max(0, 1 - d / (Math.min(r.width, r.height) * 0.6));
    };
    const onLeave = () => {
      target = 0;
    };

    const project = (
      p: V3,
      c: number,
      s: number,
      ct: number,
      st: number,
      scale: number
    ) => {
      const x1 = p.x * c + p.z * s;
      const z1 = -p.x * s + p.z * c;
      const y1 = p.y * ct - z1 * st;
      const z2 = p.y * st + z1 * ct;
      const f = 3.2 / (3.2 + z2);
      return { x: w / 2 + x1 * f * scale, y: h / 2 + y1 * f * scale, f };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) * 0.3;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const ct = Math.cos(-0.3);
      const st = Math.sin(-0.3);
      const glow = 8 + hover * 20;

      const pv = geo.verts.map((v) => project(v, c, s, ct, st, scale));

      // Прозрачные грани: верх — зелёный, низ — синий
      geo.faces.forEach(([a, b, d], i) => {
        ctx.beginPath();
        ctx.moveTo(pv[a].x, pv[a].y);
        ctx.lineTo(pv[b].x, pv[b].y);
        ctx.lineTo(pv[d].x, pv[d].y);
        ctx.closePath();
        ctx.fillStyle =
          i < 4
            ? `rgba(34,206,113,${0.04 + hover * 0.05})`
            : `rgba(14,165,233,${0.04 + hover * 0.05})`;
        ctx.fill();
      });

      // Нейронные связи внутри объёма
      const pn = geo.nodes.map((v) => project(v, c, s, ct, st, scale));
      for (const l of geo.links) {
        const pulse = 0.5 + 0.5 * Math.sin(t / 700 + l.phase);
        ctx.strokeStyle = `rgba(125,211,252,${0.08 + 0.22 * pulse + hover * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pn[l.a].x, pn[l.a].y);
        ctx.lineTo(pn[l.b].x, pn[l.b].y);
        ctx.stroke();
      }

      // Бегущие импульсы и узлы нейросети
      ctx.save();
      ctx.shadowBlur = glow * 0.6;
      geo.links.forEach((l, i) => {
        if (i % 3 !== 0) return;
        const k = (t / 1400 + l.phase / TAU) % 1;
        const x = pn[l.a].x + (pn[l.b].x - pn[l.a].x) * k;
        const y = pn[l.a].y + (pn[l.b].y - pn[l.a].y) * k;
        ctx.shadowColor = "rgba(34,206,113,0.9)";
        ctx.fillStyle = "rgba(209,250,229,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, 1.6 + hover * 1.2, 0, TAU);
        ctx.fill();
      });
      for (const p of pn) {
        ctx.shadowColor = "rgba(14,165,233,0.8)";
        ctx.fillStyle = "rgba(224,242,254,0.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4 + hover, 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      // Светящиеся рёбра бипирамиды (зелёно-синий градиент бренда)
      ctx.save();
      ctx.shadowBlur = glow;
      for (const [a, b] of geo.edges) {
        const grad = ctx.createLinearGradient(pv[a].x, pv[a].y, pv[b].x, pv[b].y);
        grad.addColorStop(0, "rgba(34,206,113,0.85)");
        grad.addColorStop(1, "rgba(14,165,233,0.85)");
        ctx.shadowColor = "rgba(34,206,113,0.55)";
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 + hover * 0.8;
        ctx.beginPath();
        ctx.moveTo(pv[a].x, pv[a].y);
        ctx.lineTo(pv[b].x, pv[b].y);
        ctx.stroke();
      }
      ctx.restore();
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    if (reduced) {
      draw(1200);
    } else {
      const loop = (t: number) => {
        hover += (target - hover) * 0.06;
        angle += 0.0035 + hover * 0.012;
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
