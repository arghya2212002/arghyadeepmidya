import type { Metadata } from "next";
import { Comfortaa, Playfair_Display, Roboto } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import ScrollSnapController from "@/components/ScrollSnapController";
import "./globals.css";

/*
 * STATIC PRELOADER SHELL STYLES
 * ─────────────────────────────
 * These styles are inlined into <head> so they are parsed before any
 * external stylesheet. The shell itself (#pl-shell) is plain HTML — no JS
 * required — so it renders with the very first byte of the document.
 * The React <Preloader> component removes it on mount.
 */
const SHELL_CSS = `
  #pl-shell {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: #060402;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.5s ease;
  }
  #pl-shell.pl-shell--hidden {
    opacity: 0;
    pointer-events: none;
  }
  #pl-shell-pulse {
    width: clamp(90px, 18vw, 140px);
    animation: pl-breathe 1.8s ease-in-out infinite;
    filter: brightness(0) invert(1);
    opacity: 0.7;
  }
  @keyframes pl-breathe {
    0%, 100% { opacity: 0.55; transform: scale(0.97); }
    50%       { opacity: 0.85; transform: scale(1.02); }
  }
  #pl-shell-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(210,190,155,0.7) 40%,
      rgba(220,200,165,0.9) 50%,
      rgba(210,190,155,0.7) 60%,
      transparent
    );
    background-size: 200% 100%;
    animation: pl-scan 1.6s linear infinite;
  }
  @keyframes pl-scan {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }
  #pl-shell-text {
    margin-top: clamp(1rem, 2.5vh, 1.6rem);
    font-family: Arial, sans-serif;
    font-size: clamp(0.45rem, 1.1vw, 0.6rem);
    font-weight: 300;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: rgba(200,185,160,0.45);
    white-space: nowrap;
  }
`;

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400"],
});

export const metadata: Metadata = {
  title: "Arghyadeep Midya",
  description: "Wildlife photographer and naturalist — Arghyadeep Midya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${comfortaa.variable} ${playfair.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        {/* Inline the shell styles so they are available before any CSS file
            is fetched — this guarantees the dark background is instant. */}
        <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {/*
         * STATIC PRELOADER SHELL
         * Pure HTML — zero JS dependency — painted with the first HTML byte.
         * Overridden / hidden by the React <Preloader> on hydration.
         * The pulsing logo reassures users that the page is alive.
         */}
        {/*
         * STATIC PRELOADER SHELL
         * Rendered as an opaque HTML blob via dangerouslySetInnerHTML so that
         * React never reconciles its child nodes. This prevents the
         * "insertBefore: node is not a child" crash that occurs when
         * Preloader.tsx removes this element via shell.remove() while React's
         * commit phase still holds stale references to its children.
         */}
        <div
          id="pl-shell"
          aria-hidden="true"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              <img
                id="pl-shell-pulse"
                src="/logo main.png"
                alt=""
                width="200"
                height="150"
              />
              <p id="pl-shell-text">Wildlife photographer &amp; naturalist</p>
              <div id="pl-shell-bar"></div>
            `,
          }}
        />

        <Preloader />
        <ScrollSnapController />
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
