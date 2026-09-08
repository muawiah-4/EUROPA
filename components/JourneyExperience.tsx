"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useScroll } from "framer-motion";
import { DESTINATIONS, JOURNEY_LENGTH_VH, JOURNEY_MARKS } from "@/lib/journey";
import StoryChapter, { useChapterOpacity } from "@/components/StoryChapter";
import CloudDescent from "@/components/CloudDescent";
import ProgressRail from "@/components/ProgressRail";
import InteractiveMap from "@/components/InteractiveMap";
import EndSequence from "@/components/EndSequence";
import HeroTitle from "@/components/HeroTitle";
import ParisScene from "@/components/scenes/ParisScene";
import RomeScene from "@/components/scenes/RomeScene";
import SantoriniScene from "@/components/scenes/SantoriniScene";
import VeniceScene from "@/components/scenes/VeniceScene";
import AlpsScene from "@/components/scenes/AlpsScene";
import LondonScene from "@/components/scenes/LondonScene";
import BarcelonaScene from "@/components/scenes/BarcelonaScene";
import AmsterdamScene from "@/components/scenes/AmsterdamScene";

// React Three Fiber touches the DOM/WebGL context — must stay client-only,
// never evaluated during SSR.
const GlobeHero = dynamic(() => import("@/components/three/GlobeHero"), { ssr: false });

const LANDMARKS: Record<string, React.ComponentType> = {
  paris: ParisScene,
  rome: RomeScene,
  santorini: SantoriniScene,
  venice: VeniceScene,
  alps: AlpsScene,
  london: LondonScene,
  barcelona: BarcelonaScene,
  amsterdam: AmsterdamScene,
};

export default function JourneyExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollToFraction = useCallback((fraction: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const target = containerTop + Math.min(1, Math.max(0, fraction)) * scrollRange;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const restart = useCallback(() => scrollToFraction(0), [scrollToFraction]);

  return (
    <div ref={containerRef} style={{ height: `${JOURNEY_LENGTH_VH}vh` }} className="relative bg-void">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <GlobeHero progress={scrollYProgress} />
        <HeroTitle progress={scrollYProgress} heroEnd={JOURNEY_MARKS.heroEnd} />
        <CloudDescent progress={scrollYProgress} range={[JOURNEY_MARKS.heroEnd - 0.02, JOURNEY_MARKS.descentEnd]} />

        {DESTINATIONS.map((d) => {
          const Landmark = LANDMARKS[d.id];
          return (
            <ChapterLayer
              key={d.id}
              destination={d}
              progress={scrollYProgress}
              landmark={Landmark ? <Landmark /> : null}
            />
          );
        })}

        <InteractiveMap progress={scrollYProgress} onSelect={scrollToFraction} />
        <EndSequence progress={scrollYProgress} onRestart={restart} />

        <ProgressRail progress={scrollYProgress} onSelect={scrollToFraction} />
      </div>
    </div>
  );
}

function ChapterLayer({
  destination,
  progress,
  landmark,
}: {
  destination: (typeof DESTINATIONS)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  landmark: React.ReactNode;
}) {
  // Every destination fades in AND out — none of the 8 chapters are the
  // true start/end of the page (the globe hero precedes Paris, the map and
  // outro follow Amsterdam), so this always uses the full crossfade curve.
  // Passing isFirst/isLast here previously clamped Paris to opacity 1 for
  // the entire hero + cloud-descent phase (0 to 0.14) instead of fading in
  // at its own range start — a real bug, not just a taste call.
  const opacity = useChapterOpacity(progress, destination.range, false, false);
  return <StoryChapter destination={destination} opacity={opacity} landmark={landmark} />;
}
