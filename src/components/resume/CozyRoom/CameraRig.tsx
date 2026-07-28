import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { TOUCH, Vector3 } from 'three';

import { aboutCameraView } from './avatarState';
import {
  CAMERA_VIEWS,
  CAMERA_VIEWS_MOBILE,
  INTRO_CAMERA_POSITION,
  ViewId,
} from './hotspots';

type ControlsLike = {
  target: Vector3;
  enabled: boolean;
  autoRotate: boolean;
  update: () => void;
};

type CameraRigProps = {
  view: ViewId;
  reduceMotion: boolean;
  // Bumping this flies the camera back to the overview framing
  resetSignal: number;
  // Desktop gets drag-to-orbit and panel-aware framing; mobile keeps
  // one-finger touch free for page scrolling and flies tighter instead
  desktop: boolean;
};

const INTRO_DURATION = 1.2;
const FLIGHT_DURATION = 0.7;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// Panning is free, but the point you orbit around stays inside the room
// so you can't drift off and lose the scene entirely
const TARGET_BOUNDS = {
  x: [-3.2, 3.4],
  y: [0.1, 2.9],
  z: [-3.4, 3.6],
} as const;

const clamp = (value: number, [min, max]: readonly [number, number]) =>
  Math.min(max, Math.max(min, value));

/**
 * Drives the camera with fixed-duration eased tweens — a swooping intro,
 * quick decisive flights between hotspots — then hands control over to
 * OrbitControls when resting at the overview, where you can orbit, pan
 * and zoom freely within the room.
 */
export function CameraRig({
  view,
  reduceMotion,
  desktop,
  resetSignal,
}: CameraRigProps) {
  const controls = useThree(
    (state) => state.controls,
  ) as unknown as ControlsLike | null;

  const [hasInteracted, setHasInteracted] = useState(false);
  const lookRef = useRef(new Vector3(...CAMERA_VIEWS.overview.target));
  const positionTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const panCorrection = useRef(new Vector3());
  const tweenRef = useRef({
    t: 0,
    startPos: new Vector3(...INTRO_CAMERA_POSITION),
    startLook: new Vector3(...CAMERA_VIEWS.overview.target),
    intro: true,
  });
  const prevViewRef = useRef<ViewId | null>(null);
  const prevResetRef = useRef(resetSignal);
  // The About view is computed from where he is standing and which side
  // the camera is already on, captured once when the view opens
  const aboutView = useRef<ReturnType<typeof aboutCameraView> | null>(null);

  useFrame((state, delta) => {
    const { camera } = state;
    const tween = tweenRef.current;
    const conf = desktop ? CAMERA_VIEWS[view] : CAMERA_VIEWS_MOBILE[view];

    // A view change starts a fresh tween from wherever the camera is now
    if (prevViewRef.current !== view) {
      tween.intro = prevViewRef.current === null;
      prevViewRef.current = view;
      tween.startPos.copy(camera.position);
      tween.startLook.copy(lookRef.current);
      tween.t = 0;
      aboutView.current =
        view === 'about' ? aboutCameraView(camera.position, desktop) : null;
    }

    // "Reset view" replays the flight back to the overview framing
    if (prevResetRef.current !== resetSignal) {
      prevResetRef.current = resetSignal;
      tween.intro = false;
      tween.startPos.copy(camera.position);
      tween.startLook.copy(lookRef.current);
      tween.t = 0;
    }

    if (view === 'about' && aboutView.current) {
      positionTarget.current.copy(aboutView.current.position);
      lookTarget.current.copy(aboutView.current.target);
    } else {
      positionTarget.current.set(...conf.position);
      lookTarget.current.set(...conf.target);
    }

    // Portrait viewports crop the room horizontally — pull further back
    const aspect = state.size.width / state.size.height;
    if (view === 'overview' && aspect < 0.9) {
      positionTarget.current
        .sub(lookTarget.current)
        .multiplyScalar(1.45)
        .add(lookTarget.current);
    }

    const resting = view === 'overview' && tween.t >= 1;

    if (controls) {
      // Orbit is live at the overview on all layouts. On touch, the
      // single-finger gesture is disabled below so it scrolls the page —
      // two fingers rotate/zoom the room instead.
      controls.enabled = resting;
      controls.autoRotate = resting && !hasInteracted && !reduceMotion;
    }

    if (resting) {
      controls?.update();
      if (controls) {
        // Keep the orbit target in the room; shift the camera by the same
        // amount so a pan stops at the edge instead of snapping
        const { target } = controls;
        const x = clamp(target.x, TARGET_BOUNDS.x);
        const y = clamp(target.y, TARGET_BOUNDS.y);
        const z = clamp(target.z, TARGET_BOUNDS.z);
        if (x !== target.x || y !== target.y || z !== target.z) {
          panCorrection.current.set(x - target.x, y - target.y, z - target.z);
          camera.position.add(panCorrection.current);
          target.set(x, y, z);
        }
        lookRef.current.copy(target);
      }
      return;
    }

    const duration = tween.intro ? INTRO_DURATION : FLIGHT_DURATION;
    tween.t = reduceMotion
      ? 1
      : Math.min(1, tween.t + Math.min(delta, 0.066) / duration);
    const progress = tween.intro
      ? easeOutCubic(tween.t)
      : easeInOutCubic(tween.t);

    camera.position.lerpVectors(
      tween.startPos,
      positionTarget.current,
      progress,
    );
    lookRef.current.lerpVectors(tween.startLook, lookTarget.current, progress);

    if (controls) {
      controls.target.copy(lookRef.current);
      controls.update();
    } else {
      camera.lookAt(lookRef.current);
    }
  });

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan
      screenSpacePanning={false}
      panSpeed={0.85}
      zoomSpeed={0.9}
      minDistance={1.5}
      maxDistance={24}
      minPolarAngle={0.08}
      maxPolarAngle={1.52}
      // Wide enough to walk around the open corner, stopping before the
      // camera would end up behind the two solid walls
      minAzimuthAngle={-0.6}
      maxAzimuthAngle={2.15}
      autoRotateSpeed={0.4}
      touches={{
        // One finger is reserved for page scrolling on touch layouts
        // (NONE isn't in the TOUCH enum, so an out-of-range value acts
        // as "ignore"); two fingers rotate and pinch-zoom the room.
        ONE: desktop ? TOUCH.ROTATE : (-1 as TOUCH),
        TWO: TOUCH.DOLLY_ROTATE,
      }}
      onStart={() => setHasInteracted(true)}
    />
  );
}
