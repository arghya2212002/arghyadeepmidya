"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import RotatingStamp from "./RotatingStamp";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-section relative flex w-full items-center justify-center overflow-hidden px-4"
    >
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: easeOut }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/ADM (34).jpg"
            alt="Photographer silhouette"
            fill
            className="hero-focus-bg"
            priority
            sizes="100vw"
            quality={85}
          />
        </motion.div>
        {/* Warm dark overlay — matches gallery colour scheme */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(6,4,2,0.38) 0%, rgba(5,3,2,0.18) 40%, rgba(6,4,2,0.52) 100%)"
        }} />
        {/* Warm amber vignette from sides */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 45%, rgba(4,3,1,0.48) 100%)"
        }} />
      </motion.div>

      <div className="hero-content relative z-10 mx-auto w-full max-w-6xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: easeOut }}
          className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-white/50 sm:mb-6 sm:text-[11px] sm:tracking-[0.36em]"
        >
          Capturing the soul of nature
        </motion.p>

        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease: easeOut }}
            className="hero-name-line text-[clamp(2.25rem,7.5vw,5.75rem)] font-medium tracking-[-0.02em] text-white"
          >
            Arghyadeep
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.72, ease: easeOut }}
            className="hero-name-line -mt-1 text-gradient-warm text-[clamp(2.25rem,7.5vw,5.75rem)] font-medium tracking-[-0.02em] sm:-mt-0.5"
          >
            Midya
          </motion.h1>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.05, ease: easeOut }}
          className="mx-auto mt-8 h-px w-32 origin-center bg-gradient-to-r from-transparent via-white/45 to-transparent sm:mt-10 sm:w-40"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25, ease: easeOut }}
          className="mt-5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/50 sm:mt-6 sm:text-[11px] sm:tracking-[0.32em]"
        >
          Wildlife photographer and naturalist
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.55, duration: 1, ease: easeOut }}
        className="hero-scroll-hint"
      >
        <div className="hero-scroll-hint__rule" aria-hidden />
        <p className="hero-scroll-hint__label">Scroll to Explore</p>
        <div className="hero-scroll-hint__mouse" aria-hidden>
          <span className="hero-scroll-hint__wheel" />
        </div>
      </motion.div>

      <RotatingStamp />
    </section>
  );
}
