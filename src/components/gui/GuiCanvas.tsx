"use client";

import React, { Suspense, useEffect, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import SkyAtmosphere, { GUI_SKY } from "./SkyAtmosphere";
import IntroPlaneScene from "./IntroPlaneScene";
import CloudWorldScene from "./CloudWorldScene";
import type { GuiPhase } from "./types";
import { PLANE_MODEL, preloadGuiModels } from "./preloadModels";

useGLTF.preload(PLANE_MODEL);

type GuiCanvasProps = {
  guiPhase: GuiPhase;
  holdPlane?: boolean;
  onIntroComplete: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  discovered: Set<string>;
  onDiscover: (id: string) => void;
  preview?: boolean;
  paused?: boolean;
  /** Phone layout: soft cloud veil in front of the colored plane */
  mobile?: boolean;
};

function SkyBackdrop({
  dense,
  showClouds,
}: {
  dense: boolean;
  showClouds: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <SkyAtmosphere denseClouds={dense} showClouds={showClouds} />
    </Suspense>
  );
}

export default function GuiCanvas({
  guiPhase,
  holdPlane = false,
  onIntroComplete,
  scrollRef,
  discovered,
  onDiscover,
  preview = false,
  paused = false,
  mobile = false,
}: GuiCanvasProps) {
  const showIntro = guiPhase === "intro" || guiPhase === "idle";
  const showWorld = guiPhase === "world";

  useEffect(() => {
    preloadGuiModels();
  }, []);

  return (
    <Canvas
      className="gui-canvas h-full w-full"
      style={{ width: "100%", height: "100%", display: "block", background: GUI_SKY }}
      dpr={preview || showIntro ? [1, 1.15] : [1, 1.5]}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.1, 6.5], fov: 38, near: 0.05, far: 300 }}
      shadows={showWorld && !preview && !mobile}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      onCreated={({ gl }) => {
        gl.setClearColor(GUI_SKY, 1);
      }}
    >
      {/* Intro: clear blue sky; world adds cloud banks */}
      <SkyBackdrop dense={false} showClouds={false} />

      {showIntro ? (
        <IntroPlaneScene
          active
          hold={holdPlane || guiPhase === "idle"}
          onComplete={onIntroComplete}
        />
      ) : null}

      {showWorld ? (
        <Suspense fallback={null}>
          <CloudWorldScene
            scrollRef={scrollRef}
            discovered={discovered}
            onDiscover={onDiscover}
            active
            mobile={mobile}
          />
        </Suspense>
      ) : null}
    </Canvas>
  );
}
