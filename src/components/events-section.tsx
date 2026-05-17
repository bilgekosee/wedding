"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type EventInfo = {
  title: string;
  date: Date;
  weekday: string;
  time: string;
  venue: string;
  address: string;
  note?: string;
  mapsQuery: string;
};

const events: EventInfo[] = [
  {
    title: "Kına",
    date: new Date(2026, 5, 28),
    weekday: "Pazar",
    time: "18:30",
    venue: "Nesli Bey Kına Konağı",
    address: "Hacettepe Mah. Basamaklı Sk. No:1, Hamamönü Altındağ / Ankara",
    note: "Kına hanımlara mahsus olup erkekler için ayrı alan mevcuttur.",
    mapsQuery: "Nesli Bey Kına Konağı Hamamönü Ankara",
  },
  {
    title: "Nikâh",
    date: new Date(2026, 5, 29),
    weekday: "Pazartesi",
    time: "14:00",
    venue: "Nazım Hikmet Kültür Merkezi Nikâh Salonu",
    address: "Yenimahalle / Ankara",
    mapsQuery: "Nazım Hikmet Kültür Merkezi Nikâh Salonu Yenimahalle Ankara",
  },
  {
    title: "Düğün",
    date: new Date(2026, 6, 4),
    weekday: "Cumartesi",
    time: "19:00",
    venue: "Şehit Jandarma Er Recep Çelik Anaokulu Bahçesi",
    address: "Zeyne Mahallesi, Gülnar / Mersin",
    mapsQuery: "Şehit Jandarma Er Recep Çelik Anaokulu Zeyne Gülnar Mersin",
  },
];

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const innerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const innerLine: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.34, 1.4, 0.64, 1] },
  },
};

export function EventsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="program-baslik"
      className="relative mx-auto w-full max-w-md px-6 pt-4 pb-16 text-ink sm:pt-6 sm:pb-20"
    >
      <motion.header
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="mb-14 text-center sm:mb-16"
      >
        <p className="font-serif text-[11px] italic uppercase tracking-[0.4em] text-muted sm:text-xs">
          Davet Programı
        </p>
        <h2
          id="program-baslik"
          className="mt-3 font-script text-5xl text-ink sm:text-6xl"
        >
          Üç gün, bir hatıra
        </h2>
        <Ornament className="mt-5" />
        <p className="mx-auto mt-5 max-w-xs font-serif text-sm italic text-ink-soft">
          Sizi yanımızda görmek, bu günleri çok daha güzel kılacak.
        </p>
      </motion.header>

      <div className="relative">
        <ConnectorLine
          pathLength={prefersReducedMotion ? 1 : pathLength}
          count={events.length}
        />

        <ol className="relative space-y-20 sm:space-y-24">
          {events.map((event, i) => (
            <EventCard key={event.title} event={event} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
}: {
  event: EventInfo;
  index: number;
}) {
  return (
    <motion.li
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      className="relative"
    >
      <article
        className={cn(
          "relative rounded-[28px] bg-cream-soft/85 backdrop-blur-[1px]",
          "px-6 pt-10 pb-7 sm:px-8 sm:pt-12 sm:pb-9",
          "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-22px_rgba(60,80,55,0.35),0_2px_6px_-2px_rgba(0,0,0,0.04)]",
          "ring-1 ring-sage-deep/10",
        )}
      >
        <CardPaperFlourish />

        <motion.div
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream shadow-[0_4px_12px_-3px_rgba(60,80,55,0.4)] ring-1 ring-sage-deep/25">
            <span className="font-serif text-xs italic tracking-[0.2em] text-sage-deep">
              {String(index + 1).padStart(2, "0")}
            </span>
          </span>
        </motion.div>

        <motion.div
          variants={innerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12%" }}
          className="relative flex flex-col items-center gap-3 text-center"
        >
          <motion.p
            variants={innerLine}
            className="font-serif text-[11px] italic uppercase tracking-[0.42em] text-muted"
          >
            {event.weekday}
          </motion.p>

          <motion.h3
            variants={innerLine}
            className="font-script text-[3.4rem] leading-[0.95] text-sage-deep sm:text-6xl"
          >
            {event.title}
          </motion.h3>

          <motion.div
            variants={innerLine}
            className="mt-1 flex items-center gap-3 font-serif text-ink-soft"
          >
            <time
              dateTime={event.date.toISOString().slice(0, 10)}
              className="text-base sm:text-lg"
            >
              {dateFormatter.format(event.date)}
            </time>
            <span aria-hidden className="block h-1 w-1 rounded-full bg-sage-deep/40" />
            <span className="text-base italic sm:text-lg">{event.time}</span>
          </motion.div>

          <motion.div variants={innerLine} className="mt-4 flex flex-col gap-1">
            <p className="font-serif text-[15px] italic text-ink sm:text-base">
              {event.venue}
            </p>
            <address className="font-sans text-[13px] not-italic leading-relaxed text-ink-soft sm:text-sm">
              {event.address}
            </address>
          </motion.div>

          <motion.a
            variants={innerLine}
            href={mapsUrl(event.mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/btn mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full",
              "border border-sage-deep/40 bg-cream/40 px-5 py-2",
              "font-serif text-sm italic text-sage-deep",
              "transition-colors hover:bg-sage-deep hover:text-cream",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep",
            )}
          >
            <MapPinIcon />
            Haritada aç
            <ArrowIcon className="transition-transform group-hover/btn:translate-x-0.5" />
          </motion.a>

          {event.note && (
            <motion.p
              variants={innerLine}
              className="mt-4 max-w-[18rem] font-serif text-xs italic text-muted"
            >
              {event.note}
            </motion.p>
          )}
        </motion.div>
      </article>

    </motion.li>
  );
}

function ConnectorLine({
  pathLength,
  count,
}: {
  pathLength: MotionValue<number> | number;
  count: number;
}) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
      viewBox="0 0 2 1000"
      preserveAspectRatio="none"
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="1000"
        stroke="var(--color-sage-deep)"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <motion.line
        x1="1"
        y1="0"
        x2="1"
        y2="1000"
        stroke="var(--color-sage-deep)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{ pathLength }}
      />
      {Array.from({ length: count - 1 }).map((_, i) => (
        <circle
          key={i}
          cx="1"
          cy={((i + 1) * 1000) / count}
          r="2.5"
          fill="var(--color-sage-deep)"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

function CardPaperFlourish() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 80"
      className="pointer-events-none absolute -right-2 -top-2 h-16 w-24 opacity-[0.55] sm:h-20 sm:w-28"
    >
      <path
        d="M115 5 Q 90 18 70 38 Q 55 55 38 70"
        stroke="var(--color-sage-deep)"
        strokeWidth="0.9"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="105"
        cy="14"
        rx="6"
        ry="2.4"
        fill="var(--color-sage)"
        opacity="0.7"
        transform="rotate(-45 105 14)"
      />
      <ellipse
        cx="90"
        cy="28"
        rx="7"
        ry="2.8"
        fill="var(--color-sage)"
        opacity="0.8"
        transform="rotate(-40 90 28)"
      />
      <ellipse
        cx="74"
        cy="44"
        rx="6"
        ry="2.5"
        fill="var(--color-sage-deep)"
        opacity="0.55"
        transform="rotate(28 74 44)"
      />
      <ellipse
        cx="58"
        cy="58"
        rx="6"
        ry="2.5"
        fill="var(--color-sage)"
        opacity="0.7"
        transform="rotate(-30 58 58)"
      />
      <circle cx="100" cy="22" r="1.4" fill="var(--color-blush)" opacity="0.85" />
      <circle cx="82" cy="38" r="1.2" fill="var(--color-coral)" opacity="0.7" />
    </svg>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
    >
      <span className="block h-px w-12 bg-sage-deep/40" />
      <span className="font-serif text-base text-sage-deep">❦</span>
      <span className="block h-px w-12 bg-sage-deep/40" />
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function ArrowIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 5 19 12 13 19" />
    </svg>
  );
}
