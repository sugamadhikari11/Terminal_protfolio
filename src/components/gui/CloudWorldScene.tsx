"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EasterEggs from "./EasterEggs";
import { PLANE_MODEL } from "./preloadModels";
import { buildPlaneCurve, HOME_PLANE, scrollStage } from "./scrollStage";
import {
  preparePlaneModelFull,
  setPlaneStreaksVisible,
  type PreparedPlane,
} from "./preparePlaneModel";
import InteractiveClouds from "./InteractiveClouds";

gsap.registerPlugin(ScrollTrigger);

type CloudWorldSceneProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  discovered: Set<string>;
  onDiscover: (id: string) => void;
  active: boolean;
  /** Mobile: colored plane sits behind a soft cloud veil */
  mobile?: boolean;
};

/**
 * ScrollTrigger-driven camera + plane.
 * Plane always noses along travel velocity — scrolling up turns it around
 * instead of moonwalking backward along the path.
 */
function ScrollFlightDirector({
  scrollRef,
  active,
  behindVeil = false,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  /** Mobile: keep plane slightly deeper so soft clouds sit in front */
  behindVeil?: boolean;
}) {
  const { camera } = useThree();
  const flight = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const smooth = useRef(0);
  const prev = useRef(0);
  const snapped = useRef(false);
  /** +1 scroll-down / path-forward, -1 scroll-up / path-reverse */
  const dirSmooth = useRef(1);
  const { scene, animations } = useGLTF(PLANE_MODEL);
  const { actions, names } = useAnimations(animations, scene);

  const curve = useMemo(() => buildPlaneCurve(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const nextTan = useMemo(() => new THREE.Vector3(), []);
  const travel = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const curvature = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const bankQuat = useMemo(() => new THREE.Quaternion(), []);
  const baseQuat = useMemo(() => new THREE.Quaternion(), []);
  const homeQuat = useMemo(
    () =>
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(HOME_PLANE.rotation.x, HOME_PLANE.rotation.y, HOME_PLANE.rotation.z, "XYZ")
      ),
    []
  );
  const scaleVec = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const scaleSmooth = useRef(scrollStage(0).planeScale);
  const prepared = useRef<PreparedPlane | null>(null);

  useEffect(() => {
    // Shared GLTF cache — restore authored colors, hide blur/streaks
    prepared.current = preparePlaneModelFull(scene);
    setPlaneStreaksVisible(prepared.current.streakMeshes, false);
    scene.visible = true;
  }, [scene]);

  // Always keep the colored plane visible (mobile uses a soft cloud veil in front)
  useEffect(() => {
    preparePlaneModelFull(scene);
    setPlaneStreaksVisible(prepared.current?.streakMeshes ?? [], false);
    scene.visible = true;
  }, [scene, behindVeil]);

  useEffect(() => {
    if (!active) {
      Object.values(actions).forEach((a) => a?.stop());
      return;
    }
    const clipName = names.find((n) => /take/i.test(n)) ?? names[0];
    const action = clipName ? actions[clipName] : null;
    if (!action) return;
    action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
    action.timeScale = 2.4;
    return () => {
      action.fadeOut(0.15);
    };
  }, [active, actions, names]);

  useEffect(() => {
    if (!active) return;

    const stage0 = scrollStage(0);
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = stage0.fov;
    persp.near = 0.05;
    persp.far = 220;
    persp.updateProjectionMatrix();
    camera.position.set(stage0.camX, stage0.camY, stage0.camZ);
    camera.lookAt(stage0.lookX, stage0.lookY, stage0.lookZ);

    progress.current = 0;
    smooth.current = 0;
    prev.current = 0;
    dirSmooth.current = 1;
    snapped.current = false;
    scaleSmooth.current = scrollStage(0).planeScale;

    const scroller = scrollRef.current;
    const track = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !track) return;

    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        scroller,
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [active, camera, scrollRef]);

  useFrame((_, dt) => {
    if (!active || !flight.current) return;

    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 5.2, dt);
    const t = THREE.MathUtils.clamp(smooth.current, 0, 0.999);
    const vel = (t - prev.current) / Math.max(dt, 1e-3);
    prev.current = t;

    // Face the way we're moving: scroll up → nose flips, not reverse-gear
    const targetDir = Math.abs(vel) < 0.015 ? dirSmooth.current : Math.sign(vel);
    dirSmooth.current = THREE.MathUtils.damp(dirSmooth.current, targetDir, 5.5, dt);
    const facing = dirSmooth.current >= 0 ? 1 : -1;
    const turnAmount = 1 - Math.min(1, Math.abs(dirSmooth.current));

    const stage = scrollStage(t, vel);
    const persp = camera as THREE.PerspectiveCamera;

    curve.getPointAt(t, point);
    // Keep early path on the home pad so we don't slide off while parked
    if (t < 0.02) point.copy(HOME_PLANE.position);

    curve.getTangentAt(Math.max(t, 0.02), tangent).normalize();
    const tNext = THREE.MathUtils.clamp(t + 0.012 * facing, 0.02, 0.999);
    curve.getTangentAt(tNext, nextTan).normalize();

    travel.copy(tangent).multiplyScalar(facing);

    // Toward camera (+) vs away (−) — drives scale + camera dolly
    toCam.set(stage.camX, stage.camY, stage.camZ).sub(point);
    const dist = Math.max(0.001, toCam.length());
    toCam.multiplyScalar(1 / dist);
    const approach = travel.lengthSq() > 1e-6 ? travel.dot(toCam) : 0;

    // Near the lens → big; far → small. Extra punch when flying AT the camera.
    const proximity = 1 - THREE.MathUtils.smoothstep(dist, 3.2, 11.5);
    const approachBoost = Math.max(0, approach) * Math.min(1, Math.abs(vel) * 4);
    const awayShrink = Math.max(0, -approach) * 0.22;
    // Phone only: keep the plane modest so mist + copy stay readable
    const mobileBoost = behindVeil ? 0.62 : 1;
    const targetScale = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(0.75, 2.15, proximity) *
        (0.88 + stage.planeScale * 0.22) *
        (1 + approachBoost * 0.35) *
        (1 - awayShrink) *
        mobileBoost,
      behindVeil ? 0.5 : 0.65,
      behindVeil ? 1.05 : 2.4
    );

    // Camera: pull back when plane charges the lens; ease in when it flees
    const dolly = THREE.MathUtils.clamp(approach * 0.85 + (proximity - 0.45) * 0.9, -1.1, 1.35);
    const fovKick = approachBoost * 6 - Math.max(0, -approach) * 3;
    camPos.set(stage.camX, stage.camY, stage.camZ + dolly * 0.55);
    if (behindVeil) {
      // Phone: pull back + look mid-low so plane sits under the copy band
      camPos.x *= 0.28;
      camPos.y = THREE.MathUtils.lerp(camPos.y, 1.05, 0.5);
      camPos.z = Math.min(camPos.z + 0.85, 8.4);
      persp.fov = THREE.MathUtils.damp(persp.fov, Math.min(stage.fov + fovKick + 2, 44), 2.4, dt);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, camPos.x, 2.4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camPos.y, 2.4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camPos.z, 2.4, dt);
    if (!behindVeil) {
      persp.fov = THREE.MathUtils.damp(persp.fov, stage.fov + fovKick, 2.4, dt);
    }
    persp.updateProjectionMatrix();

    // Look leans toward the live plane so flybys track
    look.set(
      THREE.MathUtils.lerp(stage.lookX, point.x, behindVeil ? 0.55 : 0.35),
      THREE.MathUtils.lerp(stage.lookY, point.y, behindVeil ? 0.45 : 0.3),
      THREE.MathUtils.lerp(stage.lookZ, point.z, behindVeil ? 0.5 : 0.4)
    );
    if (behindVeil) {
      look.x *= 0.3;
      look.y = THREE.MathUtils.lerp(look.y, 0.45, 0.5);
    }
    camera.lookAt(look);

    // First frame: snap to parked pose (avoid lerp-from-origin dive)
    if (!snapped.current) {
      flight.current.position.copy(HOME_PLANE.position);
      if (behindVeil) {
        // Smaller + deeper (behind front mist); clear of top copy
        flight.current.position.x *= 0.28;
        flight.current.position.y = 0.38;
        flight.current.position.z = Math.min(HOME_PLANE.position.z - 1.0, 1.0);
      }
      flight.current.quaternion.copy(homeQuat);
      scaleSmooth.current = targetScale;
      flight.current.scale.setScalar(targetScale);
      snapped.current = true;
      return;
    }

    flight.current.position.lerp(point, 1 - Math.exp(-5.5 * dt));
    if (behindVeil) {
      // Portrait: keep plane in lower third, behind mist — clear of top copy
      flight.current.position.x *= 0.28;
      flight.current.position.y = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(0.28, flight.current.position.y * 0.55, 0.35),
        0.12,
        0.62
      );
      flight.current.position.z = THREE.MathUtils.clamp(
        flight.current.position.z - 0.95,
        -0.6,
        1.0
      );
    }

    if (travel.lengthSq() > 1e-6) {
      baseQuat.setFromUnitVectors(forward, travel);
    }

    curvature.crossVectors(tangent, nextTan);
    const pathBank = THREE.MathUtils.clamp(curvature.y * 16 * facing + vel * 0.35, -0.55, 0.55);
    const bank = pathBank + turnAmount * 0.85 * (facing >= 0 ? 1 : -1);
    bankQuat.setFromAxisAngle(travel.lengthSq() > 1e-6 ? travel : tangent, -bank);
    quat.copy(bankQuat).multiply(baseQuat);

    // Parked at home: use presentation pose; blend to path as scroll starts
    const homeBlend = 1 - THREE.MathUtils.smoothstep(t, 0, 0.12);
    if (homeBlend > 0.001) {
      quat.slerp(homeQuat, homeBlend);
    }

    const turnLag = turnAmount > 0.15 ? 4.5 : 7.5;
    flight.current.quaternion.slerp(quat, 1 - Math.exp(-turnLag * dt));

    scaleSmooth.current = THREE.MathUtils.damp(scaleSmooth.current, targetScale, 5.5, dt);
    scaleVec.setScalar(scaleSmooth.current);
    flight.current.scale.lerp(scaleVec, 1 - Math.exp(-6 * dt));

    const clipName = names.find((n) => /take/i.test(n)) ?? names[0];
    const action = clipName ? actions[clipName] : null;
    const speed = Math.abs(vel);
    if (action) {
      action.timeScale =
        2.2 +
        Math.min(4.5, speed * 6) +
        Math.abs(tangent.y) * 0.8 +
        turnAmount * 1.2 +
        approachBoost * 1.5;
    }

    const streaks = prepared.current?.streakMeshes;
    if (streaks) {
      const flying = t > 0.04 && speed > 0.08;
      setPlaneStreaksVisible(streaks, flying);
    }
  });

  if (!active) return null;

  return (
    <group
      ref={flight}
      position={HOME_PLANE.position.toArray()}
      rotation={[HOME_PLANE.rotation.x, HOME_PLANE.rotation.y, HOME_PLANE.rotation.z]}
      scale={scrollStage(0).planeScale}
      renderOrder={behindVeil ? -1 : 1}
    >
      <primitive object={scene} />
    </group>
  );
}

export default function CloudWorldScene({
  scrollRef,
  discovered,
  onDiscover,
  active,
  mobile = false,
}: CloudWorldSceneProps) {
  if (!active) return null;

  // Desktop: sparse clouds, then plane on top (unchanged).
  // Mobile: smaller plane behind a soft mist; copy stays above in DOM.
  return mobile ? (
    <>
      <Suspense fallback={null}>
        <ScrollFlightDirector
          scrollRef={scrollRef}
          active={active}
          behindVeil
        />
      </Suspense>
      <Suspense fallback={null}>
        <InteractiveClouds variant="world" veil />
      </Suspense>
      <EasterEggs discovered={discovered} onDiscover={onDiscover} />
    </>
  ) : (
    <>
      <Suspense fallback={null}>
        <InteractiveClouds variant="world" />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollFlightDirector scrollRef={scrollRef} active={active} />
      </Suspense>
      <EasterEggs discovered={discovered} onDiscover={onDiscover} />
    </>
  );
}

useGLTF.preload(PLANE_MODEL);
