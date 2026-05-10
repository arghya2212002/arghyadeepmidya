import type { Metadata } from "next";
import GalleryExhibition from "@/components/gallery/GalleryExhibition";
import GalleryHeroIntro from "@/components/gallery/GalleryHeroIntro";
import SkyStars from "@/components/gallery/SkyStars";
import { galleryPieces } from "@/data/galleryPieces";

export const metadata: Metadata = {
  title: "Gallery | Arghyadeep Midya",
  description:
    "Selected work by Arghyadeep Midya — wildlife photographer and naturalist.",
};

export default function GalleryPage() {
  return (
    <main className="gallery-page relative">
      <SkyStars />
      {/* Full-viewport cinematic intro */}
      <GalleryHeroIntro heroSrc={galleryPieces[0].src} />

      {/* Photo sections (skip index 0 — used as hero) */}
      <GalleryExhibition pieces={galleryPieces} seriesTitle="Into the Wild" />

      <footer className="gallery-page__footer">
        <p>Arghyadeep Midya &mdash; Wildlife photographer &amp; naturalist</p>
      </footer>
    </main>
  );
}
