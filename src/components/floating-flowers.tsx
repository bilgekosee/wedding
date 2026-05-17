"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

type Flower = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotateFrom: number;
  rotateTo: number;
  color: string;
  centerColor: string;
  peakOpacity: number;
};

const palette = [
  { petal: "var(--color-blush)", center: "var(--color-petal)" },
  { petal: "var(--color-blush-soft)", center: "var(--color-petal)" },
  { petal: "var(--color-coral)", center: "var(--color-petal)" },
  { petal: "var(--color-rose)", center: "var(--color-petal)" },
  { petal: "var(--color-petal)", center: "var(--color-rose)" },
  { petal: "var(--color-sage)", center: "var(--color-petal)" },
];

function generate(count: number, seed = 0): Flower[] {
  return Array.from({ length: count }).map((_, i) => {
    const n = (i + 1 + seed) * 1.6180339;
    const r = (k: number) => {
      const x = Math.sin(n * (k + 1)) * 10000;
      return x - Math.floor(x);
    };
    const tone = palette[Math.floor(r(7) * palette.length)];
    return {
      id: i,
      left: r(1) * 100,
      size: 9 + r(2) * 9,
      duration: 9 + r(3) * 8,
      delay: r(4) * 16,
      drift: -50 + r(5) * 100,
      rotateFrom: -45 + r(6) * 90,
      rotateTo: 180 + r(8) * 360,
      color: tone.petal,
      centerColor: tone.center,
      peakOpacity: 0.55 + r(9) * 0.4,
    };
  });
}

export function FloatingFlowers({
  count = 14,
  seed = 0,
  className = "",
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const flowers = useMemo(() => generate(count, seed), [count, seed]);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none absolute inset-0 overflow-hidden " + className
      }
    >
      {flowers.map((f) => (
        <motion.span
          key={f.id}
          className="absolute block"
          style={{
            left: `${f.left}%`,
            top: "-8%",
            width: f.size,
            height: f.size,
          }}
          initial={{ y: "0%", x: 0, opacity: 0, rotate: f.rotateFrom }}
          animate={{
            y: ["0%", "115vh"],
            x: [0, f.drift * 0.5, -f.drift * 0.4, f.drift * 0.7, 0],
            rotate: [f.rotateFrom, f.rotateTo],
            opacity: [0, f.peakOpacity, f.peakOpacity, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <FlowerSvg color={f.color} centerColor={f.centerColor} />
        </motion.span>
      ))}
    </div>
  );
}

function FlowerSvg({
  color,
  centerColor,
}: {
  color: string;
  centerColor: string;
}) {
  return (
    <svg
      viewBox="-10 -10 20 20"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} />
        </g>
      ))}
      <circle r="2" fill={centerColor} />
      <circle r="0.9" fill="#5e2f10" opacity="0.85" />
    </svg>
  );
}
