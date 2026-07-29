import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  InstancedMesh,
  Object3D,
  Quaternion,
  Shape,
  Vector3,
} from 'three';

import { AVATAR_REST_SPOT, avatarPosition } from './avatarState';
import {
  BRIDGE,
  LENS_CENTER,
  LENS_YAW,
  TEMPLE,
  lensAperture,
  lensOutline,
} from './glassesShape';
import { buildHairSurface } from './hairGeometry';
import { useLivePalette } from './livePalette';
import { MATERIALS } from './palette';
import { setSceneCursor } from './sceneCursor';
import type { SectionId } from './hotspots';

// `id` collides with our SectionId prop (three.js types it as a number),
// and `children` is re-declared as required below.
type GroupProps = Omit<ThreeElements['group'], 'id' | 'children'>;

// Deterministic pseudo-random in [0, 1) — keeps the scene stable across renders
const seeded = (i: number, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const expDamp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

type IntroPopProps = GroupProps & {
  delay?: number;
  reduceMotion?: boolean;
  children: React.ReactNode;
};

/**
 * Pops its children in with a springy scale-up when the scene loads.
 */
export function IntroPop({
  delay = 0,
  reduceMotion = false,
  children,
  ...groupProps
}: IntroPopProps) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;

    const progress = reduceMotion
      ? 1
      : clamp01((state.clock.getElapsedTime() - delay) / 0.5);
    group.scale.setScalar(Math.max(0.0001, easeOutBack(progress)));
  });

  return (
    <group ref={ref} scale={0.0001} {...groupProps}>
      {children}
    </group>
  );
}

type HotspotGroupProps = GroupProps & {
  id: SectionId;
  hovered: boolean;
  // World-space point to scale around. Children keep their absolute
  // positions; without this, scaling happens around the world origin and
  // wall-mounted objects get pushed into the walls.
  center: [number, number, number];
  introDelay?: number;
  reduceMotion?: boolean;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  children: React.ReactNode;
};

/**
 * An interactive object in the room: pops in on load, gently scales up on
 * hover, and opens its resume section on click.
 */
export function HotspotGroup({
  id,
  hovered,
  center,
  introDelay = 0,
  reduceMotion = false,
  onHover,
  onSelect,
  children,
  ...groupProps
}: HotspotGroupProps) {
  const ref = useRef<Group>(null);
  const hoverScale = useRef(1);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;

    const dt = Math.min(delta, 0.066);
    const intro = reduceMotion
      ? 1
      : easeOutBack(clamp01((state.clock.getElapsedTime() - introDelay) / 0.5));
    hoverScale.current = expDamp(
      hoverScale.current,
      hovered ? 1.06 : 1,
      14,
      dt,
    );
    group.scale.setScalar(Math.max(0.0001, intro * hoverScale.current));
  });

  return (
    <group position={center}>
      <group
        ref={ref}
        scale={0.0001}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(id);
          setSceneCursor('hover', true);
        }}
        onPointerOut={() => {
          onHover(null);
          setSceneCursor('hover', false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          setSceneCursor('hover', false);
          onSelect(id);
        }}
        {...groupProps}
      >
        <group position={[-center[0], -center[1], -center[2]]}>
          {children}
        </group>
      </group>
    </group>
  );
}

/**
 * Floor + the two visible walls, with an opening for the window.
 */
export function RoomShell() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.075, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.15, 8.4]} />
        <meshStandardMaterial color={MATERIALS.floor} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.7, -4.26]} castShadow receiveShadow>
        <boxGeometry args={[8.64, 3.4, 0.12]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>

      {/* Left wall, in segments around the window opening — these cast
          shadow so sunlight genuinely pools in through the window */}
      <mesh position={[-4.26, 1.7, -3.26]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 3.4, 2.12]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-4.26, 1.7, 1.66]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 3.4, 5.32]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-4.26, 3.15, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.5, 1.2]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-4.26, 0.75, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 1.5, 1.2]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>

      {/* Plank grooves across the floor */}
      {[-3.15, -2.1, -1.05, 0, 1.05, 2.1, 3.15].map((z) => (
        <mesh key={z} position={[0, 0.002, z]}>
          <boxGeometry args={[8.4, 0.008, 0.022]} />
          <meshStandardMaterial color={MATERIALS.floorGroove} roughness={1} />
        </mesh>
      ))}

      {/* Baseboards */}
      <mesh position={[0, 0.09, -4.19]}>
        <boxGeometry args={[8.64, 0.18, 0.04]} />
        <meshStandardMaterial color={MATERIALS.wallTrim} roughness={0.9} />
      </mesh>
      <mesh position={[-4.19, 0.09, 0]}>
        <boxGeometry args={[0.04, 0.18, 8.64]} />
        <meshStandardMaterial color={MATERIALS.wallTrim} roughness={0.9} />
      </mesh>
    </group>
  );
}

const SHAFT_INDICES = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]);
// Window opening corners (world space), on the inner wall face
const SHAFT_SOURCES: Array<[number, number, number]> = [
  [-4.14, 2.9, -2.2],
  [-4.14, 2.9, -1.0],
  [-4.14, 1.5, -2.2],
  [-4.14, 1.5, -1.0],
];
const SUN_AIM = new Vector3(1.5, 0.2, 0.5);

/**
 * A soft volumetric shaft of light falling from the window to the floor,
 * rebuilt each frame from the live sun position so it always matches the
 * real shadows.
 */
export function LightShaft() {
  const live = useLivePalette();
  const positionRef = useRef<BufferAttribute>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const positions = useMemo(() => new Float32Array(8 * 3), []);
  const direction = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const palette = live.current;
    direction.copy(SUN_AIM).sub(palette.sunPosition).normalize();

    const write = (index: number, x: number, y: number, z: number) => {
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
    };
    // Stop the beam at the floor, but never past the room's edge
    const travelFor = (x: number, y: number) => {
      const toFloor = (y - 0.03) / -direction.y;
      const toEdge =
        direction.x > 0 ? (4.15 - x) / direction.x : Number.POSITIVE_INFINITY;
      return Math.min(toFloor, toEdge);
    };
    // Top edge + its floor projection, then bottom edge + projection
    [0, 1].forEach((i) => {
      const [x, y, z] = SHAFT_SOURCES[i];
      const travel = travelFor(x, y);
      write(i, x, y, z);
      write(
        3 - i,
        x + direction.x * travel,
        y + direction.y * travel,
        z + direction.z * travel,
      );
    });
    [2, 3].forEach((i) => {
      const [x, y, z] = SHAFT_SOURCES[i];
      const travel = travelFor(x, y);
      write(i + 2, x, y, z);
      write(
        7 - (i - 2),
        x + direction.x * travel,
        y + direction.y * travel,
        z + direction.z * travel,
      );
    });

    if (positionRef.current) positionRef.current.needsUpdate = true;
    const material = materialRef.current;
    if (material) {
      material.opacity = palette.shaftOpacity;
      material.color.copy(palette.sunColor);
    }
  });

  return (
    <mesh frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="index" args={[SHAFT_INDICES, 1]} />
      </bufferGeometry>
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0.1}
        depthWrite={false}
        blending={AdditiveBlending}
        side={2}
      />
    </mesh>
  );
}

export function Rug() {
  return (
    <group position={[0.7, 0, 0.9]}>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.024, 48]} />
        <meshStandardMaterial color={MATERIALS.rug} roughness={1} />
      </mesh>
      <mesh position={[0, 0.026, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.01, 48]} />
        <meshStandardMaterial color={MATERIALS.rugInner} roughness={1} />
      </mesh>
    </group>
  );
}

export function Desk() {
  return (
    <group>
      {/* Main top along the back wall */}
      <mesh position={[0.775, 1.03, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[3.35, 0.06, 1.0]} />
        <meshStandardMaterial color={MATERIALS.deskTop} roughness={0.7} />
      </mesh>
      {/* L-return on the left */}
      <mesh position={[-0.4, 1.03, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.06, 1.2]} />
        <meshStandardMaterial color={MATERIALS.deskTop} roughness={0.7} />
      </mesh>
      {/* White standing-desk T-legs */}
      {[
        [-0.7, -3.5],
        [2.25, -3.5],
      ].map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.51, 0]} castShadow>
            <boxGeometry args={[0.09, 0.98, 0.12]} />
            <meshStandardMaterial color={MATERIALS.deskLeg} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.025, 0]} castShadow>
            <boxGeometry args={[0.14, 0.05, 0.78]} />
            <meshStandardMaterial color={MATERIALS.deskLeg} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Return leg */}
      <group position={[-0.4, 0, -1.95]}>
        <mesh position={[0, 0.51, 0]} castShadow>
          <boxGeometry args={[0.12, 0.98, 0.09]} />
          <meshStandardMaterial color={MATERIALS.deskLeg} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.025, 0]} castShadow>
          <boxGeometry args={[0.78, 0.05, 0.14]} />
          <meshStandardMaterial color={MATERIALS.deskLeg} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function Chair() {
  return (
    <group position={[1.35, 0, -2.35]} rotation={[0, -0.45, 0]}>
      {/* Base + column */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 10]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 10]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.5} />
      </mesh>
      {/* Seat + back */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <boxGeometry args={[0.56, 0.09, 0.52]} />
        <meshStandardMaterial color={MATERIALS.fabric} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.0, 0.26]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.54, 0.72, 0.07]} />
        <meshStandardMaterial color={MATERIALS.fabric} roughness={0.95} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.3, 0.76, 0.02]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.76, 0.02]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
    </group>
  );
}

const CODE_BAR_COUNT = 9;

export function Monitor({ reduceMotion }: { reduceMotion: boolean }) {
  const live = useLivePalette();
  const screenRef = useRef<MeshStandardMaterial>(null);
  const appScreenRef = useRef<MeshStandardMaterial>(null);
  const barsRef = useRef<Group>(null);
  const glowRef = useRef<PointLight>(null);
  const caretRef = useRef<MeshBasicMaterial>(null);

  const bars = useMemo(
    () =>
      Array.from({ length: CODE_BAR_COUNT }, (_, i) => ({
        width: 0.12 + seeded(i, 2) * 0.42,
        indent: i % 3 === 1 ? 0.07 : i % 4 === 2 ? 0.14 : 0,
        color: MATERIALS.screenCode[i % MATERIALS.screenCode.length],
      })),
    [],
  );
  const lastBar = bars[CODE_BAR_COUNT - 1];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensity = live.current.screenIntensity;
    // A whisper of CRT-ish flicker keeps the screens feeling alive
    const flicker = reduceMotion
      ? 1
      : 1 + 0.025 * Math.sin(t * 11) + 0.015 * Math.sin(t * 5.7);
    if (screenRef.current) {
      screenRef.current.emissiveIntensity = intensity * flicker;
    }
    if (appScreenRef.current) {
      appScreenRef.current.emissiveIntensity = intensity * 0.9 * flicker;
    }
    if (glowRef.current) glowRef.current.intensity = intensity * 1.9 * flicker;
    barsRef.current?.children.forEach((child) => {
      const material = (child as Mesh).material;
      if (!Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.45 + intensity * 0.3;
      }
    });
    if (caretRef.current) {
      caretRef.current.opacity = reduceMotion || t % 1.1 < 0.6 ? 0.85 : 0;
    }
  });

  return (
    <group>
      {/* Left monitor — the editor */}
      <group position={[0.78, 1.06, -3.62]}>
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 0.03, 24]} />
          <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.05, 0.28, 0.05]} />
          <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.56, 0]} castShadow>
          <boxGeometry args={[0.95, 0.58, 0.05]} />
          <meshStandardMaterial color={MATERIALS.screenBezel} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.56, 0.027]}>
          <planeGeometry args={[0.87, 0.5]} />
          <meshStandardMaterial
            ref={screenRef}
            color="#0d1a26"
            emissive="#14283d"
            emissiveIntensity={0.75}
            roughness={0.3}
          />
        </mesh>
        {/* Lines of "code" */}
        <group ref={barsRef}>
          {bars.map((bar, i) => (
            <mesh
              key={i}
              position={[
                -0.36 + bar.indent + bar.width / 2,
                0.74 - i * 0.045,
                0.03,
              ]}
            >
              <planeGeometry args={[bar.width, 0.019]} />
              <meshBasicMaterial color={bar.color} transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
        {/* Blinking caret at the end of the last line */}
        <mesh
          position={[
            -0.34 + lastBar.indent + lastBar.width,
            0.74 - (CODE_BAR_COUNT - 1) * 0.045,
            0.03,
          ]}
        >
          <planeGeometry args={[0.011, 0.03]} />
          <meshBasicMaterial ref={caretRef} color="#c9d1d9" transparent />
        </mesh>
        {/* Webcam perched on top */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[0.09, 0.05, 0.05]} />
          <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.88, 0.026]}>
          <circleGeometry args={[0.012, 10]} />
          <meshBasicMaterial color="#5a7f9f" />
        </mesh>
      </group>

      {/* Right monitor — chat, angled inward */}
      <group position={[1.85, 1.06, -3.58]} rotation={[0, 0.15, 0]}>
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 0.03, 24]} />
          <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.05, 0.28, 0.05]} />
          <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.58, 0]} castShadow>
          <boxGeometry args={[1.02, 0.62, 0.05]} />
          <meshStandardMaterial color={MATERIALS.screenBezel} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.58, 0.027]}>
          <planeGeometry args={[0.94, 0.54]} />
          <meshStandardMaterial
            ref={appScreenRef}
            color={MATERIALS.appScreen}
            emissive={MATERIALS.appScreen}
            emissiveIntensity={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Sidebar + channel list */}
        <mesh position={[-0.42, 0.58, 0.03]}>
          <planeGeometry args={[0.09, 0.54]} />
          <meshBasicMaterial color="#1a1626" transparent opacity={0.9} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.28, 0.76 - i * 0.07, 0.03]}>
            <planeGeometry args={[0.14, 0.02]} />
            <meshBasicMaterial color="#8d86a8" transparent opacity={0.55} />
          </mesh>
        ))}
        {/* The big purple pane */}
        <mesh position={[0.12, 0.62, 0.03]}>
          <planeGeometry args={[0.55, 0.34]} />
          <meshBasicMaterial
            color={MATERIALS.appAccent}
            transparent
            opacity={0.85}
          />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.1, 0.4 - i * 0.045, 0.03]}>
            <planeGeometry args={[0.5 - i * 0.1, 0.018]} />
            <meshBasicMaterial color="#cfcadf" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Screen glow over the desk */}
      <pointLight
        ref={glowRef}
        position={[1.3, 1.7, -3.0]}
        color="#8f9fd1"
        intensity={1.4}
        distance={2.6}
      />
    </group>
  );
}

export function Keyboard() {
  return (
    <group>
      {[
        { x: 1.02, tilt: 0.03, accent: '#c25b4e' },
        { x: 1.58, tilt: -0.04, accent: '#e0a458' },
      ].map((board) => (
        <group
          key={board.x}
          position={[board.x, 1.06, -3.12]}
          rotation={[0, board.tilt, 0]}
        >
          <mesh position={[0, 0.015, 0]} castShadow>
            <boxGeometry args={[0.46, 0.03, 0.18]} />
            <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.032, 0]}>
            <boxGeometry args={[0.42, 0.01, 0.14]} />
            <meshStandardMaterial
              color={MATERIALS.gadgetLight}
              roughness={0.6}
            />
          </mesh>
          {/* One accent keycap */}
          <mesh position={[0.17, 0.038, -0.05]}>
            <boxGeometry args={[0.035, 0.008, 0.035]} />
            <meshStandardMaterial color={board.accent} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MouseAndPad() {
  return (
    <group position={[2.12, 1.06, -3.12]}>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.42, 0.012, 0.3]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.95} />
      </mesh>
      <mesh position={[0.02, 0.035, 0.02]} rotation={[0, -0.25, 0]} castShadow>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color="#f2f1ed" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Notebook() {
  return (
    <group position={[0.32, 1.06, -3.22]} rotation={[0, 0.35, 0]}>
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.28, 0.025, 0.38]} />
        <meshStandardMaterial color={MATERIALS.envelopeFlag} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.027, 0]}>
        <boxGeometry args={[0.25, 0.006, 0.35]} />
        <meshStandardMaterial color={MATERIALS.paper} roughness={0.9} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.22, 0.03, 0.08]} rotation={[0, 0.9, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
        <meshStandardMaterial color={MATERIALS.mug} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Steam({ reduceMotion }: { reduceMotion: boolean }) {
  const puffs = [useRef<Mesh>(null), useRef<Mesh>(null), useRef<Mesh>(null)];

  useFrame((state) => {
    if (reduceMotion) return;
    const t = state.clock.getElapsedTime();
    puffs.forEach((puff, i) => {
      const mesh = puff.current;
      if (!mesh) return;
      const progress = (t * 0.25 + i / 3) % 1;
      mesh.position.y = 0.24 + progress * 0.35;
      mesh.position.x = Math.sin((t + i * 2.1) * 1.7) * 0.02;
      mesh.scale.setScalar(0.5 + progress * 0.7);
      const material = mesh.material;
      if (!Array.isArray(material) && 'opacity' in material) {
        material.opacity = Math.sin(Math.PI * progress) * 0.35;
      }
    });
  });

  return (
    <group>
      {puffs.map((puff, i) => (
        <mesh key={i} ref={puff} position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Mug({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <group position={[-0.62, 1.06, -2.7]}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.05, 0.2, 20]} />
        <meshStandardMaterial color={MATERIALS.mug} roughness={0.5} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.058, 0.025, 20]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.4} />
      </mesh>
      <Steam reduceMotion={reduceMotion} />
    </group>
  );
}

export function DeskLamp({ onCycleTheme }: { onCycleTheme: () => void }) {
  const live = useLivePalette();
  const shadeRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  const groupRef = useRef<Group>(null);
  const hoverScale = useRef(1);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const intensity = live.current.lampIntensity;
    if (shadeRef.current) shadeRef.current.emissiveIntensity = intensity * 0.04;
    if (lightRef.current) lightRef.current.intensity = intensity;
    hoverScale.current = expDamp(
      hoverScale.current,
      hovered ? 1.08 : 1,
      14,
      Math.min(delta, 0.066),
    );
    groupRef.current?.scale.setScalar(hoverScale.current);
  });

  return (
    <group
      ref={groupRef}
      position={[2.42, 1.06, -3.72]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        setSceneCursor('hover', true);
      }}
      onPointerOut={() => {
        setHovered(false);
        setSceneCursor('hover', false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onCycleTheme();
      }}
    >
      {hovered && (
        <Html center position={[-0.1, 0.85, 0]} zIndexRange={[40, 0]}>
          <div className="pointer-events-none rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-2.5 pt-[5px] pb-[3px] text-[11px] leading-none font-medium whitespace-nowrap text-(--color-ink-2) shadow-(--shadow-md)">
            Flip the lights
          </div>
        </Html>
      )}
      {/* Generous invisible hit target — the lamp itself is tiny on screen */}
      <mesh position={[-0.1, 0.3, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.45]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.04, 20]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} />
      </mesh>
      <mesh position={[-0.06, 0.24, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 10]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} />
      </mesh>
      <mesh position={[-0.2, 0.44, 0]} rotation={[0, 0, 2.2]} castShadow>
        <coneGeometry args={[0.09, 0.14, 20, 1, true]} />
        <meshStandardMaterial
          ref={shadeRef}
          color={MATERIALS.lampShade}
          emissive={MATERIALS.lampShade}
          emissiveIntensity={0.5}
          roughness={0.6}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[-0.28, 0.38, 0]}
        color="#ffc37a"
        intensity={10}
        distance={5}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  );
}

export function Envelopes() {
  return (
    <group position={[-0.38, 1.06, -2.32]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, 0.02 + i * 0.028, 0]}
          rotation={[0, seeded(i, 5) * 0.5 - 0.25, 0]}
          castShadow
        >
          <boxGeometry args={[0.42, 0.025, 0.28]} />
          <meshStandardMaterial color={MATERIALS.envelope} roughness={0.9} />
        </mesh>
      ))}
      {/* One envelope propped upright */}
      <mesh position={[0, 0.22, -0.17]} rotation={[-0.25, 0, 0.03]} castShadow>
        <boxGeometry args={[0.4, 0.26, 0.02]} />
        <meshStandardMaterial color={MATERIALS.envelope} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.24, -0.155]} rotation={[-0.25, 0, 0.03]}>
        <circleGeometry args={[0.045, 20]} />
        <meshStandardMaterial color={MATERIALS.envelopeFlag} roughness={0.8} />
      </mesh>
    </group>
  );
}

const POLAROIDS: Array<{
  x: number;
  y: number;
  tilt: number;
}> = [
  { x: -0.62, y: 0.3, tilt: 0.08 },
  { x: 0.02, y: 0.38, tilt: -0.06 },
  { x: 0.64, y: 0.22, tilt: 0.05 },
  { x: -0.35, y: -0.28, tilt: -0.09 },
  { x: 0.24, y: -0.35, tilt: 0.07 },
  { x: 0.68, y: -0.32, tilt: -0.05 },
];

export function Corkboard({
  hovered,
  reduceMotion,
}: {
  hovered: boolean;
  reduceMotion: boolean;
}) {
  const polaroidRefs = useRef<Array<Group | null>>([]);
  const wiggleAmp = useRef(0);

  useFrame((state, delta) => {
    // Polaroids flutter when the board has your attention
    wiggleAmp.current = expDamp(
      wiggleAmp.current,
      hovered && !reduceMotion ? 0.05 : 0,
      8,
      Math.min(delta, 0.066),
    );
    const t = state.clock.getElapsedTime();
    polaroidRefs.current.forEach((group, i) => {
      if (!group) return;
      group.rotation.z =
        POLAROIDS[i].tilt + Math.sin(t * 9 + i * 1.7) * wiggleAmp.current;
    });
  });

  return (
    <group position={[2.95, 2.2, -4.15]}>
      <mesh castShadow>
        <boxGeometry args={[1.9, 1.3, 0.05]} />
        <meshStandardMaterial color={MATERIALS.cork} roughness={0.95} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[1.98, 0.06, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <boxGeometry args={[1.98, 0.06, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.97, 0, 0]}>
        <boxGeometry args={[0.06, 1.38, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.97, 0, 0]}>
        <boxGeometry args={[0.06, 1.38, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>

      {/* Pinned snapshots — one per chapter of the career */}
      {POLAROIDS.map((polaroid, i) => (
        <group
          key={i}
          ref={(node) => {
            polaroidRefs.current[i] = node;
          }}
          position={[polaroid.x, polaroid.y, 0.035]}
          rotation={[0, 0, polaroid.tilt]}
        >
          <mesh>
            <planeGeometry args={[0.26, 0.3]} />
            <meshStandardMaterial color={MATERIALS.paper} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.025, 0.002]}>
            <planeGeometry args={[0.21, 0.19]} />
            <meshStandardMaterial
              color={MATERIALS.pins[i % MATERIALS.pins.length]}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, 0.14, 0.012]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshStandardMaterial
              color={MATERIALS.envelopeFlag}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const STAR_COUNT = 8;
const CLOUDS = [
  { y: 0.32, speed: 0.016, offset: 0, scale: 1 },
  { y: -0.02, speed: 0.011, offset: 0.55, scale: 0.75 },
];

export function WallWindow({ reduceMotion }: { reduceMotion: boolean }) {
  const live = useLivePalette();
  const skyRef = useRef<MeshBasicMaterial>(null);
  const discRef = useRef<Mesh>(null);
  const discMaterialRef = useRef<MeshBasicMaterial>(null);
  const glowRef = useRef<PointLight>(null);
  const cloudRefs = [useRef<Group>(null), useRef<Group>(null)];
  const cloudMaterials = useMemo(
    () =>
      CLOUDS.map(
        () =>
          new MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.8,
          }),
      ),
    [],
  );
  const starMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: '#fdf6d8',
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        x: (seeded(i, 21) - 0.5) * 1.0,
        y: (seeded(i, 22) - 0.5) * 1.2,
        r: 0.008 + seeded(i, 23) * 0.007,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const palette = live.current;
    skyRef.current?.color.copy(palette.sky);
    discMaterialRef.current?.color.copy(palette.discColor);
    const disc = discRef.current;
    if (disc) {
      disc.position.x = palette.discX;
      disc.position.y = palette.discY;
      disc.scale.setScalar(palette.discScale);
    }
    const glow = glowRef.current;
    if (glow) {
      glow.color.copy(palette.windowGlowColor);
      glow.intensity = palette.windowGlowIntensity;
    }

    // Clouds drift across the pane, fading out near the frame
    CLOUDS.forEach((cloud, i) => {
      const group = cloudRefs[i].current;
      if (!group) return;
      const x = reduceMotion
        ? cloud.offset - 0.25
        : ((((t * cloud.speed + cloud.offset) % 0.96) + 0.96) % 0.96) - 0.48;
      group.position.x = x;
      const edge = clamp01((0.48 - Math.abs(x)) / 0.14);
      cloudMaterials[i].opacity = palette.cloudOpacity * edge;
    });

    // Stars twinkle in when night falls
    starMaterial.opacity =
      palette.starOpacity *
      (reduceMotion ? 0.9 : 0.7 + 0.3 * Math.sin(t * 1.9));
  });

  return (
    <group position={[-4.17, 2.2, -1.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* Sky seen through the glass */}
      <mesh>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial ref={skyRef} color={MATERIALS.paper} />
      </mesh>
      {/* Stars behind everything else in the pane */}
      <group position={[0, 0, 0.003]}>
        {stars.map((star, i) => (
          <mesh key={i} position={[star.x, star.y, 0]} material={starMaterial}>
            <circleGeometry args={[star.r, 8]} />
          </mesh>
        ))}
      </group>
      {/* The sun (or moon) — slides across the pane as the theme shifts */}
      <mesh ref={discRef} position={[-0.3, 0.45, 0.005]}>
        <circleGeometry args={[0.13, 24]} />
        <meshBasicMaterial ref={discMaterialRef} color="#fff3c4" />
      </mesh>
      {/* Clouds drifting by */}
      {CLOUDS.map((cloud, i) => (
        <group
          key={i}
          ref={cloudRefs[i]}
          position={[0, cloud.y, 0.007]}
          scale={cloud.scale}
        >
          <mesh position={[0, 0, 0]} material={cloudMaterials[i]}>
            <circleGeometry args={[0.07, 16]} />
          </mesh>
          <mesh position={[-0.07, -0.015, 0]} material={cloudMaterials[i]}>
            <circleGeometry args={[0.05, 16]} />
          </mesh>
          <mesh position={[0.07, -0.02, 0]} material={cloudMaterials[i]}>
            <circleGeometry args={[0.055, 16]} />
          </mesh>
        </group>
      ))}

      {/* Frame + cross bars — powder-coated gray */}
      <mesh position={[0, 0.72, 0.02]}>
        <boxGeometry args={[1.34, 0.08, 0.1]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.72, 0.02]}>
        <boxGeometry args={[1.34, 0.08, 0.1]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>
      <mesh position={[-0.63, 0, 0.02]}>
        <boxGeometry args={[0.08, 1.52, 0.1]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>
      <mesh position={[0.63, 0, 0.02]}>
        <boxGeometry args={[0.08, 1.52, 0.1]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.05, 1.44, 0.06]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.28, 0.05, 0.06]} />
        <meshStandardMaterial color={MATERIALS.windowFrame} roughness={0.6} />
      </mesh>

      {/* Gray roller blind, partially down */}
      <mesh position={[0, 0.74, 0.09]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 1.26, 14]} />
        <meshStandardMaterial color={MATERIALS.blindRoller} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.56, 0.075]} castShadow>
        <boxGeometry args={[1.22, 0.3, 0.02]} />
        <meshStandardMaterial color={MATERIALS.blind} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.4, 0.075]}>
        <boxGeometry args={[1.22, 0.03, 0.026]} />
        <meshStandardMaterial color={MATERIALS.blindRoller} roughness={0.7} />
      </mesh>

      {/* Little plant on the sill */}
      <group position={[-0.35, -0.62, 0.12]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.04, 0.1, 12]} />
          <meshStandardMaterial color={MATERIALS.pot} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color={MATERIALS.leafDark} roughness={0.9} />
        </mesh>
      </group>

      {/* Light spilling in from outside */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 1.2]}
        color="#dff2ff"
        intensity={6}
        distance={7}
      />
    </group>
  );
}

/**
 * The boom-arm microphone clamped to the desk's return. Arm segments are
 * built joint-to-joint so the linkage actually connects.
 */
const MIC_JOINTS = {
  postBase: new Vector3(-0.82, 1.08, -3.3),
  postTop: new Vector3(-0.82, 1.82, -3.3),
  elbow: new Vector3(-0.32, 1.68, -2.92),
  micTop: new Vector3(-0.04, 1.46, -2.7),
};

function ArmSegment({
  from,
  to,
  radius,
}: {
  from: Vector3;
  to: Vector3;
  radius: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    const len = dir.length();
    return {
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        dir.normalize(),
      ),
      length: len,
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
    </mesh>
  );
}

export function MicArm() {
  return (
    <group>
      {/* Clamp */}
      <mesh position={[-0.82, 1.09, -3.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.06, 12]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
      </mesh>
      <ArmSegment
        from={MIC_JOINTS.postBase}
        to={MIC_JOINTS.postTop}
        radius={0.022}
      />
      <ArmSegment
        from={MIC_JOINTS.postTop}
        to={MIC_JOINTS.elbow}
        radius={0.018}
      />
      <ArmSegment
        from={MIC_JOINTS.elbow}
        to={MIC_JOINTS.micTop}
        radius={0.016}
      />
      {/* Joints */}
      <mesh position={[-0.82, 1.82, -3.3]} castShadow>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
      </mesh>
      <mesh position={[-0.32, 1.68, -2.92]} castShadow>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.5} />
      </mesh>
      {/* The mic, hanging from the arm's end */}
      <mesh position={[-0.04, 1.36, -2.7]} rotation={[0.15, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.17, 14]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Two little studio speakers flanking the editor monitor — plus the
 * rubber-duck debugging companion.
 */
export function Speakers() {
  const speaker = (x: number, z: number, tilt: number) => (
    <group position={[x, 1.06, z]} rotation={[0, tilt, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.14, 0.24, 0.13]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.09, 0.066]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.19, 0.066]}>
        <circleGeometry args={[0.022, 12]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.8} />
      </mesh>
    </group>
  );

  return (
    <group>
      {speaker(0.28, -3.68, 0.15)}
      {speaker(1.32, -3.72, -0.1)}
      {/* Rubber duck, supervising from the left speaker */}
      <group position={[0.28, 1.31, -3.68]}>
        <mesh castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={MATERIALS.duck} roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.05, 0.01]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color={MATERIALS.duck} roughness={0.6} />
        </mesh>
        <mesh position={[0.055, 0.045, 0.01]}>
          <coneGeometry args={[0.012, 0.03, 8]} />
          <meshStandardMaterial color={MATERIALS.duckBeak} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function DeskFan() {
  return (
    <group position={[0.18, 1.06, -3.62]} rotation={[0, 0.4, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 14]} />
        <meshStandardMaterial color="#f0efeb" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.085, 0.014, 10, 22]} />
        <meshStandardMaterial color="#f0efeb" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <circleGeometry args={[0.075, 18]} />
        <meshStandardMaterial color="#dddcd6" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function GameController() {
  return (
    <group position={[0.55, 1.06, -3.02]} rotation={[0, 0.5, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.17, 0.035, 0.1]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
      <mesh position={[-0.07, 0.02, 0.04]} castShadow>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
      <mesh position={[0.07, 0.02, 0.04]} castShadow>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * The PC tower on its caster stand, tucked under the desk.
 */
export function PcTower() {
  return (
    <group position={[2.05, 0, -3.15]}>
      <mesh position={[0, 0.045, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color={MATERIALS.gadgetLight} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.82, 0.44]} />
        <meshStandardMaterial color={MATERIALS.gadget} roughness={0.6} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0.12, 0.82, 0.222]}>
        <circleGeometry args={[0.012, 8]} />
        <meshBasicMaterial color="#7fd1c0" />
      </mesh>
    </group>
  );
}

/**
 * The wooden corner shelf beside the desk, complete with clutter.
 */
export function CornerShelf() {
  return (
    <group position={[3.45, 0, -3.75]}>
      {[0.05, 0.55, 1.05].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.85, 0.05, 0.7]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.8} />
        </mesh>
      ))}
      {[
        [-0.38, -0.3],
        [0.38, -0.3],
      ].map(([x, z]) => (
        <mesh key={`${x}`} position={[x, 0.55, z]} castShadow>
          <boxGeometry args={[0.05, 1.05, 0.08]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.8} />
        </mesh>
      ))}
      {/* Clutter */}
      <mesh position={[-0.2, 0.66, 0.1]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.22, 0.16, 0.16]} />
        <meshStandardMaterial color={MATERIALS.envelope} roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 0.63, -0.05]} castShadow>
        <boxGeometry args={[0.16, 0.11, 0.2]} />
        <meshStandardMaterial color={MATERIALS.books[3]} roughness={0.85} />
      </mesh>
      <mesh position={[0.05, 0.13, 0.05]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.11, 0.24]} />
        <meshStandardMaterial color={MATERIALS.books[1]} roughness={0.85} />
      </mesh>
    </group>
  );
}

/**
 * Abstract mountain print in a frame, on the back wall.
 */
export function Poster() {
  return (
    <group position={[-2.4, 2.25, -4.18]}>
      <mesh castShadow>
        <boxGeometry args={[0.78, 1.08, 0.03]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[0.68, 0.98]} />
        <meshStandardMaterial color={MATERIALS.paper} roughness={0.9} />
      </mesh>
      <mesh position={[0.14, 0.24, 0.02]}>
        <circleGeometry args={[0.09, 24]} />
        <meshStandardMaterial color={MATERIALS.lampShade} roughness={0.9} />
      </mesh>
      <mesh position={[-0.08, -0.18, 0.022]}>
        <circleGeometry args={[0.26, 3]} />
        <meshStandardMaterial color={MATERIALS.rug} roughness={0.9} />
      </mesh>
      <mesh position={[0.14, -0.24, 0.024]}>
        <circleGeometry args={[0.19, 3]} />
        <meshStandardMaterial color={MATERIALS.leafDark} roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Two small framed pictures above the desk.
 */
export function PictureFrames() {
  return (
    <group>
      <group position={[-0.85, 2.3, -4.18]} rotation={[0, 0, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.44, 0.03]} />
          <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.28, 0.36]} />
          <meshStandardMaterial color={MATERIALS.pins[1]} roughness={0.9} />
        </mesh>
      </group>
      <group position={[-1.45, 2.05, -4.18]} rotation={[0, 0, -0.03]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.03]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.23, 0.23]} />
          <meshStandardMaterial color={MATERIALS.pins[3]} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Wall clock showing the visitor's actual local time; the minute hand
 * creeps along in real time.
 */
export function WallClock() {
  const minuteRef = useRef<Group>(null);
  const start = useMemo(() => {
    const now = new Date();
    return { hours: now.getHours() % 12, minutes: now.getMinutes() };
  }, []);

  const hourAngle = -((start.hours + start.minutes / 60) / 12) * Math.PI * 2;
  const minuteAngle = -(start.minutes / 60) * Math.PI * 2;

  useFrame((state) => {
    const minute = minuteRef.current;
    if (!minute) return;
    minute.rotation.z =
      minuteAngle - (state.clock.getElapsedTime() / 3600) * Math.PI * 2;
  });

  return (
    <group position={[0.2, 3.0, -4.18]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
        <meshStandardMaterial color={MATERIALS.clockFace} roughness={0.8} />
      </mesh>
      {/* Hands pivot at the clock center */}
      <group position={[0, 0, 0.036]} rotation={[0, 0, hourAngle]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.1, 0.01]} />
          <meshStandardMaterial color={MATERIALS.metal} roughness={0.4} />
        </mesh>
      </group>
      <group ref={minuteRef} position={[0, 0, 0.036]}>
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.014, 0.15, 0.01]} />
          <meshStandardMaterial color={MATERIALS.metal} roughness={0.4} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.042]}>
        <sphereGeometry args={[0.015, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.envelopeFlag} roughness={0.5} />
      </mesh>
    </group>
  );
}

const BULBS_PER_STRAND = 8;

/**
 * Fairy lights sagging along the top of the back wall — they really come
 * alive at night.
 */
export function StringLights() {
  const live = useLivePalette();
  const lightRef = useRef<PointLight>(null);
  const bulbMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffe4b8',
        emissive: '#ffc37a',
        emissiveIntensity: 0.5,
        roughness: 0.6,
      }),
    [],
  );

  useFrame(() => {
    const intensity = live.current.fairyIntensity;
    bulbMaterial.emissiveIntensity = intensity;
    if (lightRef.current) lightRef.current.intensity = intensity * 1.6;
  });

  const strands: Array<[number, number]> = [
    [-3.9, -0.1],
    [0.1, 3.9],
  ];

  return (
    <group>
      {strands.map(([from, to], strandIndex) => (
        <group key={strandIndex}>
          {Array.from({ length: BULBS_PER_STRAND }, (_, i) => {
            const t = (i + 0.5) / BULBS_PER_STRAND;
            const x = from + (to - from) * t;
            const y = 3.18 - Math.sin(Math.PI * t) * 0.24;
            return (
              <mesh key={i} position={[x, y, -4.14]} material={bulbMaterial}>
                <sphereGeometry args={[0.035, 10, 10]} />
              </mesh>
            );
          })}
        </group>
      ))}
      <pointLight
        ref={lightRef}
        position={[0, 3.0, -3.8]}
        color="#ffc37a"
        intensity={0.8}
        distance={4}
      />
    </group>
  );
}

const BOOKS_PER_SHELF = 9;

function BookRow({
  shelfY,
  salt,
  peekIndex,
  hovered,
}: {
  shelfY: number;
  salt: number;
  peekIndex: number;
  hovered: boolean;
}) {
  const peekRef = useRef<Mesh>(null);
  const peekOffset = useRef(0);

  const books = useMemo(
    () =>
      Array.from({ length: BOOKS_PER_SHELF }, (_, i) => ({
        height: 0.26 + seeded(i, salt) * 0.1,
        color: MATERIALS.books[(i + salt) % MATERIALS.books.length],
        tilt: i === BOOKS_PER_SHELF - 2 ? 0.16 : 0,
        gap: i > BOOKS_PER_SHELF - 3 ? 0.03 : 0,
      })),
    [salt],
  );

  useFrame((_, delta) => {
    // One book slides out of the row when the shelf is hovered
    peekOffset.current = expDamp(
      peekOffset.current,
      hovered ? 0.09 : 0,
      10,
      Math.min(delta, 0.066),
    );
    if (peekRef.current) peekRef.current.position.z = peekOffset.current;
  });

  return (
    <group position={[0, shelfY, 0]}>
      {books.map((book, i) => (
        <mesh
          key={i}
          ref={i === peekIndex ? peekRef : undefined}
          position={[-0.68 + i * 0.115 + book.gap, book.height / 2, 0]}
          rotation={[0, 0, book.tilt]}
          castShadow
        >
          <boxGeometry args={[0.085, book.height, 0.22]} />
          <meshStandardMaterial color={book.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function Bookshelf({
  hovered,
  reduceMotion,
}: {
  hovered: boolean;
  reduceMotion: boolean;
}) {
  const animateHover = hovered && !reduceMotion;

  return (
    <group position={[-3.8, 0, 1.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Sides */}
      <mesh position={[-0.85, 1.15, 0]} castShadow>
        <boxGeometry args={[0.05, 2.3, 0.32]} />
        <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
      </mesh>
      <mesh position={[0.85, 1.15, 0]} castShadow>
        <boxGeometry args={[0.05, 2.3, 0.32]} />
        <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 1.15, -0.15]}>
        <boxGeometry args={[1.7, 2.3, 0.02]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.85} />
      </mesh>
      {/* Shelves */}
      {[0.06, 0.72, 1.38, 2.04].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.7, 0.045, 0.32]} />
          <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
        </mesh>
      ))}

      <BookRow shelfY={0.085} salt={1} peekIndex={3} hovered={animateHover} />
      <BookRow shelfY={0.745} salt={3} peekIndex={6} hovered={animateHover} />

      {/* A lazy horizontal stack on the top shelf */}
      <group position={[-0.35, 1.4, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.035 + i * 0.07, 0]} castShadow>
            <boxGeometry args={[0.34 - i * 0.03, 0.06, 0.24]} />
            <meshStandardMaterial
              color={MATERIALS.books[(i + 2) % MATERIALS.books.length]}
              roughness={0.85}
            />
          </mesh>
        ))}
      </group>
      {/* Tiny plant on the top shelf */}
      <group position={[0.45, 1.42, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.045, 0.1, 14]} />
          <meshStandardMaterial color={MATERIALS.pot} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={MATERIALS.leaf} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * A stack of books that didn't fit the shelf, on the floor next to it.
 */
export function FloorBooks() {
  return (
    <group position={[-3.7, 0, 3.0]} rotation={[0, 0.4, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 0.04 + i * 0.075, 0]}
          rotation={[0, seeded(i, 11) * 0.6 - 0.3, 0]}
          castShadow
        >
          <boxGeometry args={[0.36 - i * 0.02, 0.07, 0.27]} />
          <meshStandardMaterial
            color={MATERIALS.books[(i * 2 + 1) % MATERIALS.books.length]}
            roughness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Plant() {
  return (
    <group position={[-3.6, 0, -3.5]}>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.35, 20]} />
        <meshStandardMaterial color={MATERIALS.pot} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.35, 8]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.32, 14, 14]} />
        <meshStandardMaterial color={MATERIALS.leaf} roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 1.0, 0.08]} castShadow>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color={MATERIALS.leafDark} roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 1.02, -0.06]} castShadow>
        <sphereGeometry args={[0.2, 14, 14]} />
        <meshStandardMaterial color={MATERIALS.leaf} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function FloorCushion() {
  return (
    <group position={[-1.4, 0, 2.7]}>
      <mesh position={[0, 0.09, 0]} castShadow>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial color={MATERIALS.rugInner} roughness={1} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color={MATERIALS.rug} roughness={1} />
      </mesh>
    </group>
  );
}

const shapeFrom = (points: Array<[number, number]>) => {
  const shape = new Shape();
  points.forEach(([x, y], i) =>
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y),
  );
  shape.closePath();
  return shape;
};

// One lens rim: the panto outline with its aperture punched out
const LENS_FRAME_SHAPE = (() => {
  const rim = shapeFrom(lensOutline());
  rim.holes.push(shapeFrom(lensAperture()));
  return rim;
})();

const LENS_EXTRUDE = { depth: 0.012, bevelEnabled: false, curveSegments: 8 };

/**
 * The avatar's hair. The shape itself lives in `hairGeometry.ts`; here it
 * is dressed with the scene's colours — a taper fading toward skin over
 * the sides and nape, and a shadowed crease along the part.
 */
function Hair() {
  const geometry = useMemo(() => {
    const surface = buildHairSurface();
    const hairColor = new Color(MATERIALS.hair);
    const skinColor = new Color(MATERIALS.skin);
    const scratch = new Color();
    const colors = new Float32Array(surface.fade.length * 3);

    for (let i = 0; i < surface.fade.length; i++) {
      scratch.copy(hairColor).lerp(skinColor, surface.fade[i]);
      colors[i * 3] = scratch.r * surface.shade[i];
      colors[i * 3 + 1] = scratch.g * surface.shade[i];
      colors[i * 3 + 2] = scratch.b * surface.shade[i];
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(surface.positions, 3));
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    geo.setIndex(new BufferAttribute(surface.index, 1));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial vertexColors roughness={0.92} />
    </mesh>
  );
}

type AvatarProps = {
  hovered: boolean;
  active: boolean;
  showLabel: boolean;
  reduceMotion: boolean;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
};

// A gentle loop through the open floor, threading between the furniture
const WALK_PATH: Array<[number, number]> = [
  [1.5, 2.0],
  [-0.6, 2.7],
  [-2.5, 1.7],
  [-2.7, -0.6],
  [-1.5, -1.7],
  [0.5, -1.5],
  [2.5, -0.7],
  [3.0, 1.1],
];

// He was chibi-small beside a standing desk; this brings him up to a
// believable adult height for the room without changing his proportions
const AVATAR_SCALE = 1.42;
// A dead-straight arm looks stiff; both elbows keep a little bend
const ARM_REST_BEND = 0.12;
const WALK_SPEED = 0.62 * AVATAR_SCALE;
const TAU = Math.PI * 2;

const wrapAngle = (angle: number) =>
  ((((angle + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

/**
 * A tiny low-poly me, wandering the room in a long-sleeve shirt, shorts
 * and a watch. Stops, turns to face the camera and waves whenever you
 * hover or open the About section — and keeps facing the camera as you
 * orbit around the room.
 */
export function Avatar({
  hovered,
  active,
  showLabel,
  reduceMotion,
  onHover,
  onSelect,
}: AvatarProps) {
  const rootRef = useRef<Group>(null);
  const scaleRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const torsoRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const rightElbowRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        WALK_PATH.map(([x, z]) => new Vector3(x, 0, z)),
        true,
        'catmullrom',
        0.5,
      ),
    [],
  );
  const curveLength = useMemo(() => curve.getLength(), [curve]);

  const walkParam = useRef(0);
  const position = useMemo(() => curve.getPointAt(0), [curve]);
  const desired = useMemo(() => new Vector3(), []);
  const previous = useMemo(() => new Vector3(), []);
  const yaw = useRef(0);
  const waveAmount = useRef(0);
  const strideAmount = useRef(0);
  const walkPhase = useRef(0);
  const hoverScale = useRef(1);

  useFrame((state, delta) => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body) return;

    const dt = Math.min(delta, 0.066);
    const t = state.clock.getElapsedTime();
    // Hovering or having the section open both hold him in place
    const greeting = hovered || active;

    // He simply stops where he is when greeting — the camera comes to
    // him rather than the other way round
    if (reduceMotion) {
      desired.copy(AVATAR_REST_SPOT);
    } else {
      if (!greeting) {
        walkParam.current =
          (walkParam.current + (WALK_SPEED * dt) / curveLength) % 1;
      }
      curve.getPointAt(walkParam.current, desired);
    }

    previous.copy(position);
    position.lerp(desired, reduceMotion ? 1 : 1 - Math.exp(-4.5 * dt));
    const moved = position.distanceTo(previous);
    const walking = moved / dt > 0.09;
    // Publish for the camera rig and the About panel
    avatarPosition.copy(position);

    // Walk bounce only ever lifts, so his feet never sink into the floor
    // Longer legs cover more ground per stride
    walkPhase.current += (moved * 7.2) / AVATAR_SCALE;
    strideAmount.current = expDamp(
      strideAmount.current,
      walking && !reduceMotion ? 1 : 0,
      8,
      dt,
    );
    const swing = Math.sin(walkPhase.current) * strideAmount.current;
    const bounce =
      Math.abs(Math.sin(walkPhase.current)) *
      0.02 *
      AVATAR_SCALE *
      strideAmount.current;
    root.position.set(position.x, position.y + bounce, position.z);

    const intro = reduceMotion ? 1 : easeOutBack(clamp01((t - 0.55) / 0.5));
    hoverScale.current = expDamp(
      hoverScale.current,
      hovered ? 1.06 : 1,
      14,
      dt,
    );
    scaleRef.current?.scale.setScalar(
      Math.max(0.0001, intro * hoverScale.current * AVATAR_SCALE),
    );

    // Face where he is heading; once stopped to greet, face the camera —
    // wherever it happens to be, so he tracks you as you orbit
    let targetYaw = yaw.current;
    if (walking) {
      targetYaw = Math.atan2(position.x - previous.x, position.z - previous.z);
    } else if (greeting) {
      targetYaw = Math.atan2(
        state.camera.position.x - position.x,
        state.camera.position.z - position.z,
      );
    }
    yaw.current +=
      wrapAngle(targetYaw - yaw.current) *
      (reduceMotion ? 1 : 1 - Math.exp(-9 * dt));
    body.rotation.y = yaw.current;

    // He only waves once he has actually come to a stop
    waveAmount.current = expDamp(
      waveAmount.current,
      greeting && !walking ? 1 : 0,
      9,
      dt,
    );
    const wiggle = reduceMotion
      ? 0
      : Math.sin(t * 7) * 0.42 * waveAmount.current;

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing * 0.55;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * 0.55;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.45;
    if (rightArmRef.current) {
      const settled = 1 - waveAmount.current;
      rightArmRef.current.rotation.x = swing * 0.45 * settled;
      // Upper arm out to the side, forearm folded up from the elbow —
      // swinging one straight capsule out instead reads as a plank
      rightArmRef.current.rotation.z = waveAmount.current * 1.62;
    }
    if (rightElbowRef.current) {
      rightElbowRef.current.rotation.z =
        ARM_REST_BEND +
        waveAmount.current * (1.15 - ARM_REST_BEND) +
        // The wave itself lives in the forearm, so the hand does the
        // waving rather than the whole arm sweeping
        wiggle;
    }

    const still = 1 - strideAmount.current;
    if (torsoRef.current && !reduceMotion) {
      torsoRef.current.scale.y = 1 + Math.sin(t * 1.6) * 0.015 * still;
    }
    if (headRef.current && !reduceMotion) {
      headRef.current.rotation.z = Math.sin(t * 0.9) * 0.035 * still;
    }
  });

  return (
    <group ref={rootRef}>
      {showLabel && (
        <Html
          center
          position={[0, 1.78 * AVATAR_SCALE, 0]}
          zIndexRange={[40, 0]}
        >
          <button
            type="button"
            aria-label="Open About me"
            className="cursor-pointer rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-3 pt-[7px] pb-[5px] text-[12px] leading-none font-medium whitespace-nowrap text-(--color-ink-2) shadow-(--shadow-md) transition-colors hover:border-(--color-accent) hover:text-(--color-accent-text)"
            onMouseEnter={() => onHover('about')}
            onMouseLeave={() => onHover(null)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect('about');
            }}
          >
            About me
          </button>
        </Html>
      )}
      <group ref={scaleRef} scale={0.0001}>
        <group
          ref={bodyRef}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover('about');
            setSceneCursor('hover', true);
          }}
          onPointerOut={() => {
            onHover(null);
            setSceneCursor('hover', false);
          }}
          onClick={(event) => {
            event.stopPropagation();
            setSceneCursor('hover', false);
            onSelect('about');
          }}
        >
          {/* Generous invisible hit target — he is small and moving */}
          <mesh position={[0, 0.72, 0]}>
            <capsuleGeometry args={[0.32, 0.85, 4, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {/* Legs, pivoting at the hips */}
          {[-1, 1].map((side) => (
            <group
              key={side}
              ref={side === -1 ? leftLegRef : rightLegRef}
              position={[side * 0.085, 0.5, 0]}
            >
              <mesh position={[0, -0.197, 0]} castShadow>
                <capsuleGeometry args={[0.052, 0.29, 4, 10]} />
                <meshStandardMaterial color={MATERIALS.skin} roughness={0.85} />
              </mesh>
              {/* Short leg over the thigh, hem cut straight */}
              <mesh
                position={[0, -0.05, 0]}
                rotation={[0, 0, side * -0.05]}
                scale={[1, 1, 0.92]}
                castShadow
              >
                <cylinderGeometry args={[0.082, 0.09, 0.18, 14, 1, true]} />
                <meshStandardMaterial
                  color={MATERIALS.shorts}
                  roughness={0.9}
                  side={2}
                />
              </mesh>
              <mesh
                position={[0, -0.45, 0.03]}
                scale={[0.95, 0.72, 1.35]}
                castShadow
              >
                <sphereGeometry args={[0.062, 12, 12]} />
                <meshStandardMaterial color={MATERIALS.sock} roughness={0.9} />
              </mesh>
            </group>
          ))}

          {/* Shorts: a tapered waist over the hips, legs on the thighs */}
          <mesh position={[0, 0.57, 0]} scale={[1, 1, 0.84]} castShadow>
            <cylinderGeometry args={[0.15, 0.178, 0.2, 16]} />
            <meshStandardMaterial color={MATERIALS.shorts} roughness={0.9} />
          </mesh>
          {/* Waistband */}
          <mesh position={[0, 0.66, 0]} scale={[1, 1, 0.84]}>
            <cylinderGeometry args={[0.153, 0.153, 0.035, 16]} />
            <meshStandardMaterial color="#4a4a54" roughness={0.9} />
          </mesh>

          {/* Long-sleeve shirt */}
          <group ref={torsoRef}>
            <mesh position={[0, 0.8, 0]} scale={[1.05, 1, 0.75]} castShadow>
              <capsuleGeometry args={[0.15, 0.26, 6, 16]} />
              <meshStandardMaterial color={MATERIALS.hoodie} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.072, 0.016, 8, 18]} />
              <meshStandardMaterial color="#33415a" roughness={0.9} />
            </mesh>
          </group>

          {/* Arms: a ball at each joint so the shoulder and elbow stay
            closed at any angle, and a hinged forearm so the wave bends */}
          <group ref={leftArmRef} position={[-0.158, 0.95, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.055, 10, 10]} />
              <meshStandardMaterial color={MATERIALS.hoodie} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.09, 0]} castShadow>
              <capsuleGeometry args={[0.047, 0.16, 4, 10]} />
              <meshStandardMaterial color={MATERIALS.hoodie} roughness={0.9} />
            </mesh>
            <group position={[0, -0.185, 0]} rotation={[0, 0, -ARM_REST_BEND]}>
              <mesh>
                <sphereGeometry args={[0.048, 10, 10]} />
                <meshStandardMaterial
                  color={MATERIALS.hoodie}
                  roughness={0.9}
                />
              </mesh>
              <mesh position={[0, -0.075, 0]} castShadow>
                <capsuleGeometry args={[0.045, 0.13, 4, 10]} />
                <meshStandardMaterial
                  color={MATERIALS.hoodie}
                  roughness={0.9}
                />
              </mesh>
              {/* Sleeve cuff, then the watch on the wrist */}
              <mesh position={[0, -0.148, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
                <meshStandardMaterial color="#33415a" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.178, 0]} castShadow>
                <cylinderGeometry args={[0.043, 0.043, 0.032, 12]} />
                <meshStandardMaterial
                  color={MATERIALS.gadget}
                  roughness={0.5}
                />
              </mesh>
              <mesh
                position={[-0.042, -0.178, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <circleGeometry args={[0.022, 12]} />
                <meshStandardMaterial
                  color="#cfd6dd"
                  roughness={0.3}
                  metalness={0.2}
                />
              </mesh>
              <mesh position={[0, -0.222, 0]} castShadow>
                <sphereGeometry args={[0.05, 10, 10]} />
                <meshStandardMaterial color={MATERIALS.skin} roughness={0.85} />
              </mesh>
            </group>
          </group>
          <group ref={rightArmRef} position={[0.158, 0.95, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.055, 10, 10]} />
              <meshStandardMaterial color={MATERIALS.hoodie} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.09, 0]} castShadow>
              <capsuleGeometry args={[0.047, 0.16, 4, 10]} />
              <meshStandardMaterial color={MATERIALS.hoodie} roughness={0.9} />
            </mesh>
            <group ref={rightElbowRef} position={[0, -0.185, 0]}>
              <mesh>
                <sphereGeometry args={[0.048, 10, 10]} />
                <meshStandardMaterial
                  color={MATERIALS.hoodie}
                  roughness={0.9}
                />
              </mesh>
              <mesh position={[0, -0.075, 0]} castShadow>
                <capsuleGeometry args={[0.045, 0.13, 4, 10]} />
                <meshStandardMaterial
                  color={MATERIALS.hoodie}
                  roughness={0.9}
                />
              </mesh>
              <mesh position={[0, -0.148, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
                <meshStandardMaterial color="#33415a" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.208, 0]} castShadow>
                <sphereGeometry args={[0.05, 10, 10]} />
                <meshStandardMaterial color={MATERIALS.skin} roughness={0.85} />
              </mesh>
            </group>
          </group>

          {/* Head */}
          <group ref={headRef} position={[0, 1.22, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.17, 18, 18]} />
              <meshStandardMaterial color={MATERIALS.skin} roughness={0.8} />
            </mesh>
            {/* Ears */}
            <mesh position={[-0.165, -0.01, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color={MATERIALS.skin} roughness={0.8} />
            </mesh>
            <mesh position={[0.165, -0.01, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color={MATERIALS.skin} roughness={0.8} />
            </mesh>
            <Hair />
            {/* Glasses — thin round panto rims, angled outward so they
              wrap the face instead of sinking into it */}
            {[-1, 1].map((side) => (
              <group key={side}>
                <mesh
                  position={[
                    side * LENS_CENTER[0],
                    LENS_CENTER[1],
                    LENS_CENTER[2],
                  ]}
                  rotation={[0, side * LENS_YAW, 0]}
                >
                  <extrudeGeometry args={[LENS_FRAME_SHAPE, LENS_EXTRUDE]} />
                  <meshStandardMaterial
                    color={MATERIALS.gadget}
                    roughness={0.4}
                  />
                </mesh>
                <mesh
                  position={[
                    side * TEMPLE.position[0],
                    TEMPLE.position[1],
                    TEMPLE.position[2],
                  ]}
                  rotation={[0, -side * TEMPLE.yaw, 0]}
                >
                  <boxGeometry args={[0.007, 0.006, TEMPLE.length]} />
                  <meshStandardMaterial
                    color={MATERIALS.gadget}
                    roughness={0.4}
                  />
                </mesh>
                {/* Eye, sitting behind the lens */}
                <mesh position={[side * 0.068, 0.012, 0.152]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <meshStandardMaterial
                    color={MATERIALS.hair}
                    roughness={0.4}
                  />
                </mesh>
              </group>
            ))}
            <mesh position={[0, BRIDGE.y, BRIDGE.z]}>
              <boxGeometry args={[BRIDGE.width, 0.005, 0.008]} />
              <meshStandardMaterial color={MATERIALS.gadget} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.065, 0.15]} rotation={[0.35, 0, Math.PI]}>
              <torusGeometry args={[0.038, 0.007, 6, 12, Math.PI * 0.75]} />
              <meshStandardMaterial color="#8a5c48" roughness={0.7} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

type ChessPieceKind = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

type PlacedPiece = {
  kind: ChessPieceKind;
  white: boolean;
  file: number;
  rank: number;
};

/** Reads the piece-placement field of a FEN into board coordinates. */
function parseFen(fen: string): PlacedPiece[] {
  const pieces: PlacedPiece[] = [];
  fen
    .split(' ')[0]
    .split('/')
    .forEach((row, index) => {
      const rank = 7 - index;
      let file = 0;
      for (const symbol of row) {
        const skip = Number(symbol);
        if (!Number.isNaN(skip)) {
          file += skip;
          continue;
        }
        pieces.push({
          kind: symbol.toLowerCase() as ChessPieceKind,
          white: symbol === symbol.toUpperCase(),
          file,
          rank,
        });
        file += 1;
      }
    });
  return pieces;
}

const SQUARE = 0.072;
const BOARD_Y = 0.648;

/** Small turned-looking piece, built from a base plus a silhouette top. */
function ChessPiece({ kind, white }: { kind: ChessPieceKind; white: boolean }) {
  const color = white ? MATERIALS.pieceLight : MATERIALS.pieceDark;
  const material = (
    <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
  );

  return (
    <group>
      {/* Every piece shares the same little base */}
      <mesh position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.023, 0.026, 0.016, 12]} />
        {material}
      </mesh>

      {kind === 'p' && (
        <mesh position={[0, 0.032, 0]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          {material}
        </mesh>
      )}

      {kind === 'r' && (
        <mesh position={[0, 0.034, 0]}>
          <boxGeometry args={[0.034, 0.036, 0.034]} />
          {material}
        </mesh>
      )}

      {kind === 'n' && (
        <mesh position={[0, 0.036, 0.004]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.044, 0.03]} />
          {material}
        </mesh>
      )}

      {kind === 'b' && (
        <mesh position={[0, 0.04, 0]}>
          <coneGeometry args={[0.019, 0.052, 12]} />
          {material}
        </mesh>
      )}

      {kind === 'q' && (
        <>
          <mesh position={[0, 0.04, 0]}>
            <coneGeometry args={[0.021, 0.054, 12]} />
            {material}
          </mesh>
          <mesh position={[0, 0.072, 0]}>
            <sphereGeometry args={[0.013, 10, 10]} />
            {material}
          </mesh>
        </>
      )}

      {kind === 'k' && (
        <>
          <mesh position={[0, 0.042, 0]}>
            <cylinderGeometry args={[0.017, 0.021, 0.056, 12]} />
            {material}
          </mesh>
          <mesh position={[0, 0.078, 0]}>
            <boxGeometry args={[0.009, 0.026, 0.009]} />
            {material}
          </mesh>
          <mesh position={[0, 0.079, 0]}>
            <boxGeometry args={[0.022, 0.009, 0.009]} />
            {material}
          </mesh>
        </>
      )}
    </group>
  );
}

/**
 * A little side table with a chessboard mid-game on it. The position is
 * an unlabelled easter egg — see CHESS_POSITION_FEN in resume/data.ts.
 */
export function ChessTable({ fen }: { fen: string }) {
  const pieces = useMemo(() => parseFen(fen), [fen]);
  // Only the dark squares are drawn; the board slab is the light colour
  const darkSquares = useMemo(() => {
    const squares: Array<[number, number]> = [];
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        if ((file + rank) % 2 === 0) squares.push([file, rank]);
      }
    }
    return squares;
  }, []);

  const squarePosition = (file: number, rank: number) =>
    [(file - 3.5) * SQUARE, 0, (3.5 - rank) * SQUARE] as [
      number,
      number,
      number,
    ];

  const squaresRef = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = squaresRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    darkSquares.forEach(([file, rank], index) => {
      const [x, , z] = squarePosition(file, rank);
      dummy.position.set(x, 0.6505, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [darkSquares]);

  return (
    <group position={[3.45, 0, 2.25]}>
      {/* Round pedestal table */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.55, 12]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.025, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.05, 16]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>

      {/* The board, set down a touch askew like a real one */}
      <group position={[0, 0, 0]} rotation={[0, 0.26, 0]}>
        <mesh position={[0, 0.637, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.64, 0.026, 0.64]} />
          <meshStandardMaterial color={MATERIALS.boardLight} roughness={0.75} />
        </mesh>
        {/* Rim */}
        <mesh position={[0, 0.634, 0]}>
          <boxGeometry args={[0.66, 0.016, 0.66]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
        </mesh>
        <instancedMesh
          ref={squaresRef}
          args={[undefined, undefined, darkSquares.length]}
        >
          <boxGeometry args={[SQUARE, 0.003, SQUARE]} />
          <meshStandardMaterial color={MATERIALS.boardDark} roughness={0.8} />
        </instancedMesh>
        {pieces.map((piece) => {
          const [x, , z] = squarePosition(piece.file, piece.rank);
          return (
            <group
              key={`${piece.file}:${piece.rank}`}
              position={[x, BOARD_Y + 0.004, z]}
              rotation={[0, piece.white ? 0 : Math.PI, 0]}
            >
              <ChessPiece kind={piece.kind} white={piece.white} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

const DUST_COUNT = 70;

export function DustMotes({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<Group>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      array[i * 3] = (seeded(i, 7) - 0.5) * 7;
      array[i * 3 + 1] = 0.3 + seeded(i, 8) * 2.7;
      array[i * 3 + 2] = (seeded(i, 9) - 0.5) * 7;
    }
    return array;
  }, []);

  useFrame((state) => {
    const group = ref.current;
    if (!group || reduceMotion) return;
    const t = state.clock.getElapsedTime();
    group.rotation.y = t * 0.02;
    group.position.y = Math.sin(t * 0.3) * 0.06;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffe9c4"
          size={0.025}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
