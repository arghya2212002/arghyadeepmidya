"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type Props = {
  heroSrc: string;
};

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
});

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function GalleryHeroIntro({ heroSrc }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.5, 0.82]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <div ref={ref} className="g-intro">
      {/* Background photo with slow parallax */}
      <motion.div className="g-intro__bg-wrap" style={{ y: imgY }}>
        <Image
          src={heroSrc}
          alt="Into the Wild — Arghyadeep Midya"
          fill
          priority
          className="g-intro__bg-img"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark overlay */}
      <motion.div className="g-intro__overlay" style={{ opacity: overlayOpacity }} />
      {/* Vignette */}
      <div className="g-intro__vignette" aria-hidden />
      {/* Bottom fade into dark gallery */}
      <div className="g-intro__fade-bottom" />

      {/* ── Centred text content ── */}
      <motion.div className="g-intro__content" style={{ y: contentY }}>

        <motion.p
          className="g-intro__eyebrow"
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
        >
          A Wildlife Series
        </motion.p>

        <motion.span
          className="g-intro__rule"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          style={{ originX: 0.5 }}
        />

        {/* Title animates in as 3 whole words */}
        <h1 className="g-intro__title" aria-label="Into the Wild">
          <motion.span variants={fadeUp(0.55)} initial="hidden" animate="visible">
            Into
          </motion.span>
          {" "}
          <motion.span variants={fadeUp(0.72)} initial="hidden" animate="visible">
            the
          </motion.span>
          {" "}
          <motion.span variants={fadeUp(0.90)} initial="hidden" animate="visible">
            Wild
          </motion.span>
        </h1>

        <motion.span
          className="g-intro__rule"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          style={{ originX: 0.5 }}
        />

        <motion.p
          className="g-intro__credit"
          variants={fadeUp(1.6)}
          initial="hidden"
          animate="visible"
        >
          Arghyadeep Midya&nbsp;&nbsp;·&nbsp;&nbsp;Wildlife Photographer&nbsp;&nbsp;·&nbsp;&nbsp;Naturalist
        </motion.p>

        <motion.p
          className="g-intro__tagline"
          variants={fadeUp(1.8)}
          initial="hidden"
          animate="visible"
        >
          &ldquo;Every frame is a moment the wild allowed me to witness.&rdquo;
        </motion.p>

      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="g-intro__scroll-cue"
        variants={fadeUp(2.1)}
        initial="hidden"
        animate="visible"
      >
        <span className="g-intro__scroll-label">Scroll to explore</span>
        <span className="g-intro__scroll-line" aria-hidden />
      </motion.div>

      {/* Corner metadata */}
      <motion.div
        className="g-intro__corner g-intro__corner--bl"
        variants={fadeUp(1.9)}
        initial="hidden"
        animate="visible"
      >
        <span>© 2024</span>
        <span>All rights reserved</span>
      </motion.div>

      <motion.div
        className="g-intro__corner g-intro__corner--br"
        variants={fadeUp(1.9)}
        initial="hidden"
        animate="visible"
      >
        <span>13 photographs</span>
        <span>5 series</span>
      </motion.div>
    </div>
  );
}
