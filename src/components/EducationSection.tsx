"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/* ── Firefly types + helpers (same as AboutSection) ── */
const FIREFLY_MIN = 18;
const FIREFLY_MAX = 26;

type Firefly = {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number; pulse: number; pulseSpeed: number;
  size: number; hue: number; fadeDir: number;
  hiddenUntil: number; wanderAngle: number;
};

function fireflyCount() {
  return Math.floor(FIREFLY_MIN + Math.random() * (FIREFLY_MAX - FIREFLY_MIN + 1));
}

function createFirefly(w: number, h: number): Firefly {
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    opacity: 0, pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.012 + Math.random() * 0.02,
    size: 1.2 + Math.random() * 2.2,
    hue: 55 + Math.random() * 35,
    fadeDir: 1, hiddenUntil: 0,
    wanderAngle: Math.random() * Math.PI * 2,
  };
}

/* ── Data ── */
const EDUCATION = [
  {
    id: "btech",
    institution: "University Institute of Technology, Burdwan University",
    location: "Burdwan, West Bengal",
    degree: "Bachelor of Technology in Information Technology",
    period: "July 2020 – June 2024",
    result: { label: "Cumulative GPA", value: "7.9 / 10.0" },
  },
  {
    id: "hs",
    institution: "Debra Harimati Saraswat Vidyamandir",
    location: "Paschim Medinipur, West Bengal",
    degree: "Higher Secondary — Pure Science",
    period: "2020",
    result: { label: "Percentage", value: "81.8%" },
  },
] as const;

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function EducationSection() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const rafRef      = useRef<number>(0);
  const targetCountRef = useRef<number | null>(null);

  /* ── Firefly animation loop (identical to AboutSection) ── */
  useEffect(() => {
    if (targetCountRef.current === null) targetCountRef.current = fireflyCount();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = targetCountRef.current ?? fireflyCount();
      while (firefliesRef.current.length < target) firefliesRef.current.push(createFirefly(w, h));
      if (firefliesRef.current.length > target) firefliesRef.current.length = target;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const tick = (now: number) => {
      if (!w || !h) { rafRef.current = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, w, h);
      for (const f of firefliesRef.current) {
        if (now < f.hiddenUntil) continue;
        f.wanderAngle += (Math.random() - 0.5) * 0.08;
        f.vx += Math.cos(f.wanderAngle) * 0.012; f.vy += Math.sin(f.wanderAngle) * 0.012;
        f.vx += (Math.random() - 0.5) * 0.04;    f.vy += (Math.random() - 0.5) * 0.04;
        f.vx *= 0.985; f.vy *= 0.985;
        f.x += f.vx; f.y += f.vy;
        const m = 40;
        if (f.x < -m) f.x = w + m; if (f.x > w + m) f.x = -m;
        if (f.y < -m) f.y = h + m; if (f.y > h + m) f.y = -m;
        f.pulse += f.pulseSpeed;
        const twinkle = 0.35 + Math.sin(f.pulse) * 0.28 + Math.sin(f.pulse * 2.3) * 0.12;
        if (f.opacity <= 0 && f.fadeDir < 0) {
          f.hiddenUntil = now + 400 + Math.random() * 2800;
          f.x = Math.random() * w; f.y = Math.random() * h;
          f.vx = (Math.random() - 0.5) * 0.25; f.vy = (Math.random() - 0.5) * 0.25;
          f.fadeDir = 1; continue;
        }
        if (now >= f.hiddenUntil) {
          if (f.opacity < 0.85 && f.fadeDir > 0) f.opacity = Math.min(0.88, f.opacity + 0.008 + Math.random() * 0.006);
          if (f.opacity >= 0.72 && Math.random() < 0.002) f.fadeDir = -1;
          if (f.fadeDir < 0) { f.opacity -= 0.012 + Math.random() * 0.01; if (f.opacity <= 0) { f.opacity = 0; continue; } }
        }
        const o = Math.max(0, Math.min(1, f.opacity * twinkle));
        if (o < 0.02) continue;
        const r = f.size * 4;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0,    `hsla(${f.hue}, 95%, 72%, ${o * 0.95})`);
        grad.addColorStop(0.25, `hsla(${f.hue}, 90%, 55%, ${o * 0.45})`);
        grad.addColorStop(0.55, `hsla(${f.hue}, 80%, 40%, ${o * 0.12})`);
        grad.addColorStop(1,    "hsla(60, 80%, 50%, 0)");
        ctx.save(); ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad; ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.fillStyle = `hsla(${f.hue}, 100%, 88%, ${o * 0.9})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size * 0.45, 0, Math.PI * 2); ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section
      id="education"
      className="edu-section relative h-dvh min-h-dvh w-full overflow-hidden"
      aria-labelledby="edu-heading"
    >
      {/* Background */}
      <div className="edu-section__bg" aria-hidden />

      {/* Firefly canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6">

        {/* Header */}
        <motion.div
          className="edu-section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: easeOut }}
        >
          <p className="edu-section__eyebrow">Education</p>
          <h2 id="edu-heading" className="edu-section__title">Academic Background</h2>
          <span className="edu-section__rule" aria-hidden />
        </motion.div>

        {/* Cards */}
        <div className="edu-cards">
          {EDUCATION.map((item, i) => (
            <motion.article
              key={item.id}
              className="edu-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: easeOut }}
            >
              <div className="edu-card__left">
                <p className="edu-card__period">{item.period}</p>
                <p className="edu-card__location">{item.location}</p>
              </div>

              <div className="edu-card__divider" aria-hidden />

              <div className="edu-card__right">
                <h3 className="edu-card__institution">{item.institution}</h3>
                <p className="edu-card__degree">{item.degree}</p>
                <p className="edu-card__result">
                  <span className="edu-card__result-label">{item.result.label}</span>
                  <span className="edu-card__result-value">{item.result.value}</span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
