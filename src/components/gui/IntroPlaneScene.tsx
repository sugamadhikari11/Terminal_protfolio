"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Cloud, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { PLANE_MODEL } from "./preloadModels";
import { preparePlaneModelFull, setPlaneStreaksVisible } from "./preparePlaneModel";

type IntroPlaneSceneProps = {
  active: boolean;
  hold?: boolean;
  onComplete: () => void;
};

/** Light mist banks — plane stays readable the whole approach. */
function LightClouds({ clearRef }: { clearRef: React.MutableRefObject<{ t: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const clear = clearRef.current.t;
    group.current.position.z = THREE.MathUtils.lerp(0.2, -10, clear);
    group.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.35, clear));
    group.current.visible = clear < 0.92;
  });

  return (
    <group ref={group} position={[0, 0.7, -1.5]}>
      <Cloud seed={41} position={[-2.4, 0.6, -1]} opacity={0.42} speed={0.016} segments={12} volume={4.5} color="#ffffff" fade={10} />
      <Cloud seed={42} position={[2.6, 0.4, -0.8]} opacity={0.4} speed={0.014} segments={12} volume={4.5} color="#eef6ff" fade={10} />
      <Cloud seed={43} position={[0, 1.4, -3.2]} opacity={0.38} speed={0.012} segments={12} volume={5} color="#f5fbff" fade={12} />
      <Cloud seed={44} position={[0.4, -0.2, 0.6]} opacity={0.32} speed={0.018} segments={10} volume={3.5} color="#ffffff" fade={9} />
    </group>
  );
}

/**
 * Intro: plane already visible far away → steady approach → rush the lens → hero.
 * No empty “clouds only” hold.
 */
function FlyingPlane({
  active,
  hold,
  onComplete,
  clearRef,
}: {
  active: boolean;
  hold: boolean;
  onComplete: () => void;
  clearRef: React.MutableRefObject<{ t: number }>;
}) {
  const flight = useRef<THREE.Group>(null);
  const { camera, scene: threeScene } = useThree();
  const { scene, animations } = useGLTF(PLANE_MODEL);
  const { actions, names } = useAnimations(animations, scene);
  const done = useRef(false);
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const streakRef = useRef<THREE.Mesh[]>([]);
  const propAction = useRef<THREE.AnimationAction | null>(null);
  const fogRef = useRef<THREE.Fog | null>(null);

  useEffect(() => {
    const prepared = preparePlaneModelFull(scene);
    matsRef.current = prepared.fadeMats;
    streakRef.current = prepared.streakMeshes;
    setPlaneStreaksVisible(prepared.streakMeshes, false);
  }, [scene]);

  useEffect(() => {
    if (threeScene.fog && (threeScene.fog as THREE.Fog).isFog) {
      fogRef.current = threeScene.fog as THREE.Fog;
    }
  }, [threeScene]);

  useEffect(() => {
    if (!active) {
      Object.values(actions).forEach((a) => a?.stop());
      propAction.current = null;
      return;
    }
    const clipName = names.find((n) => /take/i.test(n)) ?? names[0];
    const action = clipName ? actions[clipName] : null;
    if (!action) return;
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.timeScale = 2.6;
    action.play();
    propAction.current = action;
    return () => {
      action.fadeOut(0.1);
      propAction.current = null;
    };
  }, [active, actions, names]);

  useEffect(() => {
    if (!active || !hold) return;
    const g = flight.current;
    if (!g) return;
    g.position.set(2.4, 1.0, 0.6);
    g.rotation.set(0.05, -0.45, 0.08);
    g.scale.setScalar(0.9);
  }, [active, hold]);

  useEffect(() => {
    if (!active || hold) return;
    const g = flight.current;
    if (!g) return;

    done.current = false;
    // Start partly clear so the plane is a visible speck, not a white-out
    clearRef.current.t = 0.25;
    const prepared = preparePlaneModelFull(scene);
    matsRef.current = prepared.fadeMats;
    streakRef.current = prepared.streakMeshes;
    matsRef.current.forEach((m) => {
      m.opacity = 1;
      m.transparent = false;
    });
    setPlaneStreaksVisible(streakRef.current, false);

    // Far but readable — fly toward the camera immediately
    g.position.set(0.05, 0.62, -12);
    g.rotation.set(0.1, 0, 0);
    g.scale.setScalar(0.14);
    g.visible = true;

    camera.position.set(0, 1.15, 6.4);
    camera.lookAt(0, 0.55, -6);
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = 38;
    persp.near = 0.05;
    persp.far = 200;
    persp.updateProjectionMatrix();

    const cam = { x: 0, y: 1.15, z: 6.4, lx: 0, ly: 0.55, lz: -6 };
    if (fogRef.current) {
      fogRef.current.near = 18;
      fogRef.current.far = 70;
    }

    document.body.classList.add("gui-flight-active");

    let ctx: gsap.Context | null = null;
    const raf = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.classList.remove("gui-flight-active", "gui-flight-rush");
            if (!done.current) {
              done.current = true;
              onComplete();
            }
          },
        });

        // ── Beat 1 (0–2.3s): continuous approach from far ──
        tl.to(clearRef.current, { t: 0.7, duration: 2.3, ease: "power1.out" }, 0);
        tl.to(
          g.position,
          { x: 0.04, y: 0.48, z: -2.4, duration: 2.3, ease: "power1.inOut" },
          0
        );
        tl.to(g.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 2.3, ease: "power1.inOut" }, 0);
        tl.to(g.rotation, { x: 0.08, duration: 2.3, ease: "sine.inOut" }, 0);
        tl.to(
          cam,
          {
            duration: 2.3,
            y: 1.05,
            z: 5.9,
            ly: 0.42,
            lz: -1.6,
            ease: "power1.inOut",
            onUpdate: () => {
              camera.position.set(cam.x, cam.y, cam.z);
              camera.lookAt(cam.lx, cam.ly, cam.lz);
            },
          },
          0
        );
        if (propAction.current) {
          tl.to(propAction.current, { timeScale: 3.2, duration: 2.0, ease: "none" }, 0.1);
        }
        if (fogRef.current) {
          const fogProxy = { near: 18, far: 70 };
          tl.to(
            fogProxy,
            {
              near: 24,
              far: 90,
              duration: 2.3,
              ease: "power1.out",
              onUpdate: () => {
                if (!fogRef.current) return;
                fogRef.current.near = fogProxy.near;
                fogRef.current.far = fogProxy.far;
              },
            },
            0
          );
        }

        // ── Beat 2 (2.3–3.9s): accelerate into the lens ──
        tl.call(() => {
          document.body.classList.add("gui-flight-rush");
          setPlaneStreaksVisible(streakRef.current, true);
        }, [], 2.3);
        tl.to(clearRef.current, { t: 1, duration: 1.4, ease: "power2.in" }, 2.35);
        tl.to(
          g.position,
          { x: 0.02, y: 0.12, z: 2.8, duration: 1.6, ease: "power3.in" },
          2.3
        );
        tl.to(g.rotation, { x: -0.5, y: 0.02, z: -0.05, duration: 1.6, ease: "power2.in" }, 2.3);
        tl.to(g.scale, { x: 7.5, y: 7.5, z: 7.5, duration: 1.6, ease: "power3.in" }, 2.3);
        if (propAction.current) {
          tl.to(propAction.current, { timeScale: 5.5, duration: 1.3, ease: "power1.in" }, 2.35);
        }
        tl.to(
          cam,
          {
            duration: 1.6,
            y: 0.32,
            z: 2.1,
            ly: -0.06,
            lz: 2.2,
            ease: "power2.in",
            onUpdate: () => {
              camera.position.set(cam.x, cam.y, cam.z);
              camera.lookAt(cam.lx, cam.ly, cam.lz);
            },
          },
          2.3
        );
        const fovProxy = { fov: 38 };
        tl.to(
          fovProxy,
          {
            fov: 68,
            duration: 1.4,
            ease: "power3.in",
            onUpdate: () => {
              persp.fov = fovProxy.fov;
              persp.updateProjectionMatrix();
            },
          },
          2.4
        );

        // ── Beat 3 (3.7–4.1s): cut → hero ──
        matsRef.current.forEach((m) => {
          m.transparent = true;
          tl.to(m, { opacity: 0, duration: 0.25, ease: "power1.in" }, 3.7);
        });
        tl.call(() => {
          document.body.classList.remove("gui-flight-rush");
          setPlaneStreaksVisible(streakRef.current, false);
          g.visible = false;
          // Restore solid materials for the shared GLTF before world scene takes over
          preparePlaneModelFull(scene);
        }, [], 3.95);
        tl.to({}, { duration: 0.15 }, 3.95);
      }, g);
    });

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.classList.remove("gui-flight-active", "gui-flight-rush");
      ctx?.revert();
    };
  }, [active, hold, camera, onComplete, clearRef, scene]);

  if (!active) return null;

  return (
    <group ref={flight}>
      <primitive object={scene} />
    </group>
  );
}

export default function IntroPlaneScene({
  active,
  hold = false,
  onComplete,
}: IntroPlaneSceneProps) {
  const clearRef = useRef({ t: 0.25 });

  if (!active) return null;

  return (
    <group>
      {!hold ? (
        <Suspense fallback={null}>
          <LightClouds clearRef={clearRef} />
        </Suspense>
      ) : null}
      <Suspense fallback={null}>
        <FlyingPlane
          active={active}
          hold={hold}
          onComplete={onComplete}
          clearRef={clearRef}
        />
      </Suspense>
    </group>
  );
}

useGLTF.preload(PLANE_MODEL);
