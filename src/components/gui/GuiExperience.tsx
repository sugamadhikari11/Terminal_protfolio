"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GuiCanvas from "./GuiCanvas";
import GuiErrorBoundary from "./GuiErrorBoundary";
import SectionCopy from "./SectionCopy";
import { useGuiScrollDrive } from "./useGuiScrollDrive";
import { ensurePlaneLoaded, isPlaneLoaded, preloadGuiModels } from "./preloadModels";
import type { GuiPhase } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileGuiPortfolio from "./MobileGuiPortfolio";

/** Desktop only — mobile GUI never mounts WebGL / the plane */
if (typeof window !== "undefined" && window.innerWidth >= 768) {
  preloadGuiModels();
}

function MobileGuiFaceSky() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "linear-gradient(160deg, #c4dff2 0%, #d8eef8 42%, #b8d8ee 100%)",
      }}
      aria-hidden
    />
  );
}

type GuiExperienceProps = {
  fullscreen?: boolean;
  /** Mount canvas inside expanding card to compile shaders before intro */
  warmCanvas?: boolean;
  /** Show last world state on the cube GUI face (not blank sky) */
  preview?: boolean;
  /** Freeze the WebGL loop while the face is hidden */
  paused?: boolean;
  autoFly?: boolean;
  loadProgressHint?: number;
  /** Resume world immediately (session restore) */
  skipIntro?: boolean;
};

/**
 * Sky hold → warm canvas → smooth plane fly-through → home.
 * After the first visit, `preview` keeps the scene on the cube face.
 */
export default function GuiExperience({
  fullscreen = false,
  warmCanvas = false,
  preview = false,
  paused = false,
  autoFly = false,
  loadProgressHint = 0,
  skipIntro = false,
}: GuiExperienceProps) {
  const isMobile = useIsMobile();
  const [guiPhase, setGuiPhase] = useState<GuiPhase>("idle");
  const [planeReady, setPlaneReady] = useState(() => isPlaneLoaded());
  const [loadProgress, setLoadProgress] = useState(() =>
    isPlaneLoaded() ? 1 : loadProgressHint
  );
  const [canvasWarm, setCanvasWarm] = useState(false);
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const hadWorldRef = useRef(skipIntro);

  useGuiScrollDrive(guiPhase, rootRef, scrollRef);

  useEffect(() => {
    if (loadProgressHint > loadProgress) setLoadProgress(loadProgressHint);
  }, [loadProgressHint, loadProgress]);

  useEffect(() => {
    if (isMobile) {
      setPlaneReady(true);
      setLoadProgress(1);
      return;
    }

    let cancelled = false;
    if (isPlaneLoaded()) {
      setPlaneReady(true);
      setLoadProgress(1);
      return;
    }

    const soft = window.setInterval(() => {
      if (cancelled) return;
      setLoadProgress((p) => (p < 0.88 ? Math.min(0.88, p + 0.04) : p));
    }, 90);

    ensurePlaneLoaded((p) => {
      if (!cancelled) setLoadProgress((prev) => Math.max(prev, p));
    })
      .then(() => {
        if (cancelled) return;
        setLoadProgress(1);
        setPlaneReady(true);
      })
      .catch(() => {
        if (!cancelled) setPlaneReady(true);
      });

    return () => {
      cancelled = true;
      window.clearInterval(soft);
    };
  }, [isMobile]);

  const canvasActive = (fullscreen || warmCanvas || preview) && planeReady;

  useEffect(() => {
    if (!canvasActive) {
      setCanvasWarm(false);
      return;
    }
    let frames = 0;
    let raf = 0;
    const tick = () => {
      frames += 1;
      if (frames >= 4) {
        setCanvasWarm(true);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [canvasActive]);

  // Cube-face preview: keep the last world (never blank blue)
  useEffect(() => {
    if (preview) {
      setGuiPhase("world");
      return;
    }
    if (fullscreen && autoFly) return;
    if (warmCanvas) return;
    startedRef.current = false;
    setGuiPhase("idle");
  }, [preview, fullscreen, autoFly, warmCanvas]);

  // Intro (or resume world) when fullscreen settles
  useEffect(() => {
    if (skipIntro) hadWorldRef.current = true;
    if (!autoFly || !fullscreen || !planeReady || !canvasWarm || startedRef.current) {
      return;
    }
    startedRef.current = true;
    // Re-enter / session restore: skip intro, land on the preserved world
    if (hadWorldRef.current || skipIntro) {
      setGuiPhase("world");
    } else {
      setGuiPhase("intro");
    }
  }, [autoFly, fullscreen, planeReady, canvasWarm, skipIntro]);

  const onIntroComplete = useCallback(() => {
    hadWorldRef.current = true;
    setGuiPhase("world");
  }, []);

  useEffect(() => {
    if (guiPhase === "world") hadWorldRef.current = true;
  }, [guiPhase]);

  useEffect(() => {
    if (guiPhase !== "intro") return;
    const t = window.setTimeout(() => {
      hadWorldRef.current = true;
      setGuiPhase("world");
    }, 4800);
    return () => window.clearTimeout(t);
  }, [guiPhase]);

  const onDiscover = useCallback((id: string) => {
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const showCanvas =
    canvasActive && (guiPhase === "idle" || guiPhase === "intro" || guiPhase === "world");
  // Never cover a preview / live world with solid sky
  const skyCover =
    !preview && (!fullscreen || guiPhase === "idle") && !(warmCanvas && guiPhase === "world");

  // ── Mobile: never mount WebGL/plane (fullscreen OR cube-face morph/preview) ──
  if (isMobile) {
    if (fullscreen) return <MobileGuiPortfolio />;
    return <MobileGuiFaceSky />;
  }

  return (
    <div
      ref={rootRef}
      className={[
        "gui-experience overflow-hidden bg-[var(--gui-sky,#c4dff2)]",
        fullscreen
          ? "fixed inset-0 z-[30] h-dvh w-screen"
          : "relative h-full min-h-full w-full",
      ].join(" ")}
    >
      <div className="absolute inset-0 z-0">
        {showCanvas ? (
          <GuiErrorBoundary>
            <GuiCanvas
              guiPhase={guiPhase === "idle" ? "intro" : guiPhase}
              holdPlane={guiPhase === "idle"}
              onIntroComplete={onIntroComplete}
              scrollRef={scrollRef}
              discovered={discovered}
              onDiscover={onDiscover}
              preview={preview}
              paused={paused}
              mobile={false}
            />
          </GuiErrorBoundary>
        ) : (
          <div className="h-full w-full bg-[var(--gui-sky,#c4dff2)]" aria-hidden />
        )}
      </div>

      <AnimatePresence>
        {skyCover ? (
          <motion.div
            key="gui-sky-cover"
            className={[
              "absolute inset-0 z-30 bg-[var(--gui-sky,#c4dff2)]",
              !fullscreen ? "pointer-events-none" : "",
            ].join(" ")}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
      </AnimatePresence>

      {guiPhase === "intro" && fullscreen ? (
        <button
          type="button"
          onClick={() => {
            hadWorldRef.current = true;
            setGuiPhase("world");
          }}
          className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 border border-white/50 bg-white/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-sky-950 backdrop-blur-sm hover:bg-white/50 sm:bottom-8 sm:right-6"
        >
          Skip
        </button>
      ) : null}

      {(fullscreen || preview) && guiPhase === "world" ? (
        <SectionCopy scrollRef={scrollRef} />
      ) : null}

      <div
        ref={scrollRef}
        className="pointer-events-none absolute inset-0 z-[-1] overflow-y-auto opacity-0"
        aria-hidden
      >
        <div className="h-[1400vh] w-full" />
      </div>
    </div>
  );
}
