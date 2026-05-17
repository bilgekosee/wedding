"use client";

import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.7, rotate: -8, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const ampersand: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -25 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.1, ease: [0.34, 1.4, 0.64, 1] },
  },
};

const tagline: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
  },
};

export function HeroNameplate({
  play,
  className,
}: {
  play: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={false}
      animate={play ? "visible" : "hidden"}
      className={cn("flex flex-col items-center gap-3 text-center", className)}
    >
      <h1
        aria-label="Fatma Nur ve Salih"
        className="font-script text-[2.6rem] leading-[0.95] text-ink sm:text-5xl"
      >
        <motion.span
          variants={wordContainer}
          className="inline-block whitespace-nowrap"
          aria-hidden
        >
          {"Fatma Nur".split("").map((c, i) => (
            <Letter key={`f-${i}`} char={c} />
          ))}
        </motion.span>{" "}
        <motion.span
          variants={ampersand}
          className="font-serif italic text-sage-deep mx-1 inline-block"
          aria-hidden
        >
          &
        </motion.span>{" "}
        <motion.span
          variants={wordContainer}
          className="inline-block whitespace-nowrap"
          aria-hidden
        >
          {"Salih".split("").map((c, i) => (
            <Letter key={`s-${i}`} char={c} />
          ))}
        </motion.span>
      </h1>

      <motion.p
        variants={tagline}
        className="font-serif text-[11px] italic uppercase tracking-[0.4em] text-muted sm:text-xs"
      >
        Özel günler birlikte güzel
      </motion.p>
    </motion.div>
  );
}

function Letter({ char }: { char: string }) {
  return (
    <motion.span variants={letter} className="inline-block">
      {char === " " ? " " : char}
    </motion.span>
  );
}
