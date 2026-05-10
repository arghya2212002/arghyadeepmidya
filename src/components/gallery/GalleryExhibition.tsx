"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState, useMemo } from "react";

export type GalleryPiece = {
  src: string;
  title: string;
  year?: string;
  medium?: string;
  /** If true, this image spans the full width of the section grid */
  featured?: boolean;
};

type GallerySection = {
  name: string;
  items: { piece: GalleryPiece; index: number }[];
};

type Props = {
  pieces: GalleryPiece[];
  seriesTitle?: string;
};

export default function GalleryExhibition({ pieces }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? null : Math.min(i + 1, pieces.length - 1)));
      if (e.key === "ArrowLeft")
        setOpen((i) => (i === null ? null : Math.max(i - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, pieces.length]);

  /* piece[0] is consumed by GalleryHeroIntro — start sections from index 1 */
  const bodyPieces = pieces.slice(1);

  const groupedSections = useMemo<GallerySection[]>(() => {
    const groups: GallerySection[] = [];
    const groupMap = new Map<string, GallerySection>();

    bodyPieces.forEach((piece, idx) => {
      const gName = piece.medium || "Other";
      if (!groupMap.has(gName)) {
        const section: GallerySection = { name: gName, items: [] };
        groupMap.set(gName, section);
        groups.push(section);
      }
      // Global index is offset by 1 because the hero image is pieces[0]
      groupMap.get(gName)!.items.push({ piece, index: idx + 1 });
    });
    return groups;
  }, [bodyPieces]);

  return (
    <>
      {/* ── Sections ──────────────────────────────────────────── */}
      <div className="gallery-body">
        {groupedSections.map((section, si) => (
          <motion.section
            key={section.name}
            className="gallery-section"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: si * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section title — italic serif, right-aligned */}
            <div className="gallery-section__header">
              <span className="gallery-section__title">{section.name}</span>
            </div>

            {/* 2-column photo grid */}
            <div className="gallery-section__grid">
              {section.items.map(({ piece, index }, itemIdx) => (
                <motion.button
                  key={`${piece.src}-${index}`}
                  type="button"
                  className={`gallery-cell${piece.featured ? " gallery-cell--featured" : ""}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.55, delay: itemIdx * 0.07 }}
                  onClick={() => setOpen(index)}
                  aria-label={`Open ${piece.title}`}
                >
                  <div className="gallery-cell__frame">
                    <Image
                      src={piece.src}
                      alt={piece.title}
                      width={900}
                      height={600}
                      className="gallery-cell__img"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  {piece.title && (
                    <p className="gallery-cell__caption">{piece.title}</p>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open !== null && pieces[open] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={pieces[open].title}
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="gallery-lightbox__panel"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="gallery-lightbox__close" onClick={close}>
                ✕ Close
              </button>
              <div className="gallery-lightbox__img-wrap">
                <Image
                  src={pieces[open].src}
                  alt={pieces[open].title}
                  width={1600}
                  height={1200}
                  className="gallery-lightbox__img"
                  sizes="(max-width: 1200px) 100vw, 1100px"
                  priority
                />
              </div>
              <div className="gallery-lightbox__caption">
                <h2 className="gallery-lightbox__title">{pieces[open].title}</h2>
                {(pieces[open].year || pieces[open].medium) && (
                  <p className="gallery-lightbox__meta">
                    {[pieces[open].year, pieces[open].medium].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="gallery-lightbox__hint">Esc to close · ← → to navigate</p>
              </div>
            </motion.div>

            {open > 0 && (
              <button
                type="button"
                className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                onClick={(e) => { e.stopPropagation(); setOpen(open - 1); }}
                aria-label="Previous image"
              >‹</button>
            )}
            {open < pieces.length - 1 && (
              <button
                type="button"
                className="gallery-lightbox__nav gallery-lightbox__nav--next"
                onClick={(e) => { e.stopPropagation(); setOpen(open + 1); }}
                aria-label="Next image"
              >›</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
