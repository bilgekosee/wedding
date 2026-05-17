"use client";

import { motion, type Variants } from "motion/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      className="relative mx-auto w-full max-w-md px-6 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center text-ink"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
      >
        <FooterFlourish />

        <p className="mt-6 font-serif text-[11px] italic uppercase tracking-[0.45em] text-muted sm:text-xs">
          Aileler
        </p>

        <div className="mt-3 flex items-center justify-center gap-4">
          <span className="font-script text-2xl text-ink sm:text-3xl">Şahin</span>
          <span className="font-serif text-base italic text-sage-deep">
            &amp;
          </span>
          <span className="font-script text-2xl text-ink sm:text-3xl">Kavuşkan</span>
        </div>

        <p className="mt-8 font-serif text-sm italic text-ink-soft sm:text-base">
          Özel günler birlikte güzel.
        </p>

        <p className="mt-6 font-serif text-[10px] italic uppercase tracking-[0.32em] text-muted sm:text-[11px]">
          Haziran — Temmuz · 2026
        </p>
      </motion.div>
    </footer>
  );
}

function FooterFlourish() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 32"
      className="mx-auto h-8 w-44 opacity-70"
    >
      <line
        x1="14"
        y1="16"
        x2="82"
        y2="16"
        stroke="var(--color-sage-deep)"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <line
        x1="118"
        y1="16"
        x2="186"
        y2="16"
        stroke="var(--color-sage-deep)"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <g transform="translate(100 16)">
        <ellipse cx="-7" cy="0" rx="6" ry="2.4" fill="var(--color-sage)" opacity="0.85" transform="rotate(-22)" />
        <ellipse cx="7" cy="0" rx="6" ry="2.4" fill="var(--color-sage-deep)" opacity="0.85" transform="rotate(22)" />
        <circle r="1.6" fill="var(--color-blush)" opacity="0.9" />
      </g>
    </svg>
  );
}
