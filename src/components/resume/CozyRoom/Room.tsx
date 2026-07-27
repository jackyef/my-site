import { Html } from '@react-three/drei';
import { motion } from 'motion/react';

import { HOTSPOTS, SectionId, ViewId } from './hotspots';
import {
  Bookshelf,
  Cat,
  Chair,
  Corkboard,
  Desk,
  DeskLamp,
  DustMotes,
  Envelopes,
  HotspotGroup,
  IntroPop,
  Keyboard,
  Monitor,
  Mug,
  Plant,
  RoomShell,
  Rug,
  WallWindow,
} from './objects';
import type { ScenePalette } from './palette';

type RoomProps = {
  palette: ScenePalette;
  reduceMotion: boolean;
  view: ViewId;
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
};

export function Room({
  palette,
  reduceMotion,
  view,
  hovered,
  onHover,
  onSelect,
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
        position={[-7, 6, -0.5]}
        color={palette.sunColor}
        intensity={palette.sunIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
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
      <IntroPop delay={0.6} reduceMotion={reduceMotion}>
        <Mug reduceMotion={reduceMotion} />
      </IntroPop>
      <IntroPop delay={0.65} reduceMotion={reduceMotion}>
        <DeskLamp palette={palette} />
      </IntroPop>
      <IntroPop delay={0.6} reduceMotion={reduceMotion}>
        <Plant />
      </IntroPop>

      <HotspotGroup {...hotspotProps('projects', 0.5, [0.6, 1.6, -2.95])}>
        <Monitor palette={palette} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('career', 0.55, [2.2, 2.1, -3.44])}>
        <Corkboard />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('writing', 0.45, [-3.15, 1.15, 1.6])}>
        <Bookshelf />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('about', 0.8, [1.3, 0.2, 0.5])}>
        <Cat reduceMotion={reduceMotion} />
      </HotspotGroup>
      <HotspotGroup {...hotspotProps('contact', 0.7, [-0.5, 1.2, -2.6])}>
        <Envelopes />
      </HotspotGroup>

      <DustMotes reduceMotion={reduceMotion} />

      {view === 'overview' &&
        HOTSPOTS.map((hotspot, i) => (
          <group key={hotspot.id} position={hotspot.labelPosition}>
            <Html center distanceFactor={9} zIndexRange={[40, 0]}>
              <motion.button
                type="button"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 1.1 + i * 0.12 }}
                className="cursor-pointer whitespace-nowrap rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-3 py-1.5 text-[12px] font-medium text-(--color-ink-2) shadow-(--shadow-md) transition-colors hover:border-(--color-accent) hover:text-(--color-accent-text)"
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
