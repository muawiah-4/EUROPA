"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, type MotionValue } from "framer-motion";
import { DESTINATIONS, JOURNEY_LENGTH_VH, JOURNEY_MARKS } from "@/lib/journey";
import { track } from "@/lib/analytics";
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

  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Every downstream animation (camera moves, chapter fades, the globe's
  // dolly) reads this instead of the raw scroll value. Raw scrollYProgress
  // tracks the wheel/trackpad 1:1, which feels abrupt on the kind of large,
  // continuous camera moves this page does — a light spring gives the
  // catch-up/ease feel of premium scrollytelling sites without touching
  // any of the site's actual scroll-jacking (there isn't any; this only
  // smooths what's already driven by native scroll position). Tuned
  // stiff/damped rather than loose+bouncy: it should feel like inertia,
  // not like the page is fighting the scroll.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 300, damping: 40, mass: 0.4 });

  const scrollToFraction = useCallback((fraction: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const target = containerTop + Math.min(1, Math.max(0, fraction)) * scrollRange;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  // Report each destination chapter once per page view as the scroll reaches
  // it. Reads the raw scroll (not the spring) so it reflects where the user is.
  const reachedChaptersRef = useRef(new Set<number>());
  useMotionValueEvent(rawProgress, "change", (p) => {
    const idx = chapterIndexForProgress(p);
    if (idx < 0 || reachedChaptersRef.current.has(idx)) return;
    reachedChaptersRef.current.add(idx);
    track("journey_chapter_reached", { destination: DESTINATIONS[idx].id, chapter: idx + 1 });
  });

  const restart = useCallback(() => scrollToFraction(0), [scrollToFraction]);

  return (
    <div ref={containerRef} style={{ height: `${JOURNEY_LENGTH_VH}vh` }} className="relative bg-void">
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ willChange: "transform" }}>
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

        {DESTINATIONS.map((d, i) => (
          <ChapterBackgroundLayer key={d.id} destination={d} index={i} progress={scrollYProgress} />
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

// Index of the chapter the scroll position is in: -1 before the first
// chapter starts (hero/descent), last index once past the final one.
function chapterIndexForProgress(p: number) {
  let idx = -1;
  for (let i = 0; i < DESTINATIONS.length; i++) {
    if (p >= DESTINATIONS[i].range[0]) idx = i;
  }
  return idx;
}

function isNearChapter(p: number, index: number) {
  return Math.abs(chapterIndexForProgress(p) - index) <= 1;
}

function ChapterBackgroundLayer({
  destination,
  index,
  progress,
}: {
  destination: (typeof DESTINATIONS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // Every destination fades in AND out — none of the 8 chapters are the
  // true start/end of the page (the globe hero precedes Paris, the map and
  // outro follow Amsterdam), so this always uses the full crossfade curve.
  const opacity = useChapterOpacity(progress, destination.range, false, false);

  // Particles only animate while this layer is actually visible.
  const [active, setActive] = useState(() => opacity.get() > 0.001);
  useMotionValueEvent(opacity, "change", (v) => setActive(v > 0.001));

  // Photos load for the active chapter and its neighbours, and stay loaded
  // once requested so scrolling back never re-fetches or flashes.
  const [loadPhoto, setLoadPhoto] = useState(() => isNearChapter(progress.get(), index));
  useMotionValueEvent(progress, "change", (p) => {
    if (!loadPhoto && isNearChapter(p, index)) setLoadPhoto(true);
  });

  return (
    <StoryChapterBackground
      destination={destination}
      opacity={opacity}
      active={active}
      loadPhoto={loadPhoto}
      priority={index === 0}
    />
  );
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
