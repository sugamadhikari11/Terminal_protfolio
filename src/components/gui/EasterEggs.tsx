"use client";

import React, { useMemo, useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { easterEggs, type EasterEgg } from "../../data/easterEggs";

function EggHotspot({
  egg,
  discovered,
  onDiscover,
}: {
  egg: EasterEgg;
  discovered: boolean;
  onDiscover: (id: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = egg.position[1] + Math.sin(t * 1.4 + egg.position[0]) * 0.08;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    mat.opacity = discovered ? 0.7 : hovered ? 0.45 : 0.12;
    mat.emissiveIntensity = discovered || hovered ? 0.85 : 0.2;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onDiscover(egg.id);
  };

  return (
    <group position={egg.position}>
      <mesh
        ref={mesh}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color={discovered ? "#0ea5e9" : "#7dd3fc"}
          emissive="#38bdf8"
          emissiveIntensity={0.25}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
      <AnimatePresence>
        {(discovered || hovered) && (
          <Html distanceFactor={6} position={[0, 0.35, 0]} center>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              className="pointer-events-auto max-w-[220px] rounded border border-sky-700/30 bg-white/85 px-3 py-2 font-mono text-[11px] text-sky-950 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-sky-700">
                {egg.label}
              </div>
              <p className="leading-relaxed text-sky-900/75">{egg.detail}</p>
              {egg.href ? (
                <a
                  href={egg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sky-700 underline"
                >
                  open ↗
                </a>
              ) : null}
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </group>
  );
}

type EasterEggsProps = {
  discovered: Set<string>;
  onDiscover: (id: string) => void;
};

export default function EasterEggs({ discovered, onDiscover }: EasterEggsProps) {
  const eggs = useMemo(() => easterEggs, []);

  return (
    <group>
      {eggs.map((egg) => (
        <EggHotspot
          key={egg.id}
          egg={egg}
          discovered={discovered.has(egg.id)}
          onDiscover={onDiscover}
        />
      ))}
    </group>
  );
}
