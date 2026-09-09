"use client";

import dynamic from "next/dynamic";

// app/destinations/[id]/page.tsx is a server component — same thin
// client-wrapper role as DestinationLandmark.tsx, so the WebGL canvas
// never touches SSR.
const GradientWave = dynamic(() => import("@/components/GradientWave").then((m) => m.GradientWave), { ssr: false });

export default function DestinationGradientBackdrop({ sky, accent }: { sky: [string, string]; accent: string }) {
  // Same accent-as-rarest-layer ordering as JourneyGradientStage's
  // colorsForDestination (see that file for why): base sky, then sky's own
  // second stop as the common wave layer, then a single sparing pass of
  // `accent`.
  //
  // No `darkenTop`: its shader term only subtracts from the green channel,
  // which reads as a plausible shadow on warm/neutral colors but produces
  // an outright magenta artifact on any destination whose accent carries
  // real blue alongside red — Amsterdam's lavender (#b98fd1) and the Alps'
  // icy white-blue (#c9d6dd) both did this in practice, confirmed via
  // screenshot. Not worth the risk for a subtle vignette every destination
  // doesn't equally need.
  return (
    <GradientWave
      colors={[sky[0], sky[1], accent]}
      noiseSpeed={0.0000035}
      noiseFrequency={[0.0001, 0.0003]}
      deform={{ incline: 0.14, noiseAmp: 70, noiseFlow: 1.8, offsetTop: -0.5, offsetBottom: -0.5 }}
    />
  );
}
