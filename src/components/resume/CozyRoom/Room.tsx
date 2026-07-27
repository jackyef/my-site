import { Html } from '@react-three/drei';
import { XIcon } from 'lucide-react';
import { motion } from 'motion/react';

import type { WritingItem } from '@/blog/types';
import { Heading } from '@/components/common/Heading';

import { ResumeSectionContent, SECTION_TITLES } from '../sections';

import { HOTSPOTS, PANEL_PLACEMENTS, SectionId, ViewId } from './hotspots';
import {
  Bookshelf,
  Chair,
  Corkboard,
  Desk,
  DeskLamp,
  Dog,
  DustMotes,
  Envelopes,
  FloorBooks,
  FloorCushion,
  HotspotGroup,
  IntroPop,
  Keyboard,
  Monitor,
  MouseAndPad,
  Mug,
  Notebook,
  PictureFrames,
  Plant,
  Poster,
  RoomShell,
  Rug,
  StringLights,
  WallClock,
  WallWindow,
} from './objects';
import type { ScenePalette } from './palette';

type RoomProps = {
  palette: ScenePalette;
  reduceMotion: boolean;
  view: ViewId;
  hovered: SectionId | null;
  // Render section content as a panel inside the scene (desktop)
  panel3d: boolean;
  writings: WritingItem[];
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  onClose: () => void;
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

  return (
    <group position={placement.position} rotation={placement.rotation}>
      <Html transform scale={placement.scale} zIndexRange={[40, 0]}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="flex w-[340px] flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-panel) shadow-(--shadow-lg)"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
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
              className="cursor-pointer rounded-full p-1.5 text-(--color-ink-3) transition-colors hover:bg-(--color-bg-hover) hover:text-(--color-ink)"
            >
              <XIcon size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="max-h-[380px] flex-1 overflow-y-auto px-5 pt-1 pb-5">
            <ResumeSectionContent section={section} writings={writings} />
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

export function Room({
  palette,
  reduceMotion,
  view,
  hovered,
  panel3d,
  writings,
  onHover,
  onSelect,
  onClose,
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
      <ambientLight
        color={palette.ambientColor}
        intensity={palette.ambientIntensity}
      />
      <directionalLight
        position={[-8, 7, -0.5]}
        color={palette.sunColor}
        intensity={palette.sunIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0004}
      />

      <RoomShell />
      <IntroPop delay={0.1} reduceMotion={reduceMotion}>
        <Rug />
      </IntroPop>
      <IntroPop delay={0.25} reduceMotion={reduceMotion}>
        <Desk />
      </IntroPop>
      <IntroPop delay={0.35} reduceMotion={reduceMotion}>
        <Chair />
      </IntroPop>
      <IntroPop delay={0.3} reduceMotion={reduceMotion}>
        <WallWindow palette={palette} />
      </IntroPop>
      <IntroPop delay={0.55} reduceMotion={reduceMotion}>
        <Keyboard />
      </IntroPop>
      <IntroPop delay={0.58} reduceMotion={reduceMotion}>
        <MouseAndPad />
      </IntroPop>
      <IntroPop delay={0.62} reduceMotion={reduceMotion}>
        <Notebook />
      </IntroPop>
      <IntroPop delay={0.6} reduceMotion={reduceMotion}>
        <Mug reduceMotion={reduceMotion} />
      </IntroPop>
      <IntroPop delay={0.65} reduceMotion={reduceMotion}>
        <DeskLamp palette={palette} />
      </IntroPop>
      <IntroPop delay={0.6} reduceMotion={reduceMotion}>
        <Plant />
      </IntroPop>
      <IntroPop delay={0.42} reduceMotion={reduceMotion}>
        <Poster />
      </IntroPop>
      <IntroPop delay={0.48} reduceMotion={reduceMotion}>
        <PictureFrames />
      </IntroPop>
      <IntroPop delay={0.52} reduceMotion={reduceMotion}>
        <WallClock />
      </IntroPop>
      <IntroPop delay={0.68} reduceMotion={reduceMotion}>
        <StringLights palette={palette} />
      </IntroPop>
      <IntroPop delay={0.66} reduceMotion={reduceMotion}>
        <FloorBooks />
      </IntroPop>
      <IntroPop delay={0.72} reduceMotion={reduceMotion}>
        <FloorCushion />
      </IntroPop>

      <HotspotGroup {...hotspotProps('projects', 0.5, [1.0, 1.6, -3.6])}>
        <Monitor palette={palette} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('career', 0.55, [2.95, 2.2, -4.14])}>
        <Corkboard />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('writing', 0.45, [-3.8, 1.15, 1.5])}>
        <Bookshelf />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('about', 0.8, [1.8, 0.35, 1.2])}>
        <Dog hovered={hovered === 'about'} reduceMotion={reduceMotion} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('contact', 0.7, [-0.05, 1.2, -3.2])}>
        <Envelopes />
      </HotspotGroup>

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
        HOTSPOTS.map((hotspot, i) => (
          <group key={hotspot.id} position={hotspot.labelPosition}>
            <Html center distanceFactor={10} zIndexRange={[40, 0]}>
              <motion.button
                type="button"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 1.1 + i * 0.12 }}
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
        ))}
    </>
  );
}
