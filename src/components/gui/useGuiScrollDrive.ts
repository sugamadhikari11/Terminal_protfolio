"use client";

import { useEffect, type RefObject } from "react";
import type { GuiPhase } from "./types";

function findCopyScroller(target: EventTarget | null, root: HTMLElement) {
  let node = target as HTMLElement | null;
  while (node && node !== root) {
    if (node.dataset?.guiCopyScroll === "1") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Forwards wheel/touch from the visible root onto a hidden scroll track.
 * Capture-phase so UI panels never steal flight scroll (home → contact),
 * except mobile copy panels marked data-gui-copy-scroll (long skills/projects).
 */
export function useGuiScrollDrive(
  phase: GuiPhase,
  rootRef: RefObject<HTMLDivElement | null>,
  scrollRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (phase !== "world") return;
    const root = rootRef.current;
    const track = scrollRef.current;
    if (!root || !track) return;

    const applyDelta = (delta: number) => {
      const max = Math.max(0, track.scrollHeight - track.clientHeight);
      if (max <= 0) return;
      track.scrollTop = Math.min(max, Math.max(0, track.scrollTop + delta));
    };

    const onWheel = (e: WheelEvent) => {
      const panel = findCopyScroller(e.target, root);
      if (panel) {
        const canUp = panel.scrollTop > 0;
        const canDown =
          panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        if ((e.deltaY < 0 && canUp) || (e.deltaY > 0 && canDown)) {
          // Let the long skills/project panel scroll first
          return;
        }
      }
      // Always drive the flight track across every section
      e.preventDefault();
      e.stopPropagation();
      applyDelta(e.deltaY);
    };

    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? lastY;
      const delta = lastY - y;
      lastY = y;
      if (Math.abs(delta) < 0.5) return;

      const panel = findCopyScroller(e.target, root);
      if (panel) {
        const canUp = panel.scrollTop > 0;
        const canDown =
          panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        // finger up → content down (delta > 0); finger down → content up (delta < 0)
        if ((delta < 0 && canUp) || (delta > 0 && canDown)) {
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();
      applyDelta(delta);
    };

    root.addEventListener("wheel", onWheel, { passive: false, capture: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      root.removeEventListener("wheel", onWheel, true);
      root.removeEventListener("touchstart", onTouchStart, true);
      root.removeEventListener("touchmove", onTouchMove, true);
    };
  }, [phase, rootRef, scrollRef]);
}
