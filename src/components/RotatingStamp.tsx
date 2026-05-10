"use client";

import Link from "next/link";
import { contactEmail } from "@/config/social";

export default function RotatingStamp() {
  return (
    <div className="absolute right-4 bottom-4 z-40 sm:right-8 sm:bottom-8 lg:right-12 lg:bottom-12 pointer-events-auto">
      <Link 
        href={`mailto:${contactEmail}`} 
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/40 shadow-lg"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/95"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </Link>
    </div>
  );
}
