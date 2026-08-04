"use client";

import React from "react";
import dynamic from "next/dynamic";

const GuiExperience = dynamic(
  () =>
    import(/* webpackChunkName: "gui-experience" */ "./GuiExperience").then(
      (m) => m.default
    ),
  {
    ssr: false,
    loading: () => <CubeFaceLoader progress={0} />,
  }
);

function CubeFaceLoader({ progress }: { progress: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[var(--gui-sky,#c4dff2)]">
      <p className="font-mono text-[11px] tracking-[0.35em] text-sky-950/70">
        LOADING
      </p>
      <div className="mt-4 h-[2px] w-36 overflow-hidden bg-sky-950/15">
        <div
          className="h-full bg-sky-950/65 transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2.5 font-mono text-[10px] tracking-[0.28em] text-sky-950/40">
        {pct}%
      </p>
    </div>
  );
}

type GuiFaceContentProps = {
  guiReady: boolean;
  /** Mount experience during arm / morph / settle / cube-face preview */
  showExperience: boolean;
  /** True after the box has zoomed to cover the viewport */
  fullscreen: boolean;
  /** Mount WebGL during expand (inside the card) to warm shaders */
  warmCanvas?: boolean;
  /** Keep last GUI scene on the cube face (not blank sky) */
  preview?: boolean;
  /** Pause WebGL while the GUI face is hidden on the terminal side */
  paused?: boolean;
  /** Loading UI on the cube GUI face after GUI is clicked */
  faceLoading?: boolean;
  loadProgress?: number;
  /** Fire intro only once fullscreen has settled */
  autoFly?: boolean;
  /** Session restore into GUI — land in world, skip intro */
  skipIntro?: boolean;
};

/**
 * Cube GUI face: loading when GUI is clicked; live/preview scene afterward
 * so switching back to terminal never leaves a blank blue face.
 */
export default function GuiFaceContent({
  guiReady,
  showExperience,
  fullscreen,
  warmCanvas = false,
  preview = false,
  paused = false,
  faceLoading = false,
  loadProgress = 0,
  autoFly = false,
  skipIntro = false,
}: GuiFaceContentProps) {
  if (!guiReady || !showExperience) {
    return <div className="h-full w-full bg-[var(--gui-sky,#c4dff2)]" aria-hidden />;
  }

  // First-time load only — never cover a preview of the live GUI
  if (faceLoading && !fullscreen && !warmCanvas && !preview) {
    return <CubeFaceLoader progress={loadProgress} />;
  }

  return (
    <GuiExperience
      fullscreen={fullscreen}
      warmCanvas={warmCanvas}
      preview={preview}
      paused={paused}
      autoFly={autoFly}
      skipIntro={skipIntro}
      loadProgressHint={loadProgress}
    />
  );
}
