"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import WebGLErrorBoundary from "@/components/WebGLErrorBoundary";
import {
  PARIS_LANDMARKS,
  PARIS_NEIGHBORHOODS,
  actForProgress,
  landmarkForProgress,
  neighborhoodForProgress,
  type ParisLandmark,
  type ParisNeighborhood,
} from "@/lib/parisExperience";

// A wide, high establishing view over the whole arranged cluster — where
// Act 01 starts and Act 02 dollies down from.
const OVERVIEW_POS = new THREE.Vector3(2, 15, 13);
const OVERVIEW_LOOK = new THREE.Vector3(-1, 0.5, -2);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function focusFor(position: [number, number, number], height: number, close: boolean) {
  const dist = (height * 1.7 + 2.2) * (close ? 0.62 : 1);
  const camPos = new THREE.Vector3(position[0] + dist * 0.55, position[1] + height * (close ? 0.4 : 0.55), position[2] + dist * 0.85);
  const lookAt = new THREE.Vector3(position[0], position[1] + height * (close ? 0.3 : 0.35), position[2]);
  return { camPos, lookAt };
}

function CameraRig({ progressRef }: { progressRef: { current: number } }) {
  const goalPos = useRef(OVERVIEW_POS.clone());
  const goalLook = useRef(OVERVIEW_LOOK.clone());
  const currentLook = useRef(OVERVIEW_LOOK.clone());
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => (reducedRef.current = e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    const act = actForProgress(p);

    if (!act || act.id === "motion") {
      const t = act ? THREE.MathUtils.clamp(p / act.range[1], 0, 1) : 0;
      const eased = easeInOutCubic(t);
      const eiffel = PARIS_LANDMARKS[0];
      const focus = focusFor(eiffel.position, eiffel.height, false);
      goalPos.current.lerpVectors(OVERVIEW_POS, focus.camPos, eased);
      goalLook.current.lerpVectors(OVERVIEW_LOOK, focus.lookAt, eased);
    } else if (act.id === "icons") {
      const active = landmarkForProgress(p) ?? PARIS_LANDMARKS[PARIS_LANDMARKS.length - 1];
      const focus = focusFor(active.position, active.height, false);
      goalPos.current.copy(focus.camPos);
      goalLook.current.copy(focus.lookAt);
    } else {
      const active = neighborhoodForProgress(p) ?? PARIS_NEIGHBORHOODS[PARIS_NEIGHBORHOODS.length - 1];
      const focus = focusFor(active.position, active.height, true);
      goalPos.current.copy(focus.camPos);
      goalLook.current.copy(focus.lookAt);
    }

    const lambda = reducedRef.current ? 10 : 2.6;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, goalPos.current.x, lambda, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, goalPos.current.y, lambda, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, goalPos.current.z, lambda, delta);

    currentLook.current.x = THREE.MathUtils.damp(currentLook.current.x, goalLook.current.x, lambda, delta);
    currentLook.current.y = THREE.MathUtils.damp(currentLook.current.y, goalLook.current.y, lambda, delta);
    currentLook.current.z = THREE.MathUtils.damp(currentLook.current.z, goalLook.current.z, lambda, delta);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}

// A single real photo, standing in space as a color-graded billboard that
// always faces the camera. MeshBasicMaterial multiplies its texture by
// `color`, so a warm, darkened tint does the grading for free — no shader,
// no lights needed (this material ignores them, which is what we want:
// consistent exposure at every camera angle).
// Neighboring cards sit close together in the arranged cluster (it's a
// small city). A close-focus shot on one card would otherwise catch a
// billboard behind it rotating to face the camera and filling the frame —
// so every card not currently in focus dims toward near-invisible during
// Acts 02–03, leaving only the establishing "motion" overview showing the
// full scrapbook of photos at even brightness.
function PhotoCard({
  entry,
  tint,
  kind,
  progressRef,
}: {
  entry: ParisLandmark | ParisNeighborhood;
  tint: string;
  kind: "landmark" | "neighborhood";
  progressRef: { current: number };
}) {
  const texture = useLoader(THREE.TextureLoader, entry.photo);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const photoMat = useRef<THREE.MeshBasicMaterial>(null);
  const backingMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const p = progressRef.current;
    const act = actForProgress(p);
    let target = 1;
    if (act && act.id !== "motion") {
      // Montmartre (a neighborhood) has no card of its own — it reuses
      // Sacré-Cœur's landmark card, since it's literally the same hill.
      const activeId =
        act.id === "icons"
          ? landmarkForProgress(p)?.id
          : neighborhoodForProgress(p)?.id === "montmartre"
            ? "sacrecoeur"
            : neighborhoodForProgress(p)?.id;
      const activeKind: "landmark" | "neighborhood" =
        act.id === "icons" || neighborhoodForProgress(p)?.id === "montmartre" ? "landmark" : "neighborhood";
      const isFocused = kind === activeKind && entry.id === activeId;
      target = isFocused ? 1 : 0.08;
    }
    if (photoMat.current) photoMat.current.opacity = THREE.MathUtils.damp(photoMat.current.opacity, target, 4, delta);
    if (backingMat.current) backingMat.current.opacity = THREE.MathUtils.damp(backingMat.current.opacity, target * 0.85, 4, delta);
  });

  const width = entry.height * entry.aspect * 1.3;
  const height = entry.height * 1.3;

  return (
    <group position={entry.position}>
      <Billboard position={[0, height / 2, 0]}>
        {/* Soft dark backing, slightly behind and larger — reads as a
            frame/shadow so the photo edge doesn't float against fog. */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[width + 0.18, height + 0.18]} />
          <meshBasicMaterial ref={backingMat} color="#050403" transparent opacity={0.85} />
        </mesh>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial ref={photoMat} map={texture} color={tint} toneMapped={false} transparent opacity={1} />
        </mesh>
      </Billboard>
    </group>
  );
}

function Cityscape({ progressRef }: { progressRef: { current: number } }) {
  return (
    <>
      {PARIS_LANDMARKS.map((l) => (
        <PhotoCard key={l.id} entry={l} tint="#cbb08a" kind="landmark" progressRef={progressRef} />
      ))}
      {/* Montmartre (Act 03) shares Sacré-Cœur's exact position — it's
          literally the same hill — so it isn't re-rendered here. */}
      {PARIS_NEIGHBORHOODS.filter((n) => n.id !== "montmartre").map((n) => (
        <PhotoCard key={n.id} entry={n} tint="#d8bd91" kind="neighborhood" progressRef={progressRef} />
      ))}
    </>
  );
}

export default function ParisScene({ progress }: { progress: MotionValue<number> }) {
  const progressRef = useRef(0);
  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <div className="absolute inset-0">
      <WebGLErrorBoundary fallback={<ParisSceneFallback />}>
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: OVERVIEW_POS.toArray(), fov: 42 }}
          onCreated={({ scene, gl }) => {
            scene.fog = new THREE.FogExp2(0x120e0a, 0.032);
            gl.setClearColor(0x0d0a08, 1);
          }}
        >
          <CameraRig progressRef={progressRef} />
          <Cityscape progressRef={progressRef} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

// Static stand-in when WebGL is unavailable: the Paris hero photo, dimmed
// into the scene's own warm near-black (its clear color and fog tint).
function ParisSceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "#0d0a08" }}>
      <Image src="/paris/hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-50" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(18,14,10,0.2) 0%, #0d0a08 85%)" }}
      />
    </div>
  );
}
