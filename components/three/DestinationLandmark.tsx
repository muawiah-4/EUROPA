"use client";

import dynamic from "next/dynamic";
import type { LandmarkShape } from "@/components/three/FloatingLandmark";

// app/destinations/[id]/page.tsx is a server component, and next/dynamic's
// { ssr: false } is only allowed from inside a client component — hence
// this thin client wrapper, same role as the dynamic() call already living
// in JourneyExperience.tsx for GlobeHero.
const FloatingLandmark = dynamic(() => import("@/components/three/FloatingLandmark"), { ssr: false });

export default function DestinationLandmark({ shapes, accent }: { shapes: LandmarkShape; accent: string }) {
  // Detail-page hero framing: a closer camera + narrower fov than the
  // card/homepage default so the (now much more structurally detailed)
  // model fills the viewport height as the page's central imagery, per
  // DESIGN_LANDMARKS.md's "Full-Viewport 3D Hero Artifact" spec. Fov is a
  // vertical field of view in three.js, so this framing scales with the
  // hero section's height regardless of viewport width.
  return <FloatingLandmark shapes={shapes} accent={accent} interactive cameraPosition={[0, -0.05, 6.2]} fov={34} />;
}
