import { CatmullRomCurve3, Vector3 } from "three";

/**
 * Home: text LEFT (~46–50% width), plane RIGHT (x ≥ 2.6).
 * On scroll they swap clear halves — never share the center band.
 */

export type TextSide = "left" | "right";

export type ScrollStage = {
  t: number;
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  fov: number;
  planeScale: number;
  uiX: number;
  uiY: number;
  uiScale: number;
  textSide: TextSide;
};

type Beat = {
  t: number;
  cam: [number, number, number];
  look: [number, number, number];
  fov: number;
  planeScale: number;
  uiX: number;
  uiY: number;
  uiScale: number;
  textSide: TextSide;
};

/**
 * Camera Z / FOV / planeScale are authored as “near vs far” beats.
 * Runtime also scales the plane from true camera distance.
 * Near → bigger plane + closer cam / wider FOV. Far → smaller + pull back.
 */
const BEATS: Beat[] = [
  // HOME — near, large on the right
  {
    t: 0,
    cam: [-0.55, 1.25, 6.4],
    look: [2.0, 1.2, 1.2],
    fov: 44,
    planeScale: 1.55,
    uiX: 0,
    uiY: 0,
    uiScale: 1,
    textSide: "left",
  },
  // Drift away a bit before the cross
  {
    t: 0.16,
    cam: [-0.25, 1.3, 7.4],
    look: [1.4, 1.15, 0.2],
    fov: 40,
    planeScale: 1.05,
    uiX: 8,
    uiY: 6,
    uiScale: 1,
    textSide: "left",
  },
  // Cross — come toward lens (big)
  {
    t: 0.28,
    cam: [0.7, 1.15, 5.8],
    look: [-0.6, 1.05, 1.4],
    fov: 48,
    planeScale: 1.85,
    uiX: -12,
    uiY: 10,
    uiScale: 0.99,
    textSide: "right",
  },
  // Climb away on the left (smaller)
  {
    t: 0.45,
    cam: [1.05, 1.85, 7.6],
    look: [-1.4, 1.5, -0.6],
    fov: 38,
    planeScale: 0.95,
    uiX: -16,
    uiY: 14,
    uiScale: 1,
    textSide: "right",
  },
  // Dive back toward camera on the right
  {
    t: 0.58,
    cam: [-0.7, 1.35, 5.9],
    look: [1.6, 1.15, 1.5],
    fov: 47,
    planeScale: 1.75,
    uiX: 10,
    uiY: 8,
    uiScale: 1,
    textSide: "left",
  },
  // High / far pass
  {
    t: 0.72,
    cam: [-0.35, 2.25, 8.0],
    look: [1.2, 1.0, -0.8],
    fov: 37,
    planeScale: 0.9,
    uiX: 6,
    uiY: 18,
    uiScale: 1,
    textSide: "left",
  },
  // Approach again
  {
    t: 0.86,
    cam: [-0.5, 1.35, 6.2],
    look: [1.7, 1.15, 1.3],
    fov: 45,
    planeScale: 1.6,
    uiX: 4,
    uiY: 4,
    uiScale: 1,
    textSide: "left",
  },
  // Contact settle — near, readable
  {
    t: 1,
    cam: [-0.65, 1.2, 6.5],
    look: [1.9, 1.15, 1.4],
    fov: 44,
    planeScale: 1.65,
    uiX: 0,
    uiY: 0,
    uiScale: 1,
    textSide: "left",
  },
];

function lerpBeat(a: Beat, b: Beat, f: number): ScrollStage {
  const mix = (x: number, y: number) => x + (y - x) * f;
  return {
    t: mix(a.t, b.t),
    camX: mix(a.cam[0], b.cam[0]),
    camY: mix(a.cam[1], b.cam[1]),
    camZ: mix(a.cam[2], b.cam[2]),
    lookX: mix(a.look[0], b.look[0]),
    lookY: mix(a.look[1], b.look[1]),
    lookZ: mix(a.look[2], b.look[2]),
    fov: mix(a.fov, b.fov),
    planeScale: mix(a.planeScale, b.planeScale),
    uiX: mix(a.uiX, b.uiX),
    uiY: mix(a.uiY, b.uiY),
    uiScale: mix(a.uiScale, b.uiScale),
    // Hold side until late in the transition so plane can clear first
    textSide: f < 0.62 ? a.textSide : b.textSide,
  };
}

export function scrollStage(tRaw: number, _vel = 0): ScrollStage {
  const t = Math.min(1, Math.max(0, tRaw));
  for (let i = 0; i < BEATS.length - 1; i++) {
    const a = BEATS[i];
    const b = BEATS[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
      const s = f * f * (3 - 2 * f);
      return lerpBeat(a, b, s);
    }
  }
  const last = BEATS[BEATS.length - 1];
  return lerpBeat(last, last, 0);
}

/** Parked home pose — level cruise on the right, nose toward camera/text. */
export const HOME_PLANE = {
  position: new Vector3(3.35, 1.42, 2.1),
  /** euler XYZ — slight nose-up, yawed toward the left copy */
  rotation: new Vector3(0.06, -0.72, 0.05),
};

/**
 * Plane stays in the EMPTY half opposite the text.
 * |x| ≥ ~2.7 keeps clear of the wider (~46–50%) text column.
 * First segment is nearly level so tangent at t=0 is not a dive.
 */
export function buildPlaneCurve() {
  return new CatmullRomCurve3(
    [
      // Home RIGHT — near camera (high Z)
      new Vector3(3.35, 1.42, 2.1),
      new Vector3(3.4, 1.5, 1.2),
      // Drift away
      new Vector3(3.1, 1.55, -0.4),
      new Vector3(2.4, 1.45, -1.4),
      // Cross toward lens (near again)
      new Vector3(0.4, 1.35, 1.8),
      // Park LEFT — pull back
      new Vector3(-3.0, 1.4, 0.2),
      new Vector3(-3.3, 2.1, -1.2),
      new Vector3(-2.8, 2.3, -0.5),
      // Dive back toward camera
      new Vector3(0.1, 1.7, 2.0),
      // RIGHT near pass
      new Vector3(3.0, 1.5, 2.2),
      // Climb far
      new Vector3(3.3, 2.4, -1.5),
      new Vector3(2.8, 1.6, -0.2),
      // Brief left far
      new Vector3(0.2, 1.3, -1.6),
      new Vector3(-3.0, 1.2, -0.8),
      // End RIGHT — settle near
      new Vector3(0.5, 1.45, 0.8),
      new Vector3(3.2, 1.4, 2.0),
    ],
    false,
    "catmullrom",
    0.25
  );
}

/** Soft drift on enter — small enough to feel natural, not laggy. */
export const SECTION_ENTER: Record<string, { x: number; y: number }> = {
  home: { x: -22, y: 8 },
  about: { x: -22, y: 10 },
  skills: { x: 22, y: 8 },
  work: { x: -18, y: 10 },
  contact: { x: -20, y: 12 },
};
