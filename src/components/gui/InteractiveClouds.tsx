"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";
import { MeshLambertMaterial } from "three";

type CloudSpec = {
  seed: number;
  home: [number, number, number];
  opacity: number;
  speed: number;
  segments: number;
  volume: number;
  fade: number;
  color: string;
};

/**
 * Sparse world clouds — left / right / far only.
 * Keep a clear pocket around the home plane (~3.3, 1.4, 2.1) so it stays readable,
 * with blue sky peeks between banks.
 */
const WORLD_CLOUDS: CloudSpec[] = [
  { seed: 10, home: [-5.8, 2.6, -3], opacity: 0.48, speed: 0.028, segments: 14, volume: 5.2, fade: 14, color: "#ffffff" },
  { seed: 11, home: [-7.0, 3.8, -10], opacity: 0.42, speed: 0.018, segments: 16, volume: 6.0, fade: 18, color: "#eef6ff" },
  { seed: 12, home: [0.2, 4.4, -14], opacity: 0.4, speed: 0.014, segments: 16, volume: 6.5, fade: 20, color: "#ffffff" },
  { seed: 13, home: [6.4, 3.2, -8], opacity: 0.45, speed: 0.022, segments: 14, volume: 5.4, fade: 16, color: "#f5fbff" },
  { seed: 14, home: [7.2, 1.8, -1.5], opacity: 0.4, speed: 0.03, segments: 12, volume: 4.4, fade: 12, color: "#ffffff" },
  { seed: 15, home: [-4.8, 0.8, 1.5], opacity: 0.38, speed: 0.032, segments: 12, volume: 4.0, fade: 11, color: "#e8f4ff" },
  { seed: 16, home: [5.5, 4.6, -16], opacity: 0.38, speed: 0.012, segments: 15, volume: 5.8, fade: 22, color: "#dcecff" },
  { seed: 17, home: [-2.5, 3.6, -7], opacity: 0.36, speed: 0.02, segments: 12, volume: 4.6, fade: 15, color: "#ffffff" },
];

/**
 * Mobile only: soft mist in front of a smaller, deeper plane (plane reads lightly).
 * Front banks sit closer to the camera (higher Z) than the plane (~z ≤ 1.2).
 * Desktop never uses this set.
 */
const MOBILE_VEIL_CLOUDS: CloudSpec[] = [
  { seed: 10, home: [-4.2, 2.6, -6], opacity: 0.22, speed: 0.02, segments: 11, volume: 3.8, fade: 18, color: "#ffffff" },
  { seed: 11, home: [4.4, 2.8, -7], opacity: 0.2, speed: 0.018, segments: 11, volume: 3.8, fade: 18, color: "#eef6ff" },
  // Front veil — between camera (~6–8) and plane (~0–1); kept mid-low under copy
  { seed: 20, home: [0.2, 0.55, 3.6], opacity: 0.34, speed: 0.014, segments: 11, volume: 3.6, fade: 11, color: "#ffffff" },
  { seed: 21, home: [-1.0, 0.7, 3.35], opacity: 0.3, speed: 0.013, segments: 10, volume: 3.2, fade: 12, color: "#f0f7ff" },
  { seed: 22, home: [1.2, 0.4, 3.2], opacity: 0.28, speed: 0.015, segments: 10, volume: 3.0, fade: 11, color: "#eef6ff" },
  { seed: 23, home: [0.0, 0.85, 3.0], opacity: 0.26, speed: 0.012, segments: 10, volume: 2.9, fade: 13, color: "#f5fbff" },
  { seed: 24, home: [-0.4, 0.3, 3.8], opacity: 0.22, speed: 0.016, segments: 9, volume: 2.7, fade: 12, color: "#ffffff" },
  { seed: 25, home: [0.9, 0.95, 2.85], opacity: 0.2, speed: 0.014, segments: 9, volume: 2.5, fade: 14, color: "#e8f4ff" },
];

const INTRO_CLOUDS: CloudSpec[] = [
  { seed: 1, home: [-6.5, 3.0, -10], opacity: 0.42, speed: 0.03, segments: 14, volume: 5.5, fade: 16, color: "#ffffff" },
  { seed: 2, home: [6.0, 3.6, -12], opacity: 0.4, speed: 0.026, segments: 14, volume: 5.5, fade: 16, color: "#eef7ff" },
  { seed: 3, home: [0, 4.5, -18], opacity: 0.38, speed: 0.018, segments: 15, volume: 6.0, fade: 20, color: "#ffffff" },
  { seed: 4, home: [-4.0, 1.2, -2], opacity: 0.35, speed: 0.035, segments: 12, volume: 4.0, fade: 12, color: "#f5fbff" },
  { seed: 5, home: [4.2, 1.5, -3], opacity: 0.35, speed: 0.032, segments: 12, volume: 4.0, fade: 12, color: "#eef6ff" },
];

type InteractiveCloudsProps = {
  variant?: "world" | "intro";
  /** Phone: soft front veil over the colored plane */
  veil?: boolean;
};

/** Soft drifting clouds — no mouse parting. */
export default function InteractiveClouds({
  variant = "world",
  veil = false,
}: InteractiveCloudsProps) {
  const specs =
    variant === "intro" ? INTRO_CLOUDS : veil ? MOBILE_VEIL_CLOUDS : WORLD_CLOUDS;

  return (
    <Clouds
      material={MeshLambertMaterial}
      limit={veil ? 140 : 160}
      frustumCulled={false}
      renderOrder={veil ? 4 : 0}
    >
      {specs.map((spec) => (
        <DriftingCloud key={spec.seed} spec={spec} front={veil} />
      ))}
    </Clouds>
  );
}

function DriftingCloud({
  spec,
  front = false,
}: {
  spec: CloudSpec;
  front?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const home = useMemo(() => new THREE.Vector3(...spec.home), [spec.home]);

  useFrame(() => {
    if (!ref.current) return;
    const t = performance.now() * 0.001;
    ref.current.position.x = home.x + Math.sin(t * spec.speed * 2.1 + spec.seed) * 0.35;
    ref.current.position.y = home.y + Math.cos(t * spec.speed * 1.4 + spec.seed * 0.7) * 0.18;
    ref.current.position.z = home.z;
  });

  return (
    <group ref={ref} position={spec.home} renderOrder={front ? 4 : 0}>
      <Cloud
        seed={spec.seed}
        opacity={spec.opacity}
        speed={spec.speed}
        segments={spec.segments}
        volume={spec.volume}
        fade={spec.fade}
        color={spec.color}
        {...(front ? { depthWrite: false } : {})}
      />
    </group>
  );
}
