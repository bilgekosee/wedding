"use client";

import { motion, type Variants } from "motion/react";

const frameVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

// Tight radial mask: only the central ~35% stays fully opaque, everything
// past ~70% is fully transparent. The model's baked grey vignette dissolves
// into the page background almost completely.
const RADIAL_MASK =
  "radial-gradient(ellipse 50% 45% at center, black 30%, rgba(0,0,0,0.7) 50%, transparent 75%)";

function buildEmbedUrl(modelId: string) {
  return `https://sketchfab.com/models/${modelId}/embed?autostart=1&autospin=0.4&preload=1&transparent=1&dnt=1&ui_controls=0&ui_general_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_animations=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_sound=0&ui_start=0&ui_loading=0&ui_color=f7f3ec`;
}

export function RingsSection({
  modelId,
  caption,
  ariaLabel = "Yüzükler",
}: {
  modelId: string;
  caption?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className="relative mx-auto w-full max-w-[260px] px-4 text-ink sm:max-w-sm sm:px-6"
    >
      <motion.div
        variants={frameVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4 / 3" }}
      >
        {/* Eager-mount: iframe is in the initial HTML so the browser starts
            fetching Sketchfab while the user is still in the envelope/hero,
            paired with <link rel="preconnect"> in the root layout.
            multiply: model white center × cream page bg → cream.
            mask: outer grey vignette fades to transparent so the page
            background shows through cleanly. Rings appear to float.
            translate-y nudge brings the model (which Sketchfab renders in
            the upper third of its viewport) closer to the visual centre. */}
        <iframe
          title={`${ariaLabel} — 3B model`}
          src={buildEmbedUrl(modelId)}
          className="pointer-events-auto absolute left-1/2 top-1/2 h-[140%] w-[115%] -translate-x-1/2 -translate-y-[40%]"
          style={{
            mixBlendMode: "multiply",
            maskImage: RADIAL_MASK,
            WebkitMaskImage: RADIAL_MASK,
          }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

      {caption && (
        <p className="mt-2 text-center font-serif text-[10px] italic uppercase tracking-[0.3em] text-muted sm:text-[11px]">
          {caption}
        </p>
      )}
    </section>
  );
}
