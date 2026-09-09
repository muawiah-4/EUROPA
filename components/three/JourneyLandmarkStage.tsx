"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { destinationForProgress } from "@/lib/journey";
import { LANDMARK_SHAPES } from "@/lib/landmarkShapes";
import { LandmarkObject } from "@/components/three/FloatingLandmark";

/**
 * The homepage's single shared landmark canvas — one persistent <Canvas>
 * (same pattern as GlobeHero) instead of one WebGL context per chapter.
 * Shape recipe + accent swap based on destinationForProgress(progress) as
 * the user scrolls, wrapped in a scale-down/scale-back-up envelope so a
 * recipe swap never pops: scale eases to ~0, the shapes swap underneath
 * (a full remount via `key`, so old geometry/material dispose cleanly),
 * then eases back to 1. The same envelope also handles fade in/out at the
 * very start (before Paris) and end (after Amsterdam), where
 * destinationForProgress returns null.
 */
function Stage({ progressRef }: { progressRef: { current: number } }) {
  const wrap = useRef<THREE.Group>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const phaseRef = useRef<"idle" | "out" | "in">("idle");
  const scaleRef = useRef(0.0001);
  const accentRef = useRef("#e8c07a");

  useFrame((_state, delta) => {
    const dest = destinationForProgress(progressRef.current);
    const targetId = dest ? dest.id : null;

    if (phaseRef.current === "idle" && targetId !== activeId) {
      pendingRef.current = targetId;
      phaseRef.current = "out";
    }

    if (phaseRef.current === "out") {
      scaleRef.current = THREE.MathUtils.damp(scaleRef.current, 0.0001, 10, delta);
      if (scaleRef.current < 0.01) {
        setActiveId(pendingRef.current);
        if (dest) accentRef.current = dest.accent;
        phaseRef.current = "in";
      }
    } else {
      const goal = targetId ? 1 : 0.0001;
      scaleRef.current = THREE.MathUtils.damp(scaleRef.current, goal, 6, delta);
      if (phaseRef.current === "in" && Math.abs(scaleRef.current - goal) < 0.01) {
        phaseRef.current = "idle";
      }
    }

    if (wrap.current) wrap.current.scale.setScalar(scaleRef.current);
  });

  const shapes = activeId ? LANDMARK_SHAPES[activeId] : null;

  return (
    <group ref={wrap}>
      {shapes && <LandmarkObject key={activeId} shapes={shapes} accent={accentRef.current} interactive={false} />}
    </group>
  );
}

export default function JourneyLandmarkStage({ progress }: { progress: MotionValue<number> }) {
  const progressRef = useRef(0);
  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, -0.1, 6.2], fov: 36 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 3]} intensity={0.85} color="#f2e6cf" />
        <directionalLight position={[-3, -1, -2]} intensity={0.08} color="#3a3e44" />
        <Stage progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
