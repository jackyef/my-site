import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
} from 'three';

import { useLivePalette } from './livePalette';
import { MATERIALS } from './palette';
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
      : clamp01((state.clock.getElapsedTime() - delay) / 0.7);
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
      : easeOutBack(clamp01((state.clock.getElapsedTime() - introDelay) / 0.7));
    hoverScale.current = expDamp(
      hoverScale.current,
      hovered ? 1.06 : 1,
      10,
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
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(event) => {
          event.stopPropagation();
          document.body.style.cursor = '';
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
    <group position={[1.0, 0, -3.3]}>
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.08, 1.1]} />
        <meshStandardMaterial color={MATERIALS.wood} roughness={0.7} />
      </mesh>
      {[
        [-1.2, -0.45],
        [-1.2, 0.45],
        [1.2, -0.45],
        [1.2, 0.45],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.49, z]} castShadow>
          <boxGeometry args={[0.08, 0.98, 0.08]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function Chair() {
  return (
    <group position={[1.0, 0, -2.15]} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.5]} />
        <meshStandardMaterial color={MATERIALS.woodLight} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0.24]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.05]} />
        <meshStandardMaterial color={MATERIALS.woodLight} roughness={0.7} />
      </mesh>
      {[
        [-0.23, -0.2],
        [-0.23, 0.2],
        [0.23, -0.2],
        [0.23, 0.2],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.26, z]} castShadow>
          <boxGeometry args={[0.05, 0.52, 0.05]} />
          <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

const CODE_BAR_COUNT = 9;

export function Monitor() {
  const live = useLivePalette();
  const screenRef = useRef<MeshStandardMaterial>(null);
  const barsRef = useRef<Group>(null);
  const glowRef = useRef<PointLight>(null);

  const bars = useMemo(
    () =>
      Array.from({ length: CODE_BAR_COUNT }, (_, i) => ({
        width: 0.14 + seeded(i, 2) * 0.5,
        indent: i % 3 === 1 ? 0.08 : i % 4 === 2 ? 0.16 : 0,
        color: MATERIALS.screenCode[i % MATERIALS.screenCode.length],
      })),
    [],
  );

  useFrame(() => {
    const intensity = live.current.screenIntensity;
    if (screenRef.current) screenRef.current.emissiveIntensity = intensity;
    if (glowRef.current) glowRef.current.intensity = intensity * 1.6;
    barsRef.current?.children.forEach((child) => {
      const material = (child as Mesh).material;
      if (!Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.45 + intensity * 0.3;
      }
    });
  });

  return (
    <group position={[1.0, 1.06, -3.6]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 24]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.06, 0.32, 0.06]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[1.15, 0.68, 0.06]} />
        <meshStandardMaterial color={MATERIALS.screenBezel} roughness={0.4} />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 0.62, 0.032]}>
        <planeGeometry args={[1.05, 0.58]} />
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
              -0.44 + bar.indent + bar.width / 2,
              0.84 - i * 0.052,
              0.036,
            ]}
          >
            <planeGeometry args={[bar.width, 0.022]} />
            <meshBasicMaterial color={bar.color} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>

      {/* Screen glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.62, 0.6]}
        color="#7fd1c0"
        intensity={1.2}
        distance={2.2}
      />
    </group>
  );
}

export function Keyboard() {
  return (
    <group position={[1.0, 1.06, -3.05]} rotation={[0, 0.04, 0]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.62, 0.03, 0.21]} />
        <meshStandardMaterial color={MATERIALS.screenBezel} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.032, 0]}>
        <boxGeometry args={[0.56, 0.01, 0.16]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function MouseAndPad() {
  return (
    <group position={[1.62, 1.06, -3.05]}>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.32, 0.012, 0.26]} />
        <meshStandardMaterial color={MATERIALS.rug} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[0, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color={MATERIALS.screenBezel} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Notebook() {
  return (
    <group position={[0.25, 1.06, -2.95]} rotation={[0, 0.35, 0]}>
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
      mesh.position.y = 0.12 + progress * 0.35;
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
    <group position={[1.95, 1.06, -2.98]}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.14, 20]} />
        <meshStandardMaterial color={MATERIALS.mug} roughness={0.4} />
      </mesh>
      <mesh position={[0.085, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.035, 0.012, 10, 20]} />
        <meshStandardMaterial color={MATERIALS.mug} roughness={0.4} />
      </mesh>
      <Steam reduceMotion={reduceMotion} />
    </group>
  );
}

export function DeskLamp() {
  const live = useLivePalette();
  const shadeRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame(() => {
    const intensity = live.current.lampIntensity;
    if (shadeRef.current) shadeRef.current.emissiveIntensity = intensity * 0.04;
    if (lightRef.current) lightRef.current.intensity = intensity;
  });

  return (
    <group position={[2.1, 1.06, -3.6]}>
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
    <group position={[-0.05, 1.06, -3.2]}>
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

export function Corkboard() {
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

export function WallWindow() {
  const live = useLivePalette();
  const skyRef = useRef<MeshBasicMaterial>(null);
  const discRef = useRef<Mesh>(null);
  const discMaterialRef = useRef<MeshBasicMaterial>(null);
  const glowRef = useRef<PointLight>(null);

  useFrame(() => {
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
  });

  return (
    <group position={[-4.17, 2.2, -1.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* Sky seen through the glass */}
      <mesh>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial ref={skyRef} color={MATERIALS.paper} />
      </mesh>
      {/* The sun (or moon) — slides across the pane as the theme shifts */}
      <mesh ref={discRef} position={[-0.3, 0.45, 0.005]}>
        <circleGeometry args={[0.13, 24]} />
        <meshBasicMaterial ref={discMaterialRef} color="#fff3c4" />
      </mesh>

      {/* Frame + cross bars */}
      <mesh position={[0, 0.72, 0.02]}>
        <boxGeometry args={[1.34, 0.08, 0.1]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.72, 0.02]}>
        <boxGeometry args={[1.34, 0.08, 0.1]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.63, 0, 0.02]}>
        <boxGeometry args={[0.08, 1.52, 0.1]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.63, 0, 0.02]}>
        <boxGeometry args={[0.08, 1.52, 0.1]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.05, 1.44, 0.06]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.28, 0.05, 0.06]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>

      {/* Curtains */}
      <mesh position={[-0.82, 0.05, 0.1]} castShadow>
        <boxGeometry args={[0.26, 1.75, 0.1]} />
        <meshStandardMaterial color={MATERIALS.curtain} roughness={0.95} />
      </mesh>
      <mesh position={[0.82, 0.05, 0.1]} castShadow>
        <boxGeometry args={[0.26, 1.75, 0.1]} />
        <meshStandardMaterial color={MATERIALS.curtain} roughness={0.95} />
      </mesh>
      {/* Curtain rod */}
      <mesh position={[0, 0.98, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.9, 10]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.6} />
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

function BookRow({ shelfY, salt }: { shelfY: number; salt: number }) {
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

  return (
    <group position={[0, shelfY, 0]}>
      {books.map((book, i) => (
        <mesh
          key={i}
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

export function Bookshelf() {
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

      <BookRow shelfY={0.085} salt={1} />
      <BookRow shelfY={0.745} salt={3} />

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

type DogProps = {
  hovered: boolean;
  reduceMotion: boolean;
};

/**
 * A golden pup lying in its bed on the rug. Breathes, and wags its tail
 * faster when you pay attention to it.
 */
export function Dog({ hovered, reduceMotion }: DogProps) {
  const bodyRef = useRef<Mesh>(null);
  const tailRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const body = bodyRef.current;
    if (body && !reduceMotion) {
      body.scale.y = 0.6 + Math.sin(t * 1.5) * 0.018;
    }
    const tail = tailRef.current;
    if (tail) {
      const speed = hovered ? 9 : 2.4;
      const amplitude = hovered ? 0.55 : 0.22;
      tail.rotation.y = reduceMotion ? 0 : Math.sin(t * speed) * amplitude;
    }
  });

  return (
    <group>
      {/* Bed */}
      <group position={[1.8, 0, 1.2]}>
        <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.62, 0.08, 28]} />
          <meshStandardMaterial color={MATERIALS.bed} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.11, 12, 28]} />
          <meshStandardMaterial color={MATERIALS.bed} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.085, 0]} receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 28]} />
          <meshStandardMaterial color={MATERIALS.bedCushion} roughness={1} />
        </mesh>
      </group>

      {/* The pup, facing out toward the visitor */}
      <group position={[1.78, 0.11, 1.22]} rotation={[0, -1.2, 0]}>
        <mesh
          ref={bodyRef}
          position={[0, 0.18, 0]}
          scale={[1.15, 0.6, 0.78]}
          castShadow
        >
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshStandardMaterial color={MATERIALS.dog} roughness={0.95} />
        </mesh>
        {/* Front legs stretched forward */}
        <mesh position={[0.4, 0.06, 0.1]} castShadow>
          <boxGeometry args={[0.3, 0.09, 0.09]} />
          <meshStandardMaterial color={MATERIALS.dog} roughness={0.95} />
        </mesh>
        <mesh position={[0.4, 0.06, -0.1]} castShadow>
          <boxGeometry args={[0.3, 0.09, 0.09]} />
          <meshStandardMaterial color={MATERIALS.dog} roughness={0.95} />
        </mesh>
        {/* Head, held up and looking around */}
        <mesh position={[0.36, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.18, 18, 18]} />
          <meshStandardMaterial color={MATERIALS.dog} roughness={0.95} />
        </mesh>
        {/* Snout + nose */}
        <mesh position={[0.5, 0.37, 0]} scale={[1.3, 0.8, 0.9]} castShadow>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshStandardMaterial color={MATERIALS.dogDark} roughness={0.95} />
        </mesh>
        <mesh position={[0.6, 0.38, 0]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={MATERIALS.dogNose} roughness={0.6} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.47, 0.48, 0.075]}>
          <sphereGeometry args={[0.024, 8, 8]} />
          <meshStandardMaterial color={MATERIALS.dogNose} roughness={0.4} />
        </mesh>
        <mesh position={[0.47, 0.48, -0.075]}>
          <sphereGeometry args={[0.024, 8, 8]} />
          <meshStandardMaterial color={MATERIALS.dogNose} roughness={0.4} />
        </mesh>
        {/* Floppy ears */}
        <mesh
          position={[0.3, 0.5, 0.14]}
          scale={[0.5, 1.1, 0.7]}
          rotation={[0.25, 0, -0.15]}
          castShadow
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={MATERIALS.dogDark} roughness={0.95} />
        </mesh>
        <mesh
          position={[0.3, 0.5, -0.14]}
          scale={[0.5, 1.1, 0.7]}
          rotation={[-0.25, 0, -0.15]}
          castShadow
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={MATERIALS.dogDark} roughness={0.95} />
        </mesh>
        {/* Wagging tail */}
        <group ref={tailRef} position={[-0.32, 0.22, 0]}>
          <mesh position={[-0.13, 0.09, 0]} rotation={[0, 0, -0.85]} castShadow>
            <cylinderGeometry args={[0.03, 0.045, 0.34, 10]} />
            <meshStandardMaterial color={MATERIALS.dog} roughness={0.95} />
          </mesh>
        </group>
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
