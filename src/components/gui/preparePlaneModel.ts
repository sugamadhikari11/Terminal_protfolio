import type { Object3D, Mesh, Material, MeshStandardMaterial, Color } from "three";

export type PreparedPlane = {
  fadeMats: MeshStandardMaterial[];
  /** Speed-line / toon air-streak meshes — hide when parked */
  streakMeshes: Mesh[];
};

type OrigMat = {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
};

function isBlurMesh(name: string, matNames: string, mats: Material[]) {
  return (
    /blur_effect|blur effect|motion.?blur|prop.?blur/.test(name) ||
    /blur_effect|blur effect/.test(matNames) ||
    mats.some((m) => /blur/i.test(m.name || ""))
  );
}

/** Stylized WW1 pack ships Maya “Tooner” speed lines + pCube12 streak rods. */
function isAirStreakMesh(mesh: Mesh, name: string, matNames: string) {
  if (/tooner/.test(name) || /tooner/.test(matNames)) return true;
  // Eleven nurbsCircle → pCube12 rods = the white air streaks
  if (/pcube12/.test(name) || /nurbscircle/.test(name)) return true;
  let p: Object3D | null = mesh.parent;
  while (p) {
    if (/nurbscircle/i.test(p.name)) return true;
    p = p.parent;
  }
  return false;
}

function snapshotAndRestoreMat(mat: MeshStandardMaterial) {
  const ud = mat.userData as { _planeOrig?: OrigMat };
  if (!ud._planeOrig) {
    ud._planeOrig = {
      color: mat.color?.clone(),
      emissive: mat.emissive?.clone(),
      emissiveIntensity: mat.emissiveIntensity,
      opacity: mat.opacity,
      transparent: mat.transparent,
      depthWrite: mat.depthWrite,
    };
  } else {
    const o = ud._planeOrig;
    if (o.color && mat.color) mat.color.copy(o.color);
    if (o.emissive && mat.emissive) mat.emissive.copy(o.emissive);
    if (typeof o.emissiveIntensity === "number") mat.emissiveIntensity = o.emissiveIntensity;
    mat.opacity = o.opacity;
    mat.transparent = o.transparent;
    mat.depthWrite = o.depthWrite;
  }

  const authoredBlend = /blend|transparent/i.test(mat.name || "") || mat.userData?.keepAlpha;
  // Always land on solid authored look after intro fade / silhouette experiments
  if (!authoredBlend) {
    mat.opacity = 1;
    mat.transparent = false;
    mat.depthWrite = true;
  }
  mat.needsUpdate = true;
}

/**
 * Stylized WW1 plane ships a Maya "Blur_effect" disc for propeller motion blur
 * and "Tooner" air-streak rods. Hide both broken/noisy FX; keep solid blades.
 * Also restores any mutated colors (shared GLTF cache).
 */
export function preparePlaneModel(root: Object3D): MeshStandardMaterial[] {
  return preparePlaneModelFull(root).fadeMats;
}

export function preparePlaneModelFull(root: Object3D): PreparedPlane {
  const fadeMats: MeshStandardMaterial[] = [];
  const streakMeshes: Mesh[] = [];

  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;

    const name = `${mesh.name} ${mesh.parent?.name ?? ""}`.toLowerCase();
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).filter(
      Boolean
    ) as Material[];
    const matNames = mats.map((m) => (m.name || "").toLowerCase()).join(" ");

    if (isBlurMesh(name, matNames, mats)) {
      mesh.visible = false;
      mesh.frustumCulled = true;
      return;
    }

    if (isAirStreakMesh(mesh, name, matNames)) {
      mesh.visible = false;
      mesh.frustumCulled = true;
      mesh.userData.airStreak = true;
      streakMeshes.push(mesh);
      return;
    }

    mesh.visible = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.renderOrder = 0;

    mats.forEach((m) => {
      const mat = m as MeshStandardMaterial;
      snapshotAndRestoreMat(mat);
      fadeMats.push(mat);
    });
  });

  root.visible = true;
  return { fadeMats, streakMeshes };
}

/** Show speed lines only while actually flying; keep parked plane clean. */
export function setPlaneStreaksVisible(streaks: Mesh[], visible: boolean) {
  for (let i = 0; i < streaks.length; i++) {
    streaks[i].visible = visible;
  }
}
