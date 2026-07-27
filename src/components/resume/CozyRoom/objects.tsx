import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import { Group, Mesh } from 'three';

import { MATERIALS, ScenePalette } from './palette';
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
        <boxGeometry args={[7.2, 0.15, 7.2]} />
        <meshStandardMaterial color={MATERIALS.floor} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.7, -3.56]} receiveShadow>
        <boxGeometry args={[7.2, 3.4, 0.12]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>

      {/* Left wall, in segments around the window opening */}
      <mesh position={[-3.56, 1.7, -2.71]} receiveShadow>
        <boxGeometry args={[0.12, 3.4, 1.82]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.56, 1.7, 1.51]} receiveShadow>
        <boxGeometry args={[0.12, 3.4, 4.22]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.56, 3.1, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 0.6, 1.2]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.56, 0.7, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 1.4, 1.2]} />
        <meshStandardMaterial color={MATERIALS.wall} roughness={0.95} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.09, -3.49]}>
        <boxGeometry args={[7.2, 0.18, 0.04]} />
        <meshStandardMaterial color={MATERIALS.wallTrim} roughness={0.9} />
      </mesh>
      <mesh position={[-3.49, 0.09, 0]}>
        <boxGeometry args={[0.04, 0.18, 7.2]} />
        <meshStandardMaterial color={MATERIALS.wallTrim} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Rug() {
  return (
    <group position={[0.4, 0, 0.4]}>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.024, 48]} />
        <meshStandardMaterial color={MATERIALS.rug} roughness={1} />
      </mesh>
      <mesh position={[0, 0.026, 0]} receiveShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.01, 48]} />
        <meshStandardMaterial color={MATERIALS.rugInner} roughness={1} />
      </mesh>
    </group>
  );
}

export function Desk() {
  return (
    <group position={[0.6, 0, -2.65]}>
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
    <group position={[0.6, 0, -1.55]} rotation={[0, -0.35, 0]}>
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

export function Monitor({ palette }: { palette: ScenePalette }) {
  const bars = useMemo(
    () =>
      Array.from({ length: CODE_BAR_COUNT }, (_, i) => ({
        width: 0.14 + seeded(i, 2) * 0.5,
        indent: i % 3 === 1 ? 0.08 : i % 4 === 2 ? 0.16 : 0,
        color: MATERIALS.screenCode[i % MATERIALS.screenCode.length],
      })),
    [],
  );

  return (
    <group position={[0.6, 1.06, -2.95]}>
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
          color="#0d1a26"
          emissive="#14283d"
          emissiveIntensity={palette.screenIntensity}
          roughness={0.3}
        />
      </mesh>

      {/* Lines of "code" */}
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
          <meshBasicMaterial
            color={bar.color}
            transparent
            opacity={0.45 + palette.screenIntensity * 0.3}
          />
        </mesh>
      ))}

      {/* Screen glow */}
      <pointLight
        position={[0, 0.62, 0.6]}
        color="#7fd1c0"
        intensity={palette.screenIntensity * 1.6}
        distance={2.2}
      />
    </group>
  );
}

export function Keyboard() {
  return (
    <group position={[0.6, 1.06, -2.42]} rotation={[0, 0.04, 0]}>
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
    <group position={[1.55, 1.06, -2.4]}>
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

export function DeskLamp({ palette }: { palette: ScenePalette }) {
  return (
    <group position={[1.7, 1.06, -2.95]}>
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
          color={MATERIALS.lampShade}
          emissive={MATERIALS.lampShade}
          emissiveIntensity={palette.lampIntensity * 0.04}
          roughness={0.6}
        />
      </mesh>
      <pointLight
        position={[-0.28, 0.38, 0]}
        color="#ffc37a"
        intensity={palette.lampIntensity}
        distance={4.5}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  );
}

export function Envelopes() {
  return (
    <group position={[-0.5, 1.06, -2.6]}>
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
  { x: -0.48, y: 0.22, tilt: 0.08 },
  { x: 0.06, y: 0.28, tilt: -0.06 },
  { x: 0.52, y: 0.1, tilt: 0.05 },
  { x: -0.14, y: -0.26, tilt: -0.09 },
  { x: 0.4, y: -0.32, tilt: 0.07 },
];

export function Corkboard() {
  return (
    <group position={[2.2, 2.1, -3.47]}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.1, 0.05]} />
        <meshStandardMaterial color={MATERIALS.cork} roughness={0.95} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.58, 0.06, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.56, 0]}>
        <boxGeometry args={[1.58, 0.06, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[-0.77, 0, 0]}>
        <boxGeometry args={[0.06, 1.18, 0.07]} />
        <meshStandardMaterial color={MATERIALS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.77, 0, 0]}>
        <boxGeometry args={[0.06, 1.18, 0.07]} />
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

export function WallWindow({ palette }: { palette: ScenePalette }) {
  return (
    <group position={[-3.47, 2.1, -1.2]} rotation={[0, Math.PI / 2, 0]}>
      {/* Sky seen through the glass */}
      <mesh>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial color={palette.sky} />
      </mesh>
      {palette.moonVisible && (
        <mesh position={[0.3, 0.38, 0.005]}>
          <circleGeometry args={[0.13, 24]} />
          <meshBasicMaterial color="#f4f0dc" />
        </mesh>
      )}

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

      {/* Light spilling in from outside */}
      <pointLight
        position={[0, 0, 1.2]}
        color={palette.windowGlowColor}
        intensity={palette.windowGlowIntensity}
        distance={6}
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
    <group position={[-3.15, 0, 1.6]} rotation={[0, Math.PI / 2, 0]}>
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

export function Plant() {
  return (
    <group position={[-2.85, 0, -2.85]}>
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

export function Cat({ reduceMotion }: { reduceMotion: boolean }) {
  const bodyRef = useRef<Mesh>(null);

  useFrame((state) => {
    const body = bodyRef.current;
    if (!body || reduceMotion) return;
    // Slow, sleepy breathing
    body.scale.y = 0.55 + Math.sin(state.clock.getElapsedTime() * 1.4) * 0.02;
  });

  return (
    <group position={[1.3, 0.03, 0.5]} rotation={[0, -0.6, 0]}>
      {/* Curled-up body */}
      <mesh
        ref={bodyRef}
        position={[0, 0.14, 0]}
        scale={[1, 0.55, 0.85]}
        castShadow
      >
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color={MATERIALS.cat} roughness={0.95} />
      </mesh>
      {/* Head */}
      <mesh position={[0.24, 0.14, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color={MATERIALS.cat} roughness={0.95} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.2, 0.28, 0.05]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.05, 0.08, 4]} />
        <meshStandardMaterial color={MATERIALS.catEar} roughness={0.95} />
      </mesh>
      <mesh position={[0.32, 0.27, 0.13]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.05, 0.08, 4]} />
        <meshStandardMaterial color={MATERIALS.catEar} roughness={0.95} />
      </mesh>
      {/* Tail wrapped around */}
      <mesh position={[-0.1, 0.05, 0.16]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <torusGeometry args={[0.22, 0.045, 10, 24, Math.PI * 1.1]} />
        <meshStandardMaterial color={MATERIALS.catEar} roughness={0.95} />
      </mesh>
    </group>
  );
}

const DUST_COUNT = 60;

export function DustMotes({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = useRef<Group>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      array[i * 3] = (seeded(i, 7) - 0.5) * 5.5;
      array[i * 3 + 1] = 0.3 + seeded(i, 8) * 2.6;
      array[i * 3 + 2] = (seeded(i, 9) - 0.5) * 5.5;
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
