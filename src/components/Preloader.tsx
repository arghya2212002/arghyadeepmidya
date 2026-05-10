"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Easing curve ──────────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Slides ─────────────────────────────────────────────────────────────────
   7 hand-picked hero shots — visually varied, high-impact.
   `pos`      → CSS object-position so the subject stays centred at every size.
   `priority` → first slide gets LCP priority; the rest are eagerly preloaded.
   ─────────────────────────────────────────────────────────────────────────── */
const SLIDES = [
  { src: "/_DSC3547.jpg.jpeg", pos: "center 40%", priority: true },
  { src: "/fox.jpg", pos: "center 50%", priority: true },
  { src: "/1729262756010.jpg.jpeg", pos: "center 55%", priority: false },
  { src: "/_ARG7935_ed.jpg.jpeg", pos: "center 45%", priority: false },
  { src: "/SAVE_20230915_185529.jpg", pos: "center 50%", priority: false },
  { src: "/DSC_4211.jpg.jpeg", pos: "center 48%", priority: false },
  { src: "/Untitled-2_cropped_web.jpg.jpeg", pos: "center 35%", priority: false },
] as const;

/* ─── Timing ─────────────────────────────────────────────────────────────────
   TOTAL_MS  : full preloader window (ms)
   SLIDE_MS  : how long each image is fully visible before the cross-fade begins
   ─────────────────────────────────────────────────────────────────────────── */
const TOTAL_MS = 3800;
const SLIDE_MS = TOTAL_MS / SLIDES.length;   // ~292 ms per slide

/* ─── Responsive `sizes` hint ────────────────────────────────────────────────
   Tells Next.js image optimisation exactly what to serve per viewport.
   This prevents serving a 4 K image on a 375 px mobile screen.
   ─────────────────────────────────────────────────────────────────────────── */
/* Preloader images are dark-overlaid background fills — cap at 1280 px wide.
   There is no visual gain from serving a 4 K asset behind a 60 % opacity
   overlay, and the bandwidth saving is significant on slow connections. */
const IMG_SIZES = [
  "(max-width: 480px) 480px",
  "(max-width: 768px) 768px",
  "(max-width: 1280px) 1280px",
  "1280px",
].join(", ");

/* =========================================================================== */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  /* ── Hide the zero-JS static shell the instant React mounts ─────────────
     The static shell (#pl-shell in layout.tsx) is server-rendered HTML that
     fills the blank-white gap before JS hydrates. As soon as this component
     mounts we fade it out and then fully remove it so it doesn't interfere.
  ── */
  useEffect(() => {
    const shell = document.getElementById("pl-shell");
    if (!shell) return;
    /* Trigger the CSS opacity transition defined in SHELL_CSS */
    shell.classList.add("pl-shell--hidden");
    /* Hide from layout after transition instead of removing from DOM.
       Removing it breaks React's fiber tree during client-side navigation. */
    const tid = setTimeout(() => {
      shell.style.display = "none";
    }, 600);
    return () => clearTimeout(tid);
  }, []);

  /* ── Lock scroll & run the progress ticker ─────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let timeoutId: NodeJS.Timeout | null = null;

    const tick = (now: number) => {
      const raw = Math.min((now - start) / TOTAL_MS, 1);
      /* Ease-out-cubic for a tactile, decelerating counter feel */
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.floor(eased * 100));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        /* Give the exit animation time to fully play before unmounting */
        timeoutId = setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
        }, prefersReduced ? 80 : 520);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timeoutId !== null) clearTimeout(timeoutId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Slide cycling ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setSlideIdx(i => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [visible]);

  const slideVariants = prefersReduced
    ? {
      initial: { opacity: 0, zIndex: 1 },
      animate: { opacity: 1, zIndex: 1 },
      exit: { opacity: 1, zIndex: 0 },
    }
    : {
      initial: { opacity: 0, scale: 1.05, filter: "brightness(0.8) blur(3px)", zIndex: 1 },
      animate: { opacity: 1, scale: 1.0, filter: "brightness(0.85) blur(2px)", zIndex: 1 },
      exit: { opacity: 1, scale: 1.02, filter: "brightness(0.5) blur(5px)", zIndex: 0 },
    };

  const wrapperExit = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, filter: "blur(28px) brightness(1.15)", scale: 1.1 };

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader"
          initial={{ opacity: 1 }}
          exit={wrapperExit}
          transition={{ duration: prefersReduced ? 0.3 : 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Photo slideshow ─────────────────────────────────────────── */}
          <div className="preloader__slides" aria-hidden>
            <AnimatePresence mode="sync">
              <motion.div
                key={slideIdx}
                className="preloader__slide"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                /* duration: 0.35s combined with easeOutExpo makes it start fast but settle slowly */
                transition={{ duration: 0.35, ease }}
              >
                <Image
                  src={SLIDES[slideIdx].src}
                  alt=""
                  fill
                  priority={SLIDES[slideIdx].priority}
                  loading={SLIDES[slideIdx].priority ? "eager" : "lazy"}
                  /* quality=25 per user request to keep it at 20-30% */
                  quality={25}
                  className="preloader__slide-img"
                  style={{ objectPosition: SLIDES[slideIdx].pos }}
                  sizes={IMG_SIZES}
                  fetchPriority={SLIDES[slideIdx].priority ? "high" : "auto"}
                />
              </motion.div>
            </AnimatePresence>

            {/* Hidden preload rack: force browser to fetch the NEXT slide
                before we actually show it → zero-delay cross-fade */}
            <div className="preloader__preload-rack" aria-hidden>
              {SLIDES.map((slide, i) =>
                i !== slideIdx && i !== 0 ? (
                  <Image
                    key={slide.src}
                    src={slide.src}
                    alt=""
                    fill
                    /* quality=15 for the hidden preload rack — these are
                       fetched purely to warm the browser cache so the next
                       cross-fade is instant. Visual quality is irrelevant. */
                    quality={15}
                    loading="lazy"
                    sizes="1px"
                    className="preloader__preload-img"
                  />
                ) : null
              )}
            </div>
          </div>

          {/* ── Layered overlays ──────────────────────────────────────────── */}
          <div className="preloader__overlay preloader__overlay--dark" aria-hidden />
          <div className="preloader__overlay preloader__overlay--vignette" aria-hidden />
          <div className="preloader__overlay preloader__overlay--bottom" aria-hidden />

          {/* ── Central identity ──────────────────────────────────────────── */}
          <div className="preloader__center">
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 1.3, ease }}
              className="preloader__logo-wrap"
            >
              <Image
                src="/logo main.png"
                alt="Arghyadeep Midya"
                width={200}
                height={150}
                className="preloader__logo"
                priority
                style={{ height: "auto" }}
              />
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.0, ease }}
              className="preloader__rule"
              style={{ originX: 0.5 }}
            />

            <motion.p
              className="preloader__subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9, ease }}
            >
              Wildlife photographer &amp; naturalist
            </motion.p>
          </div>

          {/* ── Slide dots ─────────────────────────────────────────────────── */}
          <motion.div
            className="preloader__dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            aria-hidden
          >
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`preloader__dot${i === slideIdx ? " preloader__dot--active" : ""}`}
              />
            ))}
          </motion.div>

          {/* ── Bottom bar: status label + percentage counter ─────────────── */}
          <div className="preloader__bottom">
            <motion.span
              className="preloader__status"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.9, ease }}
            >
              Loading
            </motion.span>

            <motion.span
              className="preloader__counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              {String(progress).padStart(2, "0")}
              <span className="preloader__counter-pct">%</span>
            </motion.span>
          </div>

          {/* ── Thin progress bar at the very bottom ─────────────────────── */}
          <motion.div
            className="preloader__bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: "linear", duration: 0.1 }}
            style={{ originX: 0 }}
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
