import { useState } from 'react';
import { Canvas } from '@react-three/fiber';

import type { WritingItem } from '@/blog/types';

import type { Theme } from '@/hooks/useTheme';

import { CameraRig } from './CameraRig';
import { INTRO_CAMERA_POSITION, SectionId, ViewId } from './hotspots';
import { PaletteProvider } from './livePalette';
import { Room } from './Room';

type CozyRoomSceneProps = {
  view: ViewId;
  theme: Theme | null;
  reduceMotion: boolean;
  // Desktop: orbit controls + in-scene 3D content panels.
  // Mobile: page-scroll-friendly touch, content in a bottom sheet.
  desktop: boolean;
  writings: WritingItem[];
  onSelect: (id: SectionId) => void;
  onClose: () => void;
  // Fired when the desk lamp is clicked — cycles the site theme
  onCycleTheme: () => void;
};

export function CozyRoomScene({
  view,
  theme,
  reduceMotion,
  desktop,
  writings,
  onSelect,
  onClose,
  onCycleTheme,
}: CozyRoomSceneProps) {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{
        position: INTRO_CAMERA_POSITION,
        fov: 38,
      }}
      style={{ touchAction: desktop ? 'none' : 'pan-y' }}
      onPointerMissed={() => {
        if (view !== 'overview') onClose();
      }}
    >
      <PaletteProvider theme={theme} reduceMotion={reduceMotion}>
        <CameraRig view={view} reduceMotion={reduceMotion} desktop={desktop} />
        <Room
          reduceMotion={reduceMotion}
          view={view}
          hovered={hovered}
          panel3d={desktop}
          writings={writings}
          onHover={setHovered}
          onSelect={onSelect}
          onClose={onClose}
          onCycleTheme={onCycleTheme}
        />
      </PaletteProvider>
    </Canvas>
  );
}

export default CozyRoomScene;
