import { useState } from 'react';
import { Canvas } from '@react-three/fiber';

import type { WritingItem } from '@/blog/types';

import type { Theme } from '@/hooks/useTheme';

import { CameraRig } from './CameraRig';
import { INTRO_CAMERA_POSITION, SectionId, ViewId } from './hotspots';
import { Room } from './Room';
import { SCENE_PALETTES } from './palette';

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
};

export function CozyRoomScene({
  view,
  theme,
  reduceMotion,
  desktop,
  writings,
  onSelect,
  onClose,
}: CozyRoomSceneProps) {
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const palette = SCENE_PALETTES[theme ?? 'light'];

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
      <CameraRig view={view} reduceMotion={reduceMotion} desktop={desktop} />
      <Room
        palette={palette}
        reduceMotion={reduceMotion}
        view={view}
        hovered={hovered}
        panel3d={desktop}
        writings={writings}
        onHover={setHovered}
        onSelect={onSelect}
        onClose={onClose}
      />
    </Canvas>
  );
}

export default CozyRoomScene;
