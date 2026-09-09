"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Data-only shape recipe for one landmark. Deliberately restricted to
 * Three.js primitive geometry (cone/cylinder/box/torus/ring/sphere) — see
 * lib/landmarkShapes.ts for the actual per-destination compositions. Kept
 * as plain data (not JSX) so recipes can be swapped at runtime without
 * remounting a whole component tree — see JourneyLandmarkStage, which
 * crossfades between recipes on a single shared canvas.
 */
export type LandmarkShape = {
  kind: "cone" | "cylinder" | "box" | "torus" | "ring" | "sphere";
  args: number[];
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}[];

function useReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    ref.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      ref.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return ref;
}

function buildGeometry(shape: LandmarkShape[number]): THREE.BufferGeometry {
  const a = shape.args;
  switch (shape.kind) {
    case "cone":
      return new THREE.ConeGeometry(a[0], a[1], a[2] ?? 8);
    case "cylinder":
      return new THREE.CylinderGeometry(a[0], a[1], a[2], a[3] ?? 8);
    case "box":
      return new THREE.BoxGeometry(a[0], a[1], a[2]);
    case "torus":
      return new THREE.TorusGeometry(a[0], a[1], a[2] ?? 8, a[3] ?? 16, a[4]);
    case "ring":
      return new THREE.RingGeometry(a[0], a[1], a[2] ?? 24);
    case "sphere":
      return new THREE.SphereGeometry(a[0], a[1] ?? 16, a[2] ?? 12);
    default:
      return new THREE.BoxGeometry(0.3, 0.3, 0.3);
  }
}

// Shared per-landmark material: a near-black lit base (a single fixed
// "sun" direction, echoing GlobeHero's lighting) plus a view-dependent
// fresnel rim tinted with the destination's accent — the same technique
// GlobeHero uses for its atmosphere shell, applied directly to the solid
// geometry instead of a separate glow shell so it stays cheap at this
// object count. uHover brightens the rim on interaction.
function createLandmarkMaterial(accent: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBaseColor: { value: new THREE.Color("#0c0d0f") },
      uAccent: { value: new THREE.Color(accent) },
      uLightDir: { value: new THREE.Vector3(0.45, 0.82, 0.55).normalize() },
      uRimPower: { value: 2.1 },
      uHover: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uBaseColor;
      uniform vec3 uAccent;
      uniform vec3 uLightDir;
      uniform float uRimPower;
      uniform float uHover;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 N = normalize(vNormal);
        if (!gl_FrontFacing) N = -N;
        float diff = max(dot(N, uLightDir), 0.0);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float rim = pow(1.0 - clamp(dot(viewDir, N), 0.0, 1.0), uRimPower);
        vec3 base = uBaseColor * (0.22 + 0.78 * diff);
        vec3 rimColor = uAccent * rim * (0.55 + uHover * 0.9);
        gl_FragColor = vec4(base + rimColor, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });
}

function ShapeMesh({ shape, material }: { shape: LandmarkShape[number]; material: THREE.Material }) {
  const geometry = useMemo(() => buildGeometry(shape), [shape]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={shape.position}
      rotation={shape.rotation ?? [0, 0, 0]}
      scale={shape.scale ?? 1}
    />
  );
}

/**
 * The landmark sculpture itself — idle float/rotation, optional pointer
 * drag, and hover feedback — with no <Canvas> of its own. Exported
 * separately so JourneyLandmarkStage (the homepage's single shared canvas)
 * can mount it directly alongside a crossfade wrapper, while
 * FloatingLandmark (below) wraps it in its own canvas for the card and
 * detail-page integrations.
 */
export function LandmarkObject({
  shapes,
  accent,
  interactive = true,
}: {
  shapes: LandmarkShape;
  accent: string;
  interactive?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const reducedMotionRef = useReducedMotion();
  const { gl } = useThree();

  const material = useMemo(() => createLandmarkMaterial(accent), [accent]);
  useEffect(() => () => material.dispose(), [material]);

  const hoverRef = useRef(0);
  const hoverTargetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const timeRef = useRef(Math.random() * 10);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !group.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      const s = 0.007;
      group.current.rotation.y += dx * s;
      group.current.rotation.x = THREE.MathUtils.clamp(group.current.rotation.x + dy * s, -0.55, 0.55);
      velocity.current = { x: dy * s, y: dx * s };
    };
    const onUp = () => {
      draggingRef.current = false;
      if (reducedMotionRef.current) velocity.current = { x: 0, y: 0 };
      gl.domElement.style.cursor = hoverTargetRef.current ? "grab" : "auto";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      draggingRef.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      gl.domElement.style.cursor = "grabbing";
    },
    [gl]
  );
  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      hoverTargetRef.current = 1;
      if (!draggingRef.current) gl.domElement.style.cursor = "grab";
    },
    [gl]
  );
  const handlePointerOut = useCallback(() => {
    hoverTargetRef.current = 0;
    if (!draggingRef.current) gl.domElement.style.cursor = "auto";
  }, []);

  useFrame((_state, delta) => {
    const g = group.current;
    if (!g) return;
    const reduced = reducedMotionRef.current;

    // Hover feedback: rim brightens (material uniform) + a restrained scale bump.
    hoverRef.current = THREE.MathUtils.damp(hoverRef.current, hoverTargetRef.current, 6, delta);
    material.uniforms.uHover.value = hoverRef.current;
    const targetScale = 1 + hoverRef.current * 0.045;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta));

    // Idle bob — slow, ambient, frozen down to a near-still drift under
    // prefers-reduced-motion (matches GlobeHero's reduced-motion handling).
    timeRef.current += delta;
    const bobSpeed = reduced ? 0.05 : 0.5;
    const bobAmp = reduced ? 0.008 : 0.09;
    g.position.y = Math.sin(timeRef.current * bobSpeed) * bobAmp;

    if (draggingRef.current) {
      // Rotation already applied directly in the pointermove handler.
    } else if (Math.abs(velocity.current.x) > 0.0002 || Math.abs(velocity.current.y) > 0.0002) {
      // Brief momentum decay after a drag release.
      g.rotation.y += velocity.current.y;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + velocity.current.x, -0.55, 0.55);
      velocity.current.x *= 0.9;
      velocity.current.y *= 0.9;
    } else {
      const idleSpeed = reduced ? 0.012 : 0.11;
      g.rotation.y += delta * idleSpeed;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0, 3, delta);
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={interactive ? handlePointerOver : undefined}
      onPointerOut={interactive ? handlePointerOut : undefined}
      onPointerDown={interactive ? handlePointerDown : undefined}
    >
      {shapes.map((shape, i) => (
        <ShapeMesh key={i} shape={shape} material={material} />
      ))}
    </group>
  );
}

export default function FloatingLandmark({
  shapes,
  accent,
  interactive = true,
  cameraPosition = [0, -0.1, 6.2],
  fov = 36,
}: {
  shapes: LandmarkShape;
  accent: string;
  interactive?: boolean;
  // Both default to the original card/homepage framing. DestinationLandmark
  // (the detail-page hero) passes a closer, narrower-fov override so the
  // same recipe reads as full-viewport central imagery there, per
  // DESIGN_LANDMARKS.md's "Full-Viewport 3D Hero Artifact" spec — nothing
  // else about the camera, lighting, or material changes between contexts.
  cameraPosition?: [number, number, number];
  fov?: number;
}) {
  return (
    <div className="absolute inset-0" style={interactive ? { touchAction: "none" } : undefined}>
      <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }} camera={{ position: cameraPosition, fov }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 3]} intensity={0.85} color="#f2e6cf" />
        <directionalLight position={[-3, -1, -2]} intensity={0.08} color="#3a3e44" />
        <LandmarkObject shapes={shapes} accent={accent} interactive={interactive} />
      </Canvas>
    </div>
  );
}
