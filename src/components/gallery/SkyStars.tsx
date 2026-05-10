"use client";

import { useEffect, useRef } from "react";

export default function SkyStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: { x: number; y: number; r: number; opacity: number; speed: number; baseOpacity: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Create stars based on screen size
      const starCount = Math.floor((w * h) / 2500); // density
      stars = Array.from({ length: starCount }, () => {
        const baseOpacity = Math.random() * 0.4 + 0.1;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.0 + 0.2, // tiny stars
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          speed: (Math.random() - 0.5) * 0.015, // twinkle speed
        };
      });
    };

    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      stars.forEach((star) => {
        // Twinkle effect
        star.opacity += star.speed;
        
        // Keep within 40-50% max visibility
        if (star.opacity > 0.5 || star.opacity < 0.05) {
          star.speed = -star.speed;
        }

        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
