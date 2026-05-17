"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";

import { SparklesText } from "@/components/ui/sparkles-text";

const TARGET = new Date(2026, 6, 4, 19, 0, 0);

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function diffFrom(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
    done: false,
  };
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export function CountdownSection() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTime(diffFrom(TARGET));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-labelledby="geri-sayim-baslik"
      className="relative mx-auto w-full max-w-md px-6 pt-16 pb-10 text-ink sm:pt-20 sm:pb-12"
    >
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        className="text-center"
      >
        <h2
          id="geri-sayim-baslik"
          className="font-script text-4xl text-sage-deep sm:text-5xl"
        >
          <SparklesText
            text="Düğüne sayılı günler"
            sparklesCount={14}
            colors={{ first: "#f5c560", second: "#8aa17a" }}
          />
        </h2>
      </motion.div>

      <motion.div
        variants={groupVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        className="mt-10 sm:mt-12"
        aria-live="polite"
      >
        {time?.done ? (
          <DoneMessage />
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Cell value={time?.days ?? null} digits={2} label="Gün" />
            <Cell value={time?.hours ?? null} digits={2} label="Saat" />
            <Cell value={time?.minutes ?? null} digits={2} label="Dakika" />
            <Cell value={time?.seconds ?? null} digits={2} label="Saniye" />
          </div>
        )}
      </motion.div>

      <p className="mt-8 text-center font-serif text-xs italic text-muted sm:text-sm">
        04 Temmuz 2026 · Cumartesi · 19.00
      </p>
    </section>
  );
}

function Cell({
  value,
  digits,
  label,
}: {
  value: number | null;
  digits: number;
  label: string;
}) {
  return (
    <div className="col-span-1 flex flex-col items-center">
      <div
        className={[
          "relative flex w-full items-center justify-center",
          "rounded-2xl bg-cream-soft/85 px-2 py-4 sm:px-3 sm:py-5",
          "ring-1 ring-sage-deep/15",
          "shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_12px_28px_-18px_rgba(60,80,55,0.45)]",
        ].join(" ")}
      >
        <FlipNumber value={value} digits={digits} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-sage-deep/8"
        />
      </div>
      <span className="mt-2 font-serif text-[10px] uppercase tracking-[0.3em] text-muted sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function FlipNumber({
  value,
  digits,
}: {
  value: number | null;
  digits: number;
}) {
  const str =
    value === null ? "—".repeat(digits) : String(value).padStart(digits, "0");
  return (
    <span
      className="inline-flex font-serif text-3xl leading-none text-ink tabular-nums sm:text-4xl"
      style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
    >
      {str.split("").map((d, i) => (
        <Digit key={i} digit={d} />
      ))}
    </span>
  );
}

function Digit({ digit }: { digit: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-middle"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function DoneMessage() {
  return (
    <p className="text-center font-script text-3xl text-sage-deep sm:text-4xl">
      Bugün, o gün!
    </p>
  );
}
