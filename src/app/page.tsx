"use client";

import { useState } from "react";

import { CitiesSection } from "@/components/cities-section";
import { CountdownSection } from "@/components/countdown-section";
import { EnvelopeIntro } from "@/components/envelope-intro";
import { EventsSection } from "@/components/events-section";
import { HeroNameplate } from "@/components/hero-nameplate";
import { LeafBranch } from "@/components/leaf-branch";
import { RingsSection } from "@/components/rings-section";
import { SiteFooter } from "@/components/site-footer";
import VaporizeTextCycle, {
  Tag,
} from "@/components/ui/vapour-text-effect";
import { cn } from "@/lib/utils";

const heroPhrases = [
  "Bir söz",
  "Bir aşk",
  "Bir hayat",
  "Sonsuza dek",
];

export default function Home() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <EnvelopeIntro onDone={() => setRevealed(true)} />
      <section
        className={cn(
          "relative flex min-h-svh flex-col items-center justify-center gap-10 overflow-hidden bg-cream px-6 py-16 text-ink transition-opacity duration-1000",
          revealed ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!revealed}
      >
        {/* Sağ üst — 3 dal, köşede küme, farklı açı/boy */}
        <LeafBranch
          offset={0}
          className={cn(
            "-right-6 -top-6 w-40 transition-all duration-[1400ms] ease-out sm:w-56 lg:w-72",
            revealed
              ? "translate-x-0 translate-y-0 opacity-100 delay-300"
              : "translate-x-32 -translate-y-32 opacity-0",
          )}
        />
        <LeafBranch
          offset={0.7}
          className={cn(
            "-right-10 top-6 w-28 rotate-[30deg] transition-all duration-[1400ms] ease-out sm:top-10 sm:w-36 lg:w-48",
            revealed
              ? "translate-x-0 translate-y-0 opacity-85 delay-500"
              : "translate-x-32 -translate-y-20 opacity-0",
          )}
        />
        <LeafBranch
          offset={1.4}
          className={cn(
            "right-6 -top-10 w-28 rotate-[-25deg] transition-all duration-[1400ms] ease-out sm:right-10 sm:w-36 lg:w-48",
            revealed
              ? "translate-x-0 translate-y-0 opacity-85 delay-700"
              : "translate-x-20 -translate-y-32 opacity-0",
          )}
        />

        {/* Sol alt — sağ üstün aynası */}
        <LeafBranch
          offset={2.1}
          className={cn(
            "-bottom-6 -left-6 w-40 rotate-180 transition-all duration-[1400ms] ease-out sm:w-56 lg:w-72",
            revealed
              ? "translate-x-0 translate-y-0 opacity-100 delay-500"
              : "-translate-x-32 translate-y-32 opacity-0",
          )}
        />
        <LeafBranch
          offset={2.8}
          className={cn(
            "-left-10 bottom-6 w-28 rotate-[210deg] transition-all duration-[1400ms] ease-out sm:bottom-10 sm:w-36 lg:w-48",
            revealed
              ? "translate-x-0 translate-y-0 opacity-85 delay-700"
              : "-translate-x-32 translate-y-20 opacity-0",
          )}
        />
        <LeafBranch
          offset={3.5}
          className={cn(
            "left-6 -bottom-10 w-28 rotate-[155deg] transition-all duration-[1400ms] ease-out sm:left-10 sm:w-36 lg:w-48",
            revealed
              ? "translate-x-0 translate-y-0 opacity-85 delay-900"
              : "-translate-x-20 translate-y-32 opacity-0",
          )}
        />

        {revealed && (
          <>
            <div className="relative h-20 w-full max-w-md sm:h-24">
              <VaporizeTextCycle
                texts={heroPhrases}
                font={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: "56px",
                  fontWeight: 700,
                }}
                color="rgb(95, 117, 83)"
                spread={4}
                density={6}
                animation={{
                  vaporizeDuration: 1.8,
                  fadeInDuration: 1,
                  waitDuration: 1.2,
                }}
                direction="left-to-right"
                alignment="center"
                tag={Tag.P}
              />
            </div>
            <HeroNameplate play={revealed} />
          </>
        )}
      </section>
      <div
        className={cn(
          "bg-cream transition-opacity duration-1000",
          revealed ? "opacity-100 delay-500" : "opacity-0",
        )}
        aria-hidden={!revealed}
      >
        <RingsSection modelId="99310b3e19b6419ab4663ac415458d80" />
        <CountdownSection />
        <SectionDivider />
        <EventsSection />
        <SectionDivider />
        <CitiesSection />
        <SiteFooter />
      </div>
    </>
  );
}

function SectionDivider() {
  return (
    <div
      aria-hidden
      className="mx-auto flex w-full max-w-md items-center justify-center gap-2 px-6"
    >
      <span className="block h-px w-16 bg-sage-deep/25" />
      <span className="block h-1.5 w-1.5 rounded-full bg-sage-deep/40" />
      <span className="block h-px w-16 bg-sage-deep/25" />
    </div>
  );
}

