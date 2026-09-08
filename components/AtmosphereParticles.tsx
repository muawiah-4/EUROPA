"use client";

import { useEffect, useRef } from "react";
import type { AtmosphereKind } from "@/lib/journey";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  o: number;
  drift: number;
};

/**
 * Config per atmosphere kind — count, size range, velocity range, and color
 * drive a single shared canvas particle loop rather than one bespoke system
 * per destination. Kept deliberately restrained (the brief explicitly warns
 * against decoration-for-its-own-sake): every kind reads as environment,
 * never confetti.
 */
const CONFIG: Record<
  AtmosphereKind,
  {
    count: number;
    size: [number, number];
    speed: [number, number];
    angle: number; // radians, direction of drift
    color: string;
    opacity: [number, number];
    wander: number; // horizontal sinusoidal wander amount
  }
> = {
  "gold-dust": { count: 70, size: [0.6, 1.8], speed: [4, 10], angle: -Math.PI / 2.3, color: "232,196,138", opacity: [0.08, 0.32], wander: 0.4 },
  "warm-haze": { count: 55, size: [1, 2.6], speed: [3, 7], angle: -Math.PI / 2, color: "216,158,96", opacity: [0.05, 0.22], wander: 0.25 },
  "sun-glint": { count: 90, size: [0.4, 1.2], speed: [2, 5], angle: -Math.PI / 2.6, color: "255,255,255", opacity: [0.1, 0.5], wander: 0.6 },
  "mist-shimmer": { count: 40, size: [1.5, 4], speed: [2, 4], angle: Math.PI, color: "170,200,198", opacity: [0.04, 0.16], wander: 0.15 },
  snowfall: { count: 100, size: [1, 2.8], speed: [10, 22], angle: Math.PI / 2, color: "255,255,255", opacity: [0.2, 0.6], wander: 0.8 },
  "rain-fog": { count: 140, size: [0.5, 1], speed: [40, 70], angle: Math.PI / 2.15, color: "190,205,220", opacity: [0.12, 0.35], wander: 0.05 },
  "warm-drift": { count: 50, size: [0.8, 2], speed: [3, 6], angle: -Math.PI / 2, color: "224,150,110", opacity: [0.06, 0.24], wander: 0.5 },
  "dusk-mist": { count: 45, size: [1.2, 3], speed: [2, 4], angle: -Math.PI / 2, color: "185,143,209", opacity: [0.05, 0.2], wander: 0.3 },
};

export default function AtmosphereParticles({
  kind,
  className = "",
}: {
  kind: AtmosphereKind;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cfg = CONFIG[kind];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(cfg.size[0], cfg.size[1]),
      vx: Math.cos(cfg.angle) * rand(cfg.speed[0], cfg.speed[1]),
      vy: Math.sin(cfg.angle) * rand(cfg.speed[0], cfg.speed[1]),
      o: rand(cfg.opacity[0], cfg.opacity[1]),
      drift: rand(0, Math.PI * 2),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = prefersReduced ? 0 : cfg.count;
      particles = Array.from({ length: count }, spawn);
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      t += 1;
      for (const p of particles) {
        p.x += p.vx / 60 + Math.sin(t / 90 + p.drift) * cfg.wander * 0.05;
        p.y += p.vy / 60;
        if (p.y > height + 10 || p.y < -10 || p.x > width + 10 || p.x < -10) {
          Object.assign(p, spawn());
          if (cfg.angle > 0) p.y = -10;
          else if (cfg.angle < 0) p.y = height + 10;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cfg.color},${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!prefersReduced) raf = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [kind]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
