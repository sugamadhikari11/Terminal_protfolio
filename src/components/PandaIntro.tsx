"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { generatePandaAscii } from "@/utils/terminalUtils";
import { FINAL_GREETING, WORLD_GREETINGS } from "@/data/greetings";

type Props = {
  onComplete?: () => void;
};

type Cell = {
  ch: string;
  x: number;
  y: number;
  t: number;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const smoothstep = (n: number) => {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
};

const fieldThreshold = (nx: number, ny: number) => {
  const cx = 0.45;
  const cy = 0.42;
  const dx = nx - cx;
  const dy = ny - cy;
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = Math.atan2(dy, dx);
  const spiral = (theta + Math.PI) / (2 * Math.PI);
  const phi = 0.6180339887;
  return clamp01(r * (1 - phi * 0.35) + spiral * phi * 0.55);
};

const buildCells = (art: string): { cells: Cell[]; cols: number; rows: number } => {
  const lines = art.replace(/^\n/, "").replace(/\n$/, "").split("\n");
  const cols = Math.max(...lines.map((l) => [...l].length), 1);
  const rows = lines.length;
  const cells: Cell[] = [];

  for (let y = 0; y < rows; y++) {
    const chars = [...(lines[y] ?? "")];
    for (let x = 0; x < cols; x++) {
      const ch = chars[x] ?? " ";
      if (ch === " ") continue;
      const nx = cols <= 1 ? 0 : x / (cols - 1);
      const ny = rows <= 1 ? 0 : y / (rows - 1);
      cells.push({ ch, x, y, t: fieldThreshold(nx, ny) });
    }
  }

  return { cells, cols, rows };
};

const isFigletFriendly = (text: string) => /^[\x20-\x7E]+$/.test(text);

const PandaIntro: React.FC<Props> = ({ onComplete }) => {
  const art = useMemo(() => generatePandaAscii(), []);
  const { cells, cols, rows } = useMemo(() => buildCells(art), [art]);

  const [progress, setProgress] = useState(0);
  const [greetingArt, setGreetingArt] = useState("");
  const [greetingMeta, setGreetingMeta] = useState(WORLD_GREETINGS[0]);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sequence = [...WORLD_GREETINGS, FINAL_GREETING];
    const dwellMs = 130;

    const run = async () => {
      try {
        const figlet = (await import("figlet")).default;
        const standard = (await import("figlet/importable-fonts/Standard.js")).default;
        figlet.parseFont("Standard", standard);

        for (let i = 0; i < sequence.length; i++) {
          if (cancelled) return;
          const g = sequence[i];
          let artText = g.text;
          if (isFigletFriendly(g.text)) {
            artText = await new Promise<string>((resolve) => {
              figlet.text(
                g.text,
                {
                  font: "Standard",
                  horizontalLayout: "fitted",
                  verticalLayout: "fitted",
                  width: 28,
                  whitespaceBreak: true,
                },
                (err, data) => resolve(err || !data ? g.text : data.trimEnd())
              );
            });
          }
          if (cancelled) return;
          setGreetingArt(artText);
          setGreetingMeta(g);
          await new Promise((r) =>
            setTimeout(r, i === sequence.length - 1 ? 620 : dwellMs)
          );
        }
      } catch {
        // Figlet failed — still cycle plain text greetings
        for (let i = 0; i < sequence.length; i++) {
          if (cancelled) return;
          setGreetingArt(sequence[i].text);
          setGreetingMeta(sequence[i]);
          await new Promise((r) =>
            setTimeout(r, i === sequence.length - 1 ? 620 : dwellMs)
          );
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const duration = 3600;

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const linear = clamp01(elapsed / duration);
      const eased = smoothstep(0.5 - 0.5 * Math.cos(linear * Math.PI));
      setProgress(eased);

      if (linear < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const grid = useMemo(() => {
    const lines: string[] = Array.from({ length: rows }, () => " ".repeat(cols));
    for (const cell of cells) {
      if (progress + 0.02 >= cell.t) {
        const row = [...lines[cell.y]];
        row[cell.x] = cell.ch;
        lines[cell.y] = row.join("");
      } else if (progress + 0.1 >= cell.t) {
        const row = [...lines[cell.y]];
        if (row[cell.x] === " ") row[cell.x] = "·";
        lines[cell.y] = row.join("");
      }
    }
    return lines.join("\n");
  }, [cells, cols, rows, progress]);

  return (
    <div className="panda-intro mb-3 max-w-full select-text overflow-x-auto sm:max-w-3xl">
      <div className="mb-2 flex flex-wrap items-baseline gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-500/70 sm:gap-3 sm:text-[10px] sm:tracking-[0.2em]">
        <span>boot://greet</span>
        <span className="normal-case tracking-normal text-zinc-500">
          {greetingMeta.language}
        </span>
        <span className="hidden text-zinc-600 sm:inline">t={progress.toFixed(3)} · spiral</span>
      </div>

      <div className="flex flex-row items-center gap-2 overflow-hidden sm:gap-3">
        <pre className="max-w-[42%] shrink-0 overflow-hidden whitespace-pre font-mono text-[7px] leading-[1.05] text-emerald-400 sm:max-w-none sm:text-[10px] md:text-xs">
          {grid}
        </pre>

        <pre
          className={`min-w-0 shrink whitespace-pre font-mono leading-[1.05] text-emerald-400 ${
            isFigletFriendly(greetingMeta.text)
              ? "text-[7px] sm:text-[9px] md:text-[11px]"
              : "text-xl font-bold tracking-wide sm:text-3xl"
          }`}
        >
          {greetingArt || "…"}
        </pre>
      </div>

      {!done && (
        <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded bg-emerald-950">
          <div
            className="h-full bg-emerald-500/80 transition-[width] duration-75"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PandaIntro;
