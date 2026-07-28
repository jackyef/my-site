import { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { XIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { AmbientLight, DirectionalLight, Object3D } from 'three';

import type { WritingItem } from '@/blog/types';
import { Heading } from '@/components/common/Heading';

import { ResumeSectionContent, SECTION_TITLES } from '../sections';
import { CARE_ITEMS } from '../data';

import { aboutPanelAnchor } from './avatarState';
import { HOTSPOTS, PANEL_PLACEMENTS, SectionId, ViewId } from './hotspots';
import { useLivePalette } from './livePalette';
import {
  Avatar,
  Bookshelf,
  CareTable,
  Chair,
  Corkboard,
  CornerShelf,
  Desk,
  DeskFan,
  DeskLamp,
  DustMotes,
  Envelopes,
  FloorBooks,
  FloorCushion,
  GameController,
  HotspotGroup,
  IntroPop,
  Keyboard,
  LightShaft,
  MicArm,
  Monitor,
  MouseAndPad,
  Mug,
  Notebook,
  PcTower,
  PictureFrames,
  Plant,
  Poster,
  RoomShell,
  Rug,
  Speakers,
  StringLights,
  WallClock,
  WallWindow,
} from './objects';
type RoomProps = {
  reduceMotion: boolean;
  view: ViewId;
  hovered: SectionId | null;
  // Render section content as a panel inside the scene (desktop)
  panel3d: boolean;
  writings: WritingItem[];
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  onClose: () => void;
  onCycleTheme: () => void;
};

function ScenePanel({
  section,
  writings,
  onClose,
}: {
  section: SectionId;
  writings: WritingItem[];
  onClose: () => void;
}) {
  const placement = PANEL_PLACEMENTS[section];
  const camera = useThree((state) => state.camera);
  // He stops wherever he was, so About's panel is placed relative to him
  // at the moment it opens rather than at a fixed spot in the room
  const anchor = useMemo(
    () =>
      section === 'about'
        ? aboutPanelAnchor(camera.position).toArray()
        : placement.position,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <group position={anchor}>
      <Html center zIndexRange={[40, 0]}>
        {/* Single-element 3D tilt — browsers hit-test this correctly,
            unlike nested matrix3d chains */}
        <div
          style={{
            transform: `perspective(1100px) rotateY(${placement.tilt}deg)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 480, damping: 32 }}
            className="flex w-[360px] flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-panel) shadow-(--shadow-lg)"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-2">
              <Heading level={3} as="h2">
                {SECTION_TITLES[section]}
              </Heading>
              <button
                type="button"
                aria-label="Close panel"
                onClick={onClose}
                className="cursor-pointer rounded-full p-1.5 text-(--color-ink-3) transition-[color,background-color,transform] duration-150 hover:bg-(--color-bg-hover) hover:text-(--color-ink) active:scale-90"
              >
                <XIcon size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[380px] flex-1 overflow-y-auto px-5 pt-1 pb-5">
              <ResumeSectionContent section={section} writings={writings} />
            </div>
          </motion.div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Ambient + sun/moon lighting, eased toward the active theme every frame.
 * The directional light tracks the palette's sun position outside the
 * window and aims into the room, so shadows genuinely follow the light.
 */
function Lighting() {
  const live = useLivePalette();
  const ambientRef = useRef<AmbientLight>(null);
  const sunRef = useRef<DirectionalLight>(null);
  const sunTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(1.5, 0.2, 0.5);
    return target;
  }, []);

  useFrame(() => {
    const palette = live.current;
    const ambient = ambientRef.current;
    if (ambient) {
      ambient.color.copy(palette.ambientColor);
      ambient.intensity = palette.ambientIntensity;
    }
    const sun = sunRef.current;
    if (sun) {
      sun.color.copy(palette.sunColor);
      sun.intensity = palette.sunIntensity;
      sun.position.copy(palette.sunPosition);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1} />
      <directionalLight
        ref={sunRef}
        position={[-9, 9, -0.6]}
        target={sunTarget}
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.00005}
        shadow-normalBias={0.06}
      />
      <primitive object={sunTarget} />
    </>
  );
}

export function Room({
  reduceMotion,
  view,
  hovered,
  panel3d,
  writings,
  onHover,
  onSelect,
  onClose,
  onCycleTheme,
}: RoomProps) {
  const hotspotProps = (
    id: SectionId,
    introDelay: number,
    center: [number, number, number],
  ) => ({
    id,
    hovered: hovered === id,
    introDelay,
    center,
    reduceMotion,
    onHover,
    onSelect,
  });

  return (
    <>
      <Lighting />

      <RoomShell />
      <IntroPop delay={0.06} reduceMotion={reduceMotion}>
        <Rug />
      </IntroPop>
      <IntroPop delay={0.16} reduceMotion={reduceMotion}>
        <Desk />
      </IntroPop>
      <IntroPop delay={0.24} reduceMotion={reduceMotion}>
        <Chair />
      </IntroPop>
      <IntroPop delay={0.2} reduceMotion={reduceMotion}>
        <WallWindow reduceMotion={reduceMotion} />
      </IntroPop>
      <IntroPop delay={0.38} reduceMotion={reduceMotion}>
        <Keyboard />
      </IntroPop>
      <IntroPop delay={0.4} reduceMotion={reduceMotion}>
        <MouseAndPad />
      </IntroPop>
      <IntroPop delay={0.5} reduceMotion={reduceMotion}>
        <MicArm />
      </IntroPop>
      <IntroPop delay={0.44} reduceMotion={reduceMotion}>
        <Speakers />
      </IntroPop>
      <IntroPop delay={0.46} reduceMotion={reduceMotion}>
        <DeskFan />
      </IntroPop>
      <IntroPop delay={0.52} reduceMotion={reduceMotion}>
        <GameController />
      </IntroPop>
      <IntroPop delay={0.34} reduceMotion={reduceMotion}>
        <PcTower />
      </IntroPop>
      <IntroPop delay={0.4} reduceMotion={reduceMotion}>
        <CornerShelf />
      </IntroPop>
      <IntroPop delay={0.44} reduceMotion={reduceMotion}>
        <Notebook />
      </IntroPop>
      <IntroPop delay={0.42} reduceMotion={reduceMotion}>
        <Mug reduceMotion={reduceMotion} />
      </IntroPop>
      <IntroPop delay={0.46} reduceMotion={reduceMotion}>
        <DeskLamp onCycleTheme={onCycleTheme} />
      </IntroPop>
      <IntroPop delay={0.42} reduceMotion={reduceMotion}>
        <Plant />
      </IntroPop>
      <IntroPop delay={0.28} reduceMotion={reduceMotion}>
        <Poster />
      </IntroPop>
      <IntroPop delay={0.32} reduceMotion={reduceMotion}>
        <PictureFrames />
      </IntroPop>
      <IntroPop delay={0.36} reduceMotion={reduceMotion}>
        <WallClock />
      </IntroPop>
      <IntroPop delay={0.48} reduceMotion={reduceMotion}>
        <StringLights />
      </IntroPop>
      <IntroPop delay={0.46} reduceMotion={reduceMotion}>
        <FloorBooks />
      </IntroPop>
      <IntroPop delay={0.5} reduceMotion={reduceMotion}>
        <FloorCushion />
      </IntroPop>
      <IntroPop delay={0.56} reduceMotion={reduceMotion}>
        <CareTable items={CARE_ITEMS} />
      </IntroPop>

      <HotspotGroup {...hotspotProps('projects', 0.34, [1.3, 1.55, -3.55])}>
        <Monitor reduceMotion={reduceMotion} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('career', 0.38, [2.95, 2.2, -4.14])}>
        <Corkboard hovered={hovered === 'career'} reduceMotion={reduceMotion} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('writing', 0.3, [-3.8, 1.15, 1.5])}>
        <Bookshelf
          hovered={hovered === 'writing'}
          reduceMotion={reduceMotion}
        />
      </HotspotGroup>
      {/* He wanders on his own, so he carries his own hover/click
          handling and label rather than sitting in a static hotspot */}
      <Avatar
        hovered={hovered === 'about'}
        active={view === 'about'}
        showLabel={view === 'overview'}
        reduceMotion={reduceMotion}
        onHover={onHover}
        onSelect={onSelect}
      />
      <HotspotGroup {...hotspotProps('contact', 0.48, [-0.38, 1.15, -2.32])}>
        <Envelopes />
      </HotspotGroup>

      <LightShaft />
      <DustMotes reduceMotion={reduceMotion} />

      {panel3d && view !== 'overview' && (
        <ScenePanel
          key={view}
          section={view}
          writings={writings}
          onClose={onClose}
        />
      )}

      {view === 'overview' &&
        HOTSPOTS.filter((hotspot) => hotspot.id !== 'about').map(
          (hotspot, i) => (
            <group key={hotspot.id} position={hotspot.labelPosition}>
              <Html center distanceFactor={10} zIndexRange={[40, 0]}>
                <motion.button
                  type="button"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    // Delay only the entrance — hover/tap stay instant
                    transition: {
                      delay: reduceMotion ? 0 : 0.75 + i * 0.07,
                      duration: 0.25,
                      ease: 'easeOut',
                    },
                  }}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.04 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  className="cursor-pointer whitespace-nowrap rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-3 py-1.5 text-[12px] leading-none font-medium text-(--color-ink-2) shadow-(--shadow-md) transition-colors hover:border-(--color-accent) hover:text-(--color-accent-text)"
                  onMouseEnter={() => onHover(hotspot.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={(event) => {
                    // Keep the click from bubbling to the canvas container,
                    // where r3f would treat it as a "pointer missed" and
                    // immediately close the section again
                    event.stopPropagation();
                    onSelect(hotspot.id);
                  }}
                >
                  {hotspot.label}
                </motion.button>
              </Html>
            </group>
          ),
        )}
    </>
  );
}
