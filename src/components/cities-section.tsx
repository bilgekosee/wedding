"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type City = {
  name: string;
  subtitle?: string;
  events: { label: string; query: string }[];
};

const cities: City[] = [
  {
    name: "Ankara",
    subtitle: "Kına · Nikâh",
    events: [
      { label: "Hamamönü", query: "Nesli Bey Kına Konağı Hamamönü Ankara" },
      {
        label: "Yenimahalle",
        query: "Nazım Hikmet Kültür Merkezi Nikâh Salonu Yenimahalle Ankara",
      },
    ],
  },
  {
    name: "Mersin",
    subtitle: "Düğün · Gülnar",
    events: [
      {
        label: "Zeyne Mah.",
        query: "Şehit Jandarma Er Recep Çelik Anaokulu Zeyne Gülnar Mersin",
      },
    ],
  },
];

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export function CitiesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="sehirler-baslik"
      className="relative mx-auto w-full max-w-md px-6 py-16 text-ink sm:py-20"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center"
      >
        <p className="font-serif text-[11px] italic uppercase tracking-[0.4em] text-muted sm:text-xs">
          Yol Haritası
        </p>
        <h2
          id="sehirler-baslik"
          className="mt-3 font-script text-4xl text-ink sm:text-5xl"
        >
          Ankara’dan Mersin’e
        </h2>
        <p className="mx-auto mt-4 max-w-xs font-serif text-sm italic text-ink-soft">
          Üç ayrı buluşma, tek bir mutluluk. Yolu birlikte yürümek dileğiyle.
        </p>
      </motion.div>

      <div className="mt-12 sm:mt-14">
        <JourneyMap prefersReducedMotion={!!prefersReducedMotion} />
      </div>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-12 space-y-4"
      >
        {cities.map((city) => (
          <motion.li key={city.name} variants={fadeUp}>
            <CityCard city={city} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function CityCard({ city }: { city: City }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-cream-soft/85 px-5 py-5 ring-1 ring-sage-deep/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_12px_28px_-20px_rgba(60,80,55,0.35)] sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-script text-3xl leading-none text-sage-deep sm:text-4xl">
            {city.name}
          </h3>
          {city.subtitle && (
            <p className="mt-1 font-serif text-xs italic uppercase tracking-[0.28em] text-muted">
              {city.subtitle}
            </p>
          )}
        </div>
        <PinIcon />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {city.events.map((event) => (
          <li key={event.label}>
            <a
              href={mapsUrl(event.query)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-sage-deep/30 bg-cream/40 px-3.5 py-1.5 font-serif text-[13px] italic text-sage-deep transition-colors hover:bg-sage-deep hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep sm:text-sm"
            >
              <MapPinSmall />
              {event.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

function JourneyMap({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  // amount: 0.2 means "fire when 20% of the map is visible" — far more
  // reliable on mobile than `margin: "-20%"`, which required the element
  // to be 20% INSIDE viewport on both edges (unreachable for short SVGs
  // on tall phones, so the animation never fired in production).
  const viewportOpts = { once: true, amount: 0.2 } as const;

  // Respect reduced-motion: render the final state immediately, no draw.
  const pathTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const };
  const pinTransitionAnkara = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.34, 1.4, 0.64, 1] as const, delay: 0.1 };
  const pinTransitionMersin = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.34, 1.4, 0.64, 1] as const, delay: 1.6 };
  const leavesTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.2, delay: 1.4 };

  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      <svg viewBox="0 0 320 180" className="w-full" aria-hidden>
        {/* Dashed background path — always visible as fallback */}
        <path
          d="M 56 40 C 110 30, 150 90, 200 110 S 280 150, 270 145"
          stroke="var(--color-sage-deep)"
          strokeOpacity="0.18"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Animated drawn path */}
        <motion.path
          d="M 56 40 C 110 30, 150 90, 200 110 S 280 150, 270 145"
          stroke="var(--color-sage-deep)"
          strokeOpacity="0.7"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={viewportOpts}
          transition={pathTransition}
        />

        {/* Pin: Ankara */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6, y: -8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={viewportOpts}
          transition={pinTransitionAnkara}
        >
          <circle cx="56" cy="40" r="6" fill="var(--color-cream)" stroke="var(--color-sage-deep)" strokeWidth="1.4" />
          <circle cx="56" cy="40" r="2.6" fill="var(--color-sage-deep)" />
          <text x="56" y="22" textAnchor="middle" className="fill-ink" style={{ font: "italic 12px var(--font-cormorant), serif" }}>
            Ankara
          </text>
        </motion.g>

        {/* Pin: Mersin */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={viewportOpts}
          transition={pinTransitionMersin}
        >
          <circle cx="270" cy="145" r="6" fill="var(--color-cream)" stroke="var(--color-sage-deep)" strokeWidth="1.4" />
          <circle cx="270" cy="145" r="2.6" fill="var(--color-sage-deep)" />
          <text x="270" y="166" textAnchor="middle" className="fill-ink" style={{ font: "italic 12px var(--font-cormorant), serif" }}>
            Mersin
          </text>
        </motion.g>

        {/* Tiny leaves on the path */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOpts}
          transition={leavesTransition}
        >
          <ellipse cx="138" cy="64" rx="5" ry="2" fill="var(--color-sage)" opacity="0.7" transform="rotate(-25 138 64)" />
          <ellipse cx="216" cy="118" rx="5" ry="2" fill="var(--color-sage-deep)" opacity="0.55" transform="rotate(15 216 118)" />
        </motion.g>
      </svg>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-sage-deep)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 opacity-70"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MapPinSmall() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
