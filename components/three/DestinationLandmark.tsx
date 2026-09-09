"use client";

import dynamic from "next/dynamic";
import type { LandmarkShape } from "@/components/three/FloatingLandmark";

// app/destinations/[id]/page.tsx is a server component, and next/dynamic's
// { ssr: false } is only allowed from inside a client component — hence
// this thin client wrapper, same role as the dynamic() call already living
// in JourneyExperience.tsx for GlobeHero.
const FloatingLandmark = dynamic(() => import("@/components/three/FloatingLandmark"), { ssr: false });

export default function DestinationLandmark({ shapes, accent }: { shapes: LandmarkShape; accent: string }) {
  return <FloatingLandmark shapes={shapes} accent={accent} interactive />;
}
