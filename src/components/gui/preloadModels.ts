import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";

export const PLANE_MODEL = "/models/stylized_ww1_plane.glb";
/** Broken-scale asset kept for reference — do not render as primary (coords ~1e6). */
export const POUTA_MODEL = "/models/po-uta.glb";

type ProgressCb = (progress01: number) => void;

let planeLoadPromise: Promise<void> | null = null;
let planeLoaded = false;

export function isPlaneLoaded() {
  return planeLoaded;
}

/**
 * Download + parse the WW1 plane before flight starts.
 * Call early (cube spin / expand) so the intro doesn't hitch.
 */
export function ensurePlaneLoaded(onProgress?: ProgressCb): Promise<void> {
  if (planeLoaded) {
    onProgress?.(1);
    return Promise.resolve();
  }

  if (!planeLoadPromise) {
    planeLoadPromise = new Promise<void>((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        PLANE_MODEL,
        () => {
          useGLTF.preload(PLANE_MODEL);
          onProgress?.(1);
          window.setTimeout(() => {
            planeLoaded = true;
            resolve();
          }, 50);
        },
        (event) => {
          if (event.total > 0) {
            onProgress?.(Math.min(0.92, event.loaded / event.total));
          } else {
            onProgress?.(0.12);
          }
        },
        (err) => {
          planeLoadPromise = null;
          reject(err);
        }
      );
    });
  } else if (onProgress) {
    planeLoadPromise.then(() => onProgress(1)).catch(() => undefined);
  }

  return planeLoadPromise;
}

/** Fire-and-forget warm (no progress). */
export function preloadGuiModels() {
  void ensurePlaneLoaded();
}
