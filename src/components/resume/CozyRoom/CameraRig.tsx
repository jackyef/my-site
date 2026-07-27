import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

import { CAMERA_VIEWS, ViewId } from './hotspots';

type ControlsLike = {
  target: Vector3;
  enabled: boolean;
  autoRotate: boolean;
  update: () => void;
};

type CameraRigProps = {
  view: ViewId;
  reduceMotion: boolean;
  // Shift the framing left so the overlay panel doesn't cover the object
  panelOffset: boolean;
};

const UP = new Vector3(0, 1, 0);

/**
 * Drives the camera: intro swoop, fly-to-hotspot transitions, and hands
 * control over to OrbitControls when resting at the overview.
 */
export function CameraRig({ view, reduceMotion, panelOffset }: CameraRigProps) {
  const controls = useThree(
    (state) => state.controls,
  ) as unknown as ControlsLike | null;

  const [hasInteracted, setHasInteracted] = useState(false);
  const arrivedRef = useRef(false);
  const lookRef = useRef(new Vector3(...CAMERA_VIEWS.overview.target));
  const positionTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const scratch = useRef(new Vector3());

  useEffect(() => {
    arrivedRef.current = false;
  }, [view, panelOffset]);

  useFrame((state, delta) => {
    const { camera } = state;
    const dt = Math.min(delta, 0.066);
    const conf = CAMERA_VIEWS[view];
    const resting = view === 'overview' && arrivedRef.current;

    if (controls) {
      controls.enabled = resting;
      controls.autoRotate = resting && !hasInteracted && !reduceMotion;
    }

    if (resting) {
      controls?.update();
      return;
    }

    positionTarget.current.set(...conf.position);
    lookTarget.current.set(...conf.target);

    // Portrait viewports crop the room horizontally — pull further back
    const aspect = state.size.width / state.size.height;
    if (view === 'overview' && aspect < 0.9) {
      positionTarget.current
        .sub(lookTarget.current)
        .multiplyScalar(1.45)
        .add(lookTarget.current);
    }

    if (view !== 'overview' && panelOffset) {
      // Camera-space "right" vector, to nudge the subject off-center
      scratch.current
        .copy(lookTarget.current)
        .sub(positionTarget.current)
        .cross(UP)
        .normalize()
        .multiplyScalar(0.45);
      positionTarget.current.add(scratch.current);
      lookTarget.current.add(scratch.current);
    }

    const alpha = reduceMotion ? 1 : 1 - Math.exp(-2.4 * dt);
    camera.position.lerp(positionTarget.current, alpha);
    lookRef.current.lerp(lookTarget.current, alpha);

    if (controls) {
      controls.target.copy(lookRef.current);
      controls.update();
    } else {
      camera.lookAt(lookRef.current);
    }

    if (camera.position.distanceTo(positionTarget.current) < 0.03) {
      arrivedRef.current = true;
    }
  });

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={3.5}
      maxDistance={16.5}
      minPolarAngle={0.15}
      maxPolarAngle={1.45}
      minAzimuthAngle={-0.35}
      maxAzimuthAngle={1.75}
      autoRotateSpeed={0.4}
      onStart={() => setHasInteracted(true)}
    />
  );
}
