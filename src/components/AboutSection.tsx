"use client";

import { useEffect, useRef } from "react";

const FIREFLY_MIN = 20;
const FIREFLY_MAX = 30;

function fireflyCount() {
  return Math.floor(FIREFLY_MIN + Math.random() * (FIREFLY_MAX - FIREFLY_MIN + 1));
}

type Firefly = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  size: number;
  hue: number;
  fadeDir: number;
  hiddenUntil: number;
  wanderAngle: number;
};

function createFirefly(w: number, h: number): Firefly {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    opacity: 0,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.012 + Math.random() * 0.02,
    size: 1.2 + Math.random() * 2.2,
    hue: 55 + Math.random() * 35,
    fadeDir: 1,
    hiddenUntil: 0,
    wanderAngle: Math.random() * Math.PI * 2,
  };
}

export default function AboutSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const rafRef = useRef<number>(0);
  const targetCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetCountRef.current === null) {
      targetCountRef.current = fireflyCount();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = targetCountRef.current ?? fireflyCount();
      while (firefliesRef.current.length < target) {
        firefliesRef.current.push(createFirefly(w, h));
      }
      if (firefliesRef.current.length > target) {
        firefliesRef.current.length = target;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const tick = (now: number) => {
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (const f of firefliesRef.current) {
        if (now < f.hiddenUntil) continue;

        f.wanderAngle += (Math.random() - 0.5) * 0.08;
        f.vx += Math.cos(f.wanderAngle) * 0.012;
        f.vy += Math.sin(f.wanderAngle) * 0.012;
        f.vx += (Math.random() - 0.5) * 0.04;
        f.vy += (Math.random() - 0.5) * 0.04;
        f.vx *= 0.985;
        f.vy *= 0.985;

        f.x += f.vx;
        f.y += f.vy;

        const margin = 40;
        if (f.x < -margin) f.x = w + margin;
        if (f.x > w + margin) f.x = -margin;
        if (f.y < -margin) f.y = h + margin;
        if (f.y > h + margin) f.y = -margin;

        f.pulse += f.pulseSpeed;
        const twinkle = 0.35 + Math.sin(f.pulse) * 0.28 + Math.sin(f.pulse * 2.3) * 0.12;

        if (f.opacity <= 0 && f.fadeDir < 0) {
          f.hiddenUntil = now + 400 + Math.random() * 2800;
          f.x = Math.random() * w;
          f.y = Math.random() * h;
          f.vx = (Math.random() - 0.5) * 0.25;
          f.vy = (Math.random() - 0.5) * 0.25;
          f.fadeDir = 1;
          continue;
        }

        if (now >= f.hiddenUntil) {
          if (f.opacity < 0.85 && f.fadeDir > 0) {
            f.opacity = Math.min(0.88, f.opacity + 0.008 + Math.random() * 0.006);
          }
          if (f.opacity >= 0.72 && Math.random() < 0.002) {
            f.fadeDir = -1;
          }
          if (f.fadeDir < 0) {
            f.opacity -= 0.012 + Math.random() * 0.01;
            if (f.opacity <= 0) {
              f.opacity = 0;
              continue;
            }
          }
        }

        const o = Math.max(0, Math.min(1, f.opacity * twinkle));
        if (o < 0.02) continue;

        const r = f.size * 4;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, `hsla(${f.hue}, 95%, 72%, ${o * 0.95})`);
        grad.addColorStop(0.25, `hsla(${f.hue}, 90%, 55%, ${o * 0.45})`);
        grad.addColorStop(0.55, `hsla(${f.hue}, 80%, 40%, ${o * 0.12})`);
        grad.addColorStop(1, "hsla(60, 80%, 50%, 0)");

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = `hsla(${f.hue}, 100%, 88%, ${o * 0.9})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="about-me"
      className="about-section relative h-dvh min-h-dvh w-full overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="about-section__bg" aria-hidden />
      <canvas
        ref={canvasRef}
        className="about-section__fireflies pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden
      />

      <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="about-section__eyebrow mb-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/40 sm:text-[11px]">
          About
        </p>
        <h2
          id="about-heading"
          className="about-section__title max-w-2xl text-3xl font-medium tracking-tight text-white/95 sm:text-4xl md:text-5xl"
        >
          Arghyadeep Midya
        </h2>
        <p className="about-section__lede mt-5 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base text-balance mx-auto">
          I am a wildlife photographer and naturalist dedicated to capturing the raw, untamed beauty of the natural world. 
          Drawn to patience and the delicate interplay of light, I strive to preserve the silent stories the wild tells 
          when no one is watching, inspiring a deeper connection with nature through my lens.
        </p>
      </div>
    </section>
  );
}
