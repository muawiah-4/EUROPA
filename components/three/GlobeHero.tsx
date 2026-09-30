"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { EUROPE_POINTS } from "@/lib/europeGeo";
import { DESTINATIONS, JOURNEY_MARKS } from "@/lib/journey";
import WebGLErrorBoundary from "@/components/WebGLErrorBoundary";

// The globe is only uncovered during the hero + cloud descent (until the
// opaque journey gradient stage has faded in over the first chapter) and
// again briefly at the very end, between that stage fading out and the
// opaque outro covering everything. Outside those windows the canvas stops
// rendering entirely (frameloop "never") — it stays mounted, so there's no
// remount flash scrolling back, and simply keeps its last frame.
const COVER_FADE = 0.02;
const COVER_START = DESTINATIONS[0].range[0] + COVER_FADE;
const COVER_END = DESTINATIONS[DESTINATIONS.length - 1].range[1] - COVER_FADE;
const OUTRO_OPAQUE = JOURNEY_MARKS.outroStart + 0.02;

function isGlobeVisible(p: number) {
  return p < COVER_START || (p > COVER_END && p < OUTRO_OPAQUE);
}

// Major destinations get a brighter marker point, matching the journey data.
// One shared mint marker color, not a per-destination accent palette — the
// entry hero is ambient background before any destination is chosen or
// focused, the same category AmbientBackground.tsx was already fixed for
// (a multi-hue moment with no engaged context to justify it, per the site's
// closed-accent-economy rule). Per-destination accent stays reserved for a
// destination's own card/page, where it's an engaged, single-subject choice.
const MARKER_COLOR = "#3bba9c";

const CITY_MARKERS: { lat: number; lon: number; color: string }[] = [
  { lat: 48.85, lon: 2.35, color: MARKER_COLOR }, // Paris
  { lat: 41.9, lon: 12.49, color: MARKER_COLOR }, // Rome
  { lat: 36.4, lon: 25.43, color: MARKER_COLOR }, // Santorini
  { lat: 45.44, lon: 12.33, color: MARKER_COLOR }, // Venice
  { lat: 46.5, lon: 8.0, color: MARKER_COLOR }, // Alps
  { lat: 51.5, lon: -0.12, color: MARKER_COLOR }, // London
  { lat: 41.38, lon: 2.17, color: MARKER_COLOR }, // Barcelona
  { lat: 52.37, lon: 4.9, color: MARKER_COLOR }, // Amsterdam
  { lat: 50.08, lon: 14.44, color: MARKER_COLOR }, // Prague
  { lat: 64.96, lon: -19.02, color: MARKER_COLOR }, // Iceland — sits apart from the cluster, geographically honest
];

// The globe's single "sun" tint — reused verbatim from the Paris marker
// color so the atmosphere glow never introduces a hue outside the existing
// per-destination accent palette. Paris is also the first chapter the hero
// dollies into, so a golden-hour rim glow reads as a deliberate handoff.
const SUN_TINT = "#e8c07a";

function toVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 90) * (Math.PI / 180);
  return new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function easeOutCubic(t: number) {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

// Soft, additively-blended circular sprites instead of default square GL
// points — this alone is most of what separates "point cloud" from "dust
// caught in light." Per-vertex size + alpha attributes give the field
// density and depth variation without any extra draw calls.
function createSoftPointsMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aAlpha;
      varying float vAlpha;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize / max(-mvPosition.z, 0.001);
        gl_Position = projectionMatrix * mvPosition;
        float depthFade = clamp(1.0 - (-mvPosition.z - 2.0) / 9.0, 0.25, 1.0);
        vAlpha = aAlpha * depthFade;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float mask = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(uColor, mask * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// Classic view-dependent fresnel/limb-glow shader, rendered on the inside
// of a slightly larger shell (BackSide + additive) so it reads as a soft
// atmospheric halo rather than a flat outline. Intensity is modulated by
// the "sun" direction so the glow is brightest on the lit limb and fades
// on the dark side, like Earth photographed at dusk.
function createAtmosphereMaterial(sunDir: THREE.Vector3) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(SUN_TINT) },
      uSunDir: { value: sunDir.clone() },
      uPower: { value: 2.4 },
      uPulse: { value: 1 },
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
      uniform vec3 uColor;
      uniform vec3 uSunDir;
      uniform float uPower;
      uniform float uPulse;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float rim = pow(1.0 - clamp(dot(viewDir, vNormal), 0.0, 1.0), uPower);
        float sunFactor = smoothstep(-0.35, 0.65, dot(normalize(vWorldPos), uSunDir));
        float intensity = rim * mix(0.16, 1.0, sunFactor) * uPulse;
        gl_FragColor = vec4(uColor, intensity * 0.85);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// Procedural radial-gradient texture for the city glow sprites and the big
// ambient halo behind the globe — generated at runtime on a canvas, so no
// external image asset is ever loaded.
function createGlowTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Europe's landmass hint, thickened into a hazy cluster: each anchor point
// keeps a bright "core" and gains a few dimmer, size-varied neighbors so
// the shape reads as a soft cloud of light rather than isolated dots.
function buildLandData() {
  const positions: number[] = [];
  const sizes: number[] = [];
  const alphas: number[] = [];
  EUROPE_POINTS.forEach(([lat, lon]) => {
    const core = toVec3(lat, lon, 2.015);
    positions.push(core.x, core.y, core.z);
    sizes.push(30);
    alphas.push(0.85);
    for (let j = 0; j < 3; j++) {
      const jLat = lat + (Math.random() - 0.5) * 2.4;
      const jLon = lon + (Math.random() - 0.5) * 2.8;
      const jr = 2.0 + Math.random() * 0.045;
      const p = toVec3(jLat, jLon, jr);
      positions.push(p.x, p.y, p.z);
      sizes.push(12 + Math.random() * 14);
      alphas.push(0.16 + Math.random() * 0.28);
    }
  });
  return {
    positions: new Float32Array(positions),
    sizes: new Float32Array(sizes),
    alphas: new Float32Array(alphas),
  };
}

// Ambient dust/star field, layered into a "near" haze band and a "far"
// starfield band so depth attenuation gives real parallax-like richness
// instead of a flat, uniform scatter.
function buildDustData(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const near = Math.random() < 0.55;
    const r = near ? 2.35 + Math.random() * 1.7 : 4.2 + Math.random() * 3.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = near ? 9 + Math.random() * 15 : 3 + Math.random() * 7;
    alphas[i] = near ? 0.32 + Math.random() * 0.32 : 0.1 + Math.random() * 0.18;
  }
  return { positions, sizes, alphas };
}

// A single expanding, fading ring — tangent to the globe's surface at the
// marker's position (oriented via the same position-as-normal technique
// used elsewhere in this file for surface-aligned geometry), looping on a
// fixed period with a phase offset so a marker's two rings pulse
// staggered rather than in lockstep. Was a flat, non-animated glow sprite;
// this is the piece that was actually missing to read as "pulsing."
function PulsingRing({ position, color, phase }: { position: THREE.Vector3; color: string; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }), [color]);
  useEffect(() => () => material.dispose(), [material]);

  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [position]);

  const period = 2.4;
  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime + phase) % period) / period;
    const scale = 0.3 + t * 1.4;
    ref.current.scale.setScalar(scale);
    material.opacity = (1 - t) * 0.55;
  });

  return (
    <mesh ref={ref} position={position} quaternion={quaternion} material={material}>
      <ringGeometry args={[0.026, 0.034, 32]} />
    </mesh>
  );
}

function Globe({ progressRef }: { progressRef: { current: number } }) {
  const group = useRef<THREE.Group>(null);
  const camGoal = useRef({ x: 0, y: 0.4, z: 6.4 });
  const reducedMotionRef = useRef(false);
  const timeRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // A single "sun" direction drives both the standard-material lighting
  // and the fresnel atmosphere shader's limb brightness, so the two stay
  // visually locked to the same light source.
  const sunDir = useMemo(() => new THREE.Vector3(4, 1.6, 3.2).normalize(), []);
  const sunPosition = useMemo<[number, number, number]>(() => [sunDir.x * 6, sunDir.y * 6, sunDir.z * 6], [sunDir]);

  const glowTexture = useMemo(() => createGlowTexture(), []);
  const landData = useMemo(() => buildLandData(), []);
  const dustData = useMemo(() => buildDustData(1800), []);

  const landMaterial = useMemo(() => createSoftPointsMaterial("#cdc9bf"), []);
  const dustMaterial = useMemo(() => createSoftPointsMaterial("#7a7873"), []);
  const atmosphereMaterial = useMemo(() => createAtmosphereMaterial(sunDir), [sunDir]);

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
      landMaterial.dispose();
      dustMaterial.dispose();
      atmosphereMaterial.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, rawDelta) => {
    const reduced = reducedMotionRef.current;
    // The frame loop is paused while the globe is covered; clamp the first
    // delta after resuming so rotation doesn't jump by the whole pause.
    const delta = Math.min(rawDelta, 0.1);

    if (group.current) {
      group.current.rotation.y += delta * (reduced ? 0.006 : 0.045);
    }

    // Slow atmosphere "breathing" — frozen under reduced motion.
    if (!reduced) {
      timeRef.current += delta;
      atmosphereMaterial.uniforms.uPulse.value = 0.92 + 0.08 * Math.sin(timeRef.current * 0.6);
    }

    // Cinematic dolly: ease-out rather than linear, with a slight lateral
    // + vertical arc so the camera reads as flying in along a path rather
    // than zooming straight down the z-axis.
    const p = progressRef.current;
    const t = Math.min(p / 0.08, 1);
    const eased = easeOutCubic(t);
    camGoal.current.z = THREE.MathUtils.lerp(6.4, 3.1, eased);
    camGoal.current.x = Math.sin(eased * Math.PI * 0.5) * 0.42;
    camGoal.current.y = THREE.MathUtils.lerp(0.4, 0.12, eased);

    const lambda = reduced ? 8 : 4;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camGoal.current.z, lambda, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, camGoal.current.x, lambda, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camGoal.current.y, lambda, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.06} />
      <directionalLight position={sunPosition} intensity={1.3} color="#f2e6cf" />
      <directionalLight position={[-sunPosition[0], -sunPosition[1] * 0.5, -sunPosition[2]]} intensity={0.05} color="#3a3e44" />

      <group ref={group}>
        {/* Base sphere — near-black, lit from one side like orbit-at-dusk photography */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial color="#0a0b0d" roughness={0.82} metalness={0.18} />
        </mesh>

        {/* Fresnel atmosphere shell — the rim/limb glow */}
        <mesh>
          <sphereGeometry args={[2.09, 48, 48]} />
          <primitive object={atmosphereMaterial} attach="material" />
        </mesh>

        {/* Europe point-cloud landmass hint, thickened for depth */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[landData.positions, 3]} />
            <bufferAttribute attach="attributes-aSize" args={[landData.sizes, 1]} />
            <bufferAttribute attach="attributes-aAlpha" args={[landData.alphas, 1]} />
          </bufferGeometry>
          <primitive object={landMaterial} attach="material" />
        </points>

        {/* City glow markers: solid core + soft additive halo */}
        {CITY_MARKERS.map((c, i) => {
          const pos = toVec3(c.lat, c.lon, 2.03);
          return (
            <group key={i} position={pos}>
              <mesh>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
              {glowTexture && (
                <sprite scale={[0.22, 0.22, 1]}>
                  <spriteMaterial
                    map={glowTexture}
                    color={c.color}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                  />
                </sprite>
              )}
            </group>
          );
        })}

        {/* Pulsing rings, staggered per marker so the whole globe doesn't
            beat in unison — the same "pulse" idea as the pasted cobe-based
            reference component, built as real 3D geometry in this globe's
            own established techniques instead of pulling in a second,
            unrelated globe library alongside the one this site already has. */}
        {CITY_MARKERS.map((c, i) => {
          const pos = toVec3(c.lat, c.lon, 2.03);
          return (
            <group key={`ring-${i}`}>
              <PulsingRing position={pos} color={c.color} phase={i * 0.35} />
              <PulsingRing position={pos} color={c.color} phase={i * 0.35 + 1.2} />
            </group>
          );
        })}
      </group>

      {/* Ambient dust/star field — static, not tied to the globe's rotation */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[dustData.sizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[dustData.alphas, 1]} />
        </bufferGeometry>
        <primitive object={dustMaterial} attach="material" />
      </points>

      {/* Large soft halo behind the globe for ambient bloom/depth */}
      {glowTexture && (
        <sprite scale={[6.4, 6.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={SUN_TINT}
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      )}
    </>
  );
}

export default function GlobeHero({ progress }: { progress: MotionValue<number> }) {
  const progressRef = useRef(0);
  const [visible, setVisible] = useState(() => isGlobeVisible(progress.get()));
  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
    setVisible(isGlobeVisible(v));
  });

  return (
    <div className="absolute inset-0">
      <WebGLErrorBoundary fallback={<GlobeFallback />}>
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0.4, 6.4], fov: 42 }}
        >
          <Globe progressRef={progressRef} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

// Static stand-in when WebGL is unavailable: the same near-black sphere
// with a warm SUN_TINT limb glow, drawn with CSS gradients.
function GlobeFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div
        className="aspect-square w-[min(80vw,80vh)] rounded-full"
        style={{
          background: "radial-gradient(circle at 62% 38%, #16171a 0%, #0a0b0d 58%)",
          boxShadow: `0 0 80px 6px ${SUN_TINT}33, inset -18px 10px 60px ${SUN_TINT}22`,
        }}
      />
    </div>
  );
}
