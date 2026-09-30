"use client";

import dynamic from "next/dynamic";

// app/destinations/[id]/page.tsx is a server component — this thin
// client wrapper exists so the WebGL canvas never touches SSR.
const GradientWave = dynamic(() => import("@/components/GradientWave").then((m) => m.GradientWave), { ssr: false });

export default function DestinationGradientBackdrop({ sky, accent }: { sky: [string, string]; accent: string }) {
  // Same base ordering as JourneyGradientStage's colorsForDestination: base
  // sky, then sky's own second stop as the common wave layer. `accent` is
  // now repeated (rather than the single sparing pass this used to be) so
  // it gets real presence in the wave, per the site's move toward a more
  // colorful, less muted look.
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
      colors={[sky[0], sky[1], accent, accent]}
      noiseSpeed={0.0000035}
      noiseFrequency={[0.0001, 0.0003]}
      deform={{ incline: 0.14, noiseAmp: 70, noiseFlow: 1.8, offsetTop: -0.5, offsetBottom: -0.5 }}
    />
  );
}
