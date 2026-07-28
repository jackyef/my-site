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
  // Incremented by the "Reset view" button
  resetSignal: number;
  // Focus lives inside the scene, so arrow keys may pan
  keyboardFocus: boolean;
  onSelect: (id: SectionId) => void;
  onClose: () => void;
  // Fired when the desk lamp is clicked — cycles the site theme
  onCycleTheme: () => void;
  // Fired if the browser drops the WebGL context (driver reset, low
  // memory, background tab reclaimed) so the page can fall back
  onContextLost: () => void;
  // False once the room has scrolled out of view — rendering stops
  // rather than burning GPU on pixels nobody is looking at
  active: boolean;
};

export function CozyRoomScene({
  view,
  theme,
  reduceMotion,
  desktop,
  writings,
  resetSignal,
  keyboardFocus,
  onSelect,
  onClose,
  onCycleTheme,
  onContextLost,
  active,
}: CozyRoomSceneProps) {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{
        position: INTRO_CAMERA_POSITION,
        fov: 38,
      }}
      style={{ touchAction: desktop ? 'none' : 'pan-y' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onContextLost();
        });
      }}
      onPointerMissed={() => {
        if (view !== 'overview') onClose();
      }}
    >
      <PaletteProvider theme={theme} reduceMotion={reduceMotion}>
        <CameraRig
          view={view}
          reduceMotion={reduceMotion}
          desktop={desktop}
          resetSignal={resetSignal}
          keyboardFocus={keyboardFocus}
        />
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
