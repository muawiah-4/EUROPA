"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useScroll } from "framer-motion";
import { DESTINATIONS, JOURNEY_LENGTH_VH, JOURNEY_MARKS } from "@/lib/journey";
import {
  StoryChapterBackground,
  StoryChapterForeground,
  useChapterOpacity,
  TEXT_HALF_WIDTH,
} from "@/components/StoryChapter";
import CloudDescent from "@/components/CloudDescent";
import ProgressRail from "@/components/ProgressRail";
import InteractiveMap from "@/components/InteractiveMap";
import EndSequence from "@/components/EndSequence";
import HeroTitle from "@/components/HeroTitle";
import HeroGradientBackdrop from "@/components/HeroGradientBackdrop";
import JourneyGradientStage from "@/components/JourneyGradientStage";

// React Three Fiber touches the DOM/WebGL context — must stay client-only,
// never evaluated during SSR.
const GlobeHero = dynamic(() => import("@/components/three/GlobeHero"), { ssr: false });

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
        <HeroGradientBackdrop progress={scrollYProgress} heroEnd={JOURNEY_MARKS.heroEnd} />
        <GlobeHero progress={scrollYProgress} />
        <HeroTitle progress={scrollYProgress} heroEnd={JOURNEY_MARKS.heroEnd} />
        <CloudDescent progress={scrollYProgress} range={[JOURNEY_MARKS.heroEnd - 0.02, JOURNEY_MARKS.descentEnd]} />

        {/*
          Chapters are split into background (sky + atmosphere particles)
          and foreground (typography) layers — no 3D landmark canvas
          between them anymore, see JourneyGradientStage for the animated
          backdrop that replaces it.
        */}
        <JourneyGradientStage progress={scrollYProgress} />

        {DESTINATIONS.map((d) => (
          <ChapterBackgroundLayer key={d.id} destination={d} progress={scrollYProgress} />
        ))}

        {DESTINATIONS.map((d) => (
          <ChapterForegroundLayer key={d.id} destination={d} progress={scrollYProgress} />
        ))}

        <InteractiveMap progress={scrollYProgress} onSelect={scrollToFraction} />
        <EndSequence progress={scrollYProgress} onRestart={restart} />

        <ProgressRail progress={scrollYProgress} onSelect={scrollToFraction} />
      </div>
    </div>
  );
}

function ChapterBackgroundLayer({
  destination,
  progress,
}: {
  destination: (typeof DESTINATIONS)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Every destination fades in AND out — none of the 8 chapters are the
  // true start/end of the page (the globe hero precedes Paris, the map and
  // outro follow Amsterdam), so this always uses the full crossfade curve.
  const opacity = useChapterOpacity(progress, destination.range, false, false);
  return <StoryChapterBackground destination={destination} opacity={opacity} />;
}

function ChapterForegroundLayer({
  destination,
  progress,
}: {
  destination: (typeof DESTINATIONS)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useChapterOpacity(progress, destination.range, false, false, TEXT_HALF_WIDTH);
  return <StoryChapterForeground destination={destination} opacity={opacity} />;
}
