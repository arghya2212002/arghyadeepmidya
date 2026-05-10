"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `snap-home` class to <html> only when on the home page ("/" route).
 * CSS targets `html.snap-home` so scroll-snap-type never fires on other pages.
 */
export default function ScrollSnapController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (pathname === "/") {
      root.classList.add("snap-home");
    } else {
      root.classList.remove("snap-home");
    }
  }, [pathname]);

  return null;
}
