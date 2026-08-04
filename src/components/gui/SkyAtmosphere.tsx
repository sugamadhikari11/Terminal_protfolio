"use client";

import React, { Suspense, useMemo } from "react";
import { BackSide, Color, ShaderMaterial } from "three";
import InteractiveClouds from "./InteractiveClouds";

/** Soft pale sky — keep in sync with Canvas clear + CSS --gui-sky + ModeCube */
export const GUI_SKY = "#c4dff2";
export const GUI_FOG = "#d5e8f6";

type SkyAtmosphereProps = {
  denseClouds?: boolean;
  showClouds?: boolean;
};

/**
 * Soft sky dome — a little blue up high, milky near the horizon (not neon blue).
 */
export default function SkyAtmosphere({
  denseClouds = false,
  showClouds = true,
}: SkyAtmosphereProps) {
  const skyMat = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new Color("#9cc8e8") },
          midColor: { value: new Color("#c4dff2") },
          bottomColor: { value: new Color("#e4f0f8") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPos;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            vec3 col = mix(bottomColor, midColor, smoothstep(-0.15, 0.3, h));
            col = mix(col, topColor, smoothstep(0.35, 0.95, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  return (
    <>
      <color attach="background" args={[GUI_SKY]} />
      <fog attach="fog" args={[GUI_FOG, denseClouds ? 22 : 28, denseClouds ? 80 : 110]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[10, 16, 5]} intensity={1.45} color="#fff6e0" />
      <hemisphereLight args={["#e8f2fa", "#a8c090", 0.48]} />

      <mesh scale={180}>
        <sphereGeometry args={[1, 32, 24]} />
        <primitive object={skyMat} attach="material" />
      </mesh>

      {showClouds ? (
        <Suspense fallback={null}>
          <InteractiveClouds variant="intro" />
        </Suspense>
      ) : null}
    </>
  );
}
