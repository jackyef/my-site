import { useState } from 'react';
import { Canvas } from '@react-three/fiber';

import type { Theme } from '@/hooks/useTheme';

import { CameraRig } from './CameraRig';
import { INTRO_CAMERA_POSITION, SectionId, ViewId } from './hotspots';
import { Room } from './Room';
import { SCENE_PALETTES } from './palette';

type CozyRoomSceneProps = {
  view: ViewId;
  theme: Theme | null;
  reduceMotion: boolean;
  // True when the overlay panel sits beside the scene (desktop layout)
  panelOffset: boolean;
  onSelect: (id: SectionId) => void;
  onClose: () => void;
};

export function CozyRoomScene({
  view,
  theme,
  reduceMotion,
  panelOffset,
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
        fov: 35,
      }}
      onPointerMissed={() => {
        if (view !== 'overview') onClose();
      }}
    >
      <CameraRig
        view={view}
        reduceMotion={reduceMotion}
        panelOffset={panelOffset}
      />
      <Room
        palette={palette}
        reduceMotion={reduceMotion}
        view={view}
        hovered={hovered}
        onHover={setHovered}
        onSelect={onSelect}
      />
    </Canvas>
  );
}

export default CozyRoomScene;
