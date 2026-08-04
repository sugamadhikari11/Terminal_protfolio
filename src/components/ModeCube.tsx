"use client";

import React, { useCallback, useEffect, useState } from "react";
import Terminal from "./Terminal";
import GuiFaceContent from "./gui/GuiFaceContent";
import {
  readGuiVisited,
  readSessionMode,
  writeGuiVisited,
  writeSessionMode,
} from "@/lib/sessionMode";

type Mode = "terminal" | "gui";
type Phase = "terminal" | "spinning" | "expanding" | "gui" | "collapsing";

const SPIN_MS = 3600;
const EXPAND_MS = 1100;
const PERSPECTIVE = 1400;
/** Outer morph letterbox stays black; sky fill for the GUI face / stage */
const GUI_BG = "#050805";
const GUI_SKY = "#c4dff2";

type CubeSize = {
  width: number;
  height: number;
  depth: number;
};

function computeCubeSize(): CubeSize {
  if (typeof window === "undefined") {
    return { width: 1180, height: 820, depth: 780 };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 768;
  if (mobile) {
    // Fill the phone frame — faces use these via --cube-* vars
    const width = Math.round(Math.max(280, w - 8));
    const height = Math.round(Math.max(420, h - 8));
    const depth = Math.round(Math.min(width, height) * 0.55);
    return { width, height, depth };
  }
  const width = Math.round(Math.min(w * 0.92, 1280));
  const height = Math.round(h * 0.9);
  const depth = Math.round(Math.min(width, height) * 0.95);
  return { width, height, depth };
}

function applyCubeCssVars(el: HTMLElement, s: CubeSize) {
  el.style.setProperty("--cube-w", `${s.width}px`);
  el.style.setProperty("--cube-h", `${s.height}px`);
  el.style.setProperty("--cube-depth", `${s.depth}px`);
}

function waitFrames(n = 2) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) resolve();
      else requestAnimationFrame(() => step(left - 1));
    };
    step(n);
  });
}

function clearAnims(el: HTMLElement | null) {
  if (!el) return;
  el.getAnimations().forEach((a) => a.cancel());
}

async function runAnim(
  el: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
) {
  clearAnims(el);
  const animation = el.animate(keyframes, { fill: "forwards", ...options });
  try {
    await animation.finished;
  } catch {
    // aborted
  }
  // Commit end state BEFORE cancel — cancel alone reverts and looks like a disappear
  try {
    animation.commitStyles();
  } catch {
    const end = keyframes[keyframes.length - 1];
    if (end && typeof end === "object") {
      Object.assign(el.style, end as React.CSSProperties);
    }
  }
  animation.cancel();
}

const ModeCube: React.FC = () => {
  const [mode, setMode] = useState<Mode>("terminal");
  const [phase, setPhase] = useState<Phase>("terminal");
  /** Settled yaw only — updated after spins so React doesn't fight WAAPI mid-turn */
  const [faceYaw, setFaceYaw] = useState(0);
  const [guiReady, setGuiReady] = useState(false);
  const [stageEl, setStageEl] = useState<HTMLDivElement | null>(null);
  const [cubeEl, setCubeEl] = useState<HTMLDivElement | null>(null);
  const [sceneEl, setSceneEl] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState<CubeSize>({
    width: 1180,
    height: 820,
    depth: 780,
  });
  /** Width/height while morphing — kept in React so expand/collapse don't snap */
  const [shell, setShell] = useState<{ w: number; h: number } | null>(null);
  /** GUI clicked — show loader on cube face while plane warms */
  const [armingGui, setArmingGui] = useState(false);
  const [planeProgress, setPlaneProgress] = useState(0);
  /** After first GUI visit, keep the scene on the cube face (not blank blue) */
  const [guiVisited, setGuiVisited] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  /** Restored into fullscreen GUI — skip plane intro */
  const [resumeGuiWorld, setResumeGuiWorld] = useState(false);

  // Restore terminal/GUI preference for this browser session
  useEffect(() => {
    const saved = readSessionMode();
    const visited = readGuiVisited();
    const nextSize = computeCubeSize();
    setSize(nextSize);
    if (visited) setGuiVisited(true);
    if (saved === "gui") {
      setMode("gui");
      setFaceYaw(-180);
      setGuiVisited(true);
      setGuiReady(true);
      setResumeGuiWorld(true);
      setPhase("gui");
      writeGuiVisited(true);
      writeSessionMode("gui");
    } else {
      writeSessionMode("terminal");
    }
    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    if (phase === "gui") writeSessionMode("gui");
    if (phase === "terminal") writeSessionMode("terminal");
  }, [phase, sessionReady]);

  useEffect(() => {
    if (guiVisited) writeGuiVisited(true);
  }, [guiVisited]);

  useEffect(() => {
    const t = window.setTimeout(() => setGuiReady(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const sync = () => setSize(computeCubeSize());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const busy = phase === "spinning" || phase === "expanding" || phase === "collapsing";
  // Full-page document only when settled; collapse uses the same 2D card as expand
  const flatLayout = phase === "gui";
  const half = size.depth / 2;
  const halfW = size.width / 2;
  const halfH = size.height / 2;
  const restZ = -half;

  const applyTerminalRest = useCallback(
    (override?: CubeSize) => {
      if (!stageEl || !cubeEl || !sceneEl) return;
      const s = override ?? size;
      const z = -(s.depth / 2);
      clearAnims(stageEl);
      clearAnims(cubeEl);
      clearAnims(sceneEl);
      applyCubeCssVars(sceneEl, s);
      sceneEl.style.clipPath = "";
      sceneEl.style.perspective = "";
      stageEl.style.visibility = "visible";
      stageEl.style.opacity = "1";
      stageEl.style.width = `${s.width}px`;
      stageEl.style.height = `${s.height}px`;
      stageEl.style.transform = `translateZ(${z}px) scale(1)`;
      cubeEl.style.width = `${s.width}px`;
      cubeEl.style.height = `${s.height}px`;
      cubeEl.style.transform = "rotateX(0deg) rotateY(0deg)";
      // Front/back faces size from CSS vars — force sync so mobile isn't stuck on desktop dims
      stageEl.querySelectorAll<HTMLElement>(".cube-face--front, .cube-face--back").forEach((face) => {
        face.style.width = `${s.width}px`;
        face.style.height = `${s.height}px`;
        face.style.marginLeft = `${-s.width / 2}px`;
        face.style.marginTop = `${-s.height / 2}px`;
      });
      setFaceYaw(0);
    },
    [cubeEl, sceneEl, size, stageEl]
  );

  const applyGuiCubeRest = useCallback(
    (override?: CubeSize) => {
      if (!stageEl || !cubeEl || !sceneEl) return;
      const s = override ?? size;
      const z = -(s.depth / 2);
      clearAnims(stageEl);
      clearAnims(cubeEl);
      clearAnims(sceneEl);
      applyCubeCssVars(sceneEl, s);
      sceneEl.style.clipPath = "";
      stageEl.style.visibility = "visible";
      stageEl.style.opacity = "1";
      stageEl.style.width = `${s.width}px`;
      stageEl.style.height = `${s.height}px`;
      stageEl.style.transform = `translateZ(${z}px) scale(1)`;
      cubeEl.style.width = `${s.width}px`;
      cubeEl.style.height = `${s.height}px`;
      cubeEl.style.transform = "rotateX(0deg) rotateY(-180deg)";
      stageEl.querySelectorAll<HTMLElement>(".cube-face--front, .cube-face--back").forEach((face) => {
        face.style.width = `${s.width}px`;
        face.style.height = `${s.height}px`;
        face.style.marginLeft = `${-s.width / 2}px`;
        face.style.marginTop = `${-s.height / 2}px`;
      });
      setFaceYaw(-180);
    },
    [cubeEl, sceneEl, size, stageEl]
  );

  const flip = useCallback(async () => {
    if (!cubeEl || !stageEl || !sceneEl || busy) return;

    setGuiReady(true);
    const next: Mode = mode === "terminal" ? "gui" : "terminal";
    // Persist as soon as the user commits — survive mid-transition refresh
    writeSessionMode(next);

    // --- Fullscreen GUI → shrink into cube-sized card (same color / hero fit) ---
    if (mode === "gui") {
      // Bring hero into view so the box shows natural top content, not a hard crop mid-page
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      const portfolio = stageEl.querySelector<HTMLElement>(".gui-portfolio");
      if (portfolio) portfolio.scrollTop = 0;
      await new Promise<void>((r) => window.setTimeout(r, 280));

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const backFace = stageEl.querySelector<HTMLElement>(".cube-face--back");
      const target = computeCubeSize();
      setSize(target);
      applyCubeCssVars(sceneEl, target);
      await waitFrames(2);

      setGuiVisited(true);
      setShell({ w: vw, h: vh });
      setPhase("collapsing");
      // Letterbox black; the shrinking card keeps the live GUI (sky), not blank fill
      sceneEl.style.backgroundColor = GUI_BG;
      await waitFrames(2);

      stageEl.style.transform = "none";
      stageEl.style.backgroundColor = GUI_SKY;
      cubeEl.style.transform = "none";
      if (backFace) {
        backFace.style.borderColor = "rgba(52, 211, 153, 0)";
        backFace.style.backgroundColor = "transparent";
      }

      await Promise.all([
        runAnim(
          stageEl,
          [
            {
              width: `${vw}px`,
              height: `${vh}px`,
              backgroundColor: GUI_SKY,
            },
            {
              width: `${target.width}px`,
              height: `${target.height}px`,
              backgroundColor: GUI_SKY,
            },
          ],
          {
            duration: EXPAND_MS,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          }
        ),
        backFace
          ? runAnim(
              backFace,
              [
                { borderColor: "rgba(52, 211, 153, 0)" },
                { borderColor: "rgba(52, 211, 153, 0.35)" },
              ],
              {
                duration: EXPAND_MS * 0.75,
                easing: "ease-out",
              }
            )
          : Promise.resolve(),
      ]);

      setShell({ w: target.width, h: target.height });
      stageEl.style.backgroundColor = GUI_SKY;
      if (backFace) {
        backFace.style.borderColor = "rgba(52, 211, 153, 0.35)";
        backFace.style.backgroundColor = "transparent";
      }

      await waitFrames(1);
      applyGuiCubeRest(target);
      setShell(null);
      sceneEl.style.backgroundColor = "";
      stageEl.style.backgroundColor = "";
      if (backFace) {
        backFace.style.borderColor = "";
        backFace.style.backgroundColor = "";
      }
    }

    // --- Cube spin: only 0 ↔ -180 so every return lands the same ---
    setPhase("spinning");
    const spinSize = computeCubeSize();
    setSize(spinSize);
    applyCubeCssVars(sceneEl, spinSize);
    await waitFrames(2);
    const spinHalf = spinSize.depth / 2;
    const spinRestZ = -spinHalf;
    const spinHalfW = spinSize.width / 2;
    const spinHalfH = spinSize.height / 2;

    if (next === "gui") {
      applyTerminalRest(spinSize);
      setArmingGui(true);
      setPlaneProgress(0);
      // Load on the GUI face during spin — intro waits until this finishes
      void import("./gui/preloadModels").then((m) =>
        m.ensurePlaneLoaded((p) => setPlaneProgress(p))
      );
    } else {
      setArmingGui(false);
      applyGuiCubeRest(spinSize);
    }

    stageEl.style.visibility = "visible";
    stageEl.style.opacity = "1";

    const sideFaces = stageEl.querySelectorAll<HTMLElement>(".cube-face--side");
    sideFaces.forEach((el) => {
      clearAnims(el);
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });
    // Size side faces to the live phone/desktop cube (not stale desktop dims)
    const right = stageEl.querySelector<HTMLElement>(".cube-face--right");
    const left = stageEl.querySelector<HTMLElement>(".cube-face--left");
    const top = stageEl.querySelector<HTMLElement>(".cube-face--top");
    const bottom = stageEl.querySelector<HTMLElement>(".cube-face--bottom");
    if (right) {
      right.style.width = `${spinSize.depth}px`;
      right.style.height = `${spinSize.height}px`;
      right.style.transform = `rotateY(90deg) translateZ(${spinHalfW}px)`;
    }
    if (left) {
      left.style.width = `${spinSize.depth}px`;
      left.style.height = `${spinSize.height}px`;
      left.style.transform = `rotateY(-90deg) translateZ(${spinHalfW}px)`;
    }
    if (top) {
      top.style.width = `${spinSize.width}px`;
      top.style.height = `${spinSize.depth}px`;
      top.style.transform = `rotateX(90deg) translateZ(${spinHalfH}px)`;
    }
    if (bottom) {
      bottom.style.width = `${spinSize.width}px`;
      bottom.style.height = `${spinSize.depth}px`;
      bottom.style.transform = `rotateX(-90deg) translateZ(${spinHalfH}px)`;
    }

    const from = faceYaw;
    const to = next === "gui" ? -180 : 0;
    const pullZ = spinRestZ - spinHalf * 0.55;

    const stageSpin = stageEl.animate(
      [
        { transform: `translateZ(${spinRestZ}px) scale(1)` },
        {
          transform: `translateZ(${spinRestZ - spinHalf * 0.12}px) scale(0.94)`,
          offset: 0.1,
        },
        {
          transform: `translateZ(${pullZ}px) scale(0.72)`,
          offset: 0.24,
        },
        {
          transform: `translateZ(${pullZ}px) scale(0.72)`,
          offset: 0.76,
        },
        {
          transform: `translateZ(${spinRestZ - spinHalf * 0.12}px) scale(0.94)`,
          offset: 0.9,
        },
        { transform: `translateZ(${spinRestZ}px) scale(1)` },
      ],
      {
        duration: SPIN_MS,
        easing: "cubic-bezier(0.4, 0.05, 0.15, 1)",
        fill: "forwards",
      }
    );

    const cubeSpin = cubeEl.animate(
      [
        { transform: `rotateX(0deg) rotateY(${from}deg)` },
        {
          transform: `rotateX(-8deg) rotateY(${from + (to - from) * 0.08}deg)`,
          offset: 0.12,
        },
        {
          transform: `rotateX(-22deg) rotateY(${from + (to - from) * 0.28}deg)`,
          offset: 0.28,
        },
        {
          transform: `rotateX(-22deg) rotateY(${from + (to - from) * 0.72}deg)`,
          offset: 0.72,
        },
        {
          transform: `rotateX(-8deg) rotateY(${from + (to - from) * 0.92}deg)`,
          offset: 0.88,
        },
        { transform: `rotateX(0deg) rotateY(${to}deg)` },
      ],
      {
        duration: SPIN_MS,
        easing: "cubic-bezier(0.4, 0.05, 0.15, 1)",
        fill: "forwards",
      }
    );

    try {
      await Promise.all([stageSpin.finished, cubeSpin.finished]);
    } catch {
      // aborted
    }
    stageSpin.cancel();
    cubeSpin.cancel();
    setFaceYaw(to);
    cubeEl.style.transform = `rotateX(0deg) rotateY(${to}deg)`;
    stageEl.style.transform = `translateZ(${spinRestZ}px) scale(1)`;

    // --- Cube GUI face → fullscreen ---
    // Flatten to a 2D card (same color as GUI), grow it, commit size, then settle.
    if (next === "gui") {
      clearAnims(stageEl);
      clearAnims(cubeEl);
      sideFaces.forEach((el) => {
        clearAnims(el);
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      });

      // Stay on the cube face with LOADING until the plane is ready — smooth intro
      setFaceYaw(-180);
      try {
        const { ensurePlaneLoaded } = await import("./gui/preloadModels");
        await ensurePlaneLoaded((p) => setPlaneProgress(p));
        setPlaneProgress(1);
      } catch {
        setPlaneProgress(1);
      }

      setMode("gui");
      setArmingGui(false);
      const fromSize = computeCubeSize();
      setSize(fromSize);
      setShell({ w: fromSize.width, h: fromSize.height });
      setPhase("expanding");
      // Letterbox black; the growing card itself is sky-blue like the GUI
      sceneEl.style.backgroundColor = GUI_BG;
      await waitFrames(2);

      const backFace = stageEl.querySelector<HTMLElement>(".cube-face--back");
      stageEl.style.transform = "none";
      stageEl.style.backgroundColor = GUI_SKY;
      cubeEl.style.transform = "none";
      if (backFace) {
        backFace.style.borderColor = "rgba(52, 211, 153, 0.35)";
        backFace.style.backgroundColor = GUI_SKY;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      await Promise.all([
        runAnim(
          stageEl,
          [
            {
              width: `${fromSize.width}px`,
              height: `${fromSize.height}px`,
              backgroundColor: GUI_SKY,
            },
            {
              width: `${vw}px`,
              height: `${vh}px`,
              backgroundColor: GUI_SKY,
            },
          ],
          {
            duration: EXPAND_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        ),
        backFace
          ? runAnim(
              backFace,
              [
                { borderColor: "rgba(52, 211, 153, 0.35)" },
                { borderColor: "rgba(52, 211, 153, 0)" },
              ],
              {
                duration: EXPAND_MS * 0.85,
                easing: "ease-out",
              }
            )
          : Promise.resolve(),
      ]);

      setShell({ w: vw, h: vh });
      stageEl.style.backgroundColor = GUI_SKY;
      cubeEl.style.transform = "none";
      if (backFace) {
        backFace.style.borderColor = "transparent";
        backFace.style.backgroundColor = GUI_SKY;
      }

      await waitFrames(1);
      setGuiVisited(true);
      setPhase("gui");
      setShell(null);
      await waitFrames(1);

      stageEl.style.backgroundColor = "";
      cubeEl.style.transform = "";
      if (backFace) {
        backFace.style.borderColor = "";
        backFace.style.backgroundColor = "";
      }
      sceneEl.style.backgroundColor = "";
      return;
    }

    const settled = computeCubeSize();
    setSize(settled);
    applyCubeCssVars(sceneEl, settled);
    applyTerminalRest(settled);
    setMode("terminal");
    setPhase("terminal");
    // Clear morph leftovers so mobile faces don't keep desktop WAAPI widths
    stageEl.style.removeProperty("background-color");
    cubeEl.style.width = `${settled.width}px`;
    cubeEl.style.height = `${settled.height}px`;
  }, [
    applyGuiCubeRest,
    applyTerminalRest,
    busy,
    cubeEl,
    faceYaw,
    half,
    mode,
    restZ,
    sceneEl,
    size.height,
    size.width,
    stageEl,
  ]);

  const usePerspective = phase === "terminal" || phase === "spinning";
  const isMorphing = phase === "expanding" || phase === "collapsing";
  // During expand/collapse we use a flat 2D card (no 3D face centering hacks)
  const useCubeLayout = !flatLayout && !isMorphing;
  const showSides = useCubeLayout;
  const guiTone = isMorphing || flatLayout || faceYaw === -180;

  return (
    <div
      ref={setSceneEl}
      className={[
        "cube-scene",
        phase === "spinning" ? "cube-scene--spinning" : "",
        isMorphing ? "cube-scene--morphing" : "",
        flatLayout ? "cube-scene--gui-flat" : "",
        guiTone ? "cube-scene--gui-tone" : "",
        !sessionReady ? "cube-scene--booting" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--cube-w": `${size.width}px`,
          "--cube-h": `${size.height}px`,
          "--cube-depth": `${size.depth}px`,
          perspective: usePerspective ? `${PERSPECTIVE}px` : "none",
          visibility: sessionReady ? "visible" : "hidden",
        } as React.CSSProperties
      }
    >
      <div
        ref={setStageEl}
        className={`cube-stage ${phase === "spinning" ? "cube-stage--3d" : ""}`}
        style={
          useCubeLayout
            ? {
                width: size.width,
                height: size.height,
                // At rest no translateZ (flat scroll); during spin JS sets pull/scale
                transform:
                  phase === "spinning"
                    ? `translateZ(${restZ}px) scale(1)`
                    : "none",
              }
            : isMorphing && shell
              ? {
                  width: shell.w,
                  height: shell.h,
                  transform: "none",
                }
              : undefined
        }
      >
        <div
          ref={setCubeEl}
          className="cube-box"
          style={
            useCubeLayout
              ? {
                  width: size.width,
                  height: size.height,
                  pointerEvents: phase === "terminal" && !busy ? "auto" : "none",
                transform:
                  phase === "spinning"
                    ? `rotateX(0deg) rotateY(${faceYaw}deg)`
                    : "none",
              }
              : isMorphing
                ? {
                    width: "100%",
                    height: "100%",
                    transform: "none",
                    pointerEvents: "none",
                  }
                : undefined
          }
        >
          <div
            className="cube-face cube-face--front"
            style={
              useCubeLayout
                ? {
                    transform:
                      phase === "spinning"
                        ? `rotateY(0deg) translateZ(${half}px)`
                        : "none",
                    pointerEvents: phase === "terminal" && !busy ? "auto" : "none",
                    // Hide inactive face at rest so it can't cover the scroller
                    visibility:
                      phase !== "spinning" && faceYaw !== 0 ? "hidden" : "visible",
                  }
                : undefined
            }
            aria-hidden={flatLayout || isMorphing || mode === "gui" || busy}
          >
            <Terminal />
          </div>

          <div
            className="cube-face cube-face--back"
            style={
              useCubeLayout
                ? {
                    transform:
                      phase === "spinning"
                        ? `rotateY(180deg) translateZ(${half}px)`
                        : "none",
                    pointerEvents:
                      phase === "spinning"
                        ? "none"
                        : faceYaw === -180
                          ? "auto"
                          : "none",
                    visibility:
                      phase !== "spinning" && faceYaw !== -180 ? "hidden" : "visible",
                  }
                : undefined
            }
            aria-hidden={faceYaw === 0 && phase !== "spinning"}
          >
            <GuiFaceContent
              guiReady={guiReady}
              fullscreen={phase === "gui"}
              warmCanvas={phase === "expanding" || phase === "gui"}
              preview={guiVisited && phase !== "gui"}
              paused={phase === "terminal" && faceYaw === 0}
              autoFly={phase === "gui"}
              skipIntro={resumeGuiWorld}
              faceLoading={
                armingGui && !guiVisited && phase !== "expanding" && phase !== "gui"
              }
              loadProgress={planeProgress}
              showExperience={
                armingGui ||
                guiVisited ||
                phase === "expanding" ||
                phase === "gui" ||
                phase === "collapsing" ||
                (phase === "spinning" && mode === "gui")
              }
            />
          </div>

          {showSides ? (
            <>
              <div
                className="cube-face cube-face--side cube-face--right"
                style={{
                  width: size.depth,
                  height: size.height,
                  transform: `rotateY(90deg) translateZ(${halfW}px)`,
                }}
                aria-hidden
              >
                <span>GUI</span>
              </div>
              <div
                className="cube-face cube-face--side cube-face--left"
                style={{
                  width: size.depth,
                  height: size.height,
                  transform: `rotateY(-90deg) translateZ(${halfW}px)`,
                }}
                aria-hidden
              >
                <span>TERM</span>
              </div>
              <div
                className="cube-face cube-face--side cube-face--top"
                style={{
                  width: size.width,
                  height: size.depth,
                  transform: `rotateX(90deg) translateZ(${halfH}px)`,
                }}
                aria-hidden
              />
              <div
                className="cube-face cube-face--side cube-face--bottom"
                style={{
                  width: size.width,
                  height: size.depth,
                  transform: `rotateX(-90deg) translateZ(${halfH}px)`,
                }}
                aria-hidden
              />
            </>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          void flip();
        }}
        disabled={busy}
        className={[
          "mode-switch",
          flatLayout || isMorphing || faceYaw === -180 ? "mode-switch--sky" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={
          flatLayout || isMorphing ? "Switch to terminal mode" : "Switch to GUI mode"
        }
      >
        {flatLayout || isMorphing || faceYaw === -180 ? (
          <svg
            className="mode-switch__cloud"
            viewBox="0 0 240 120"
            aria-hidden
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Soft stacked lobes — reads as a real cloud, not a speech bubble */}
            <g fill="currentColor">
              <ellipse cx="72" cy="72" rx="44" ry="32" />
              <ellipse cx="118" cy="58" rx="48" ry="38" />
              <ellipse cx="168" cy="70" rx="42" ry="30" />
              <ellipse cx="96" cy="48" rx="34" ry="28" />
              <ellipse cx="148" cy="46" rx="36" ry="26" />
              <ellipse cx="128" cy="78" rx="52" ry="26" />
            </g>
          </svg>
        ) : null}
        <span className="mode-switch__copy">
          <span className="mode-switch__label">
            {flatLayout || isMorphing || faceYaw === -180 ? "TERMINAL" : "GUI"}
          </span>
          <span className="mode-switch__hint">switch mode</span>
        </span>
      </button>
    </div>
  );
};

export default ModeCube;
