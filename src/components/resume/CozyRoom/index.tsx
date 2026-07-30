import { useEffect, useState, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';

import type { WritingItem } from '@/blog/types';

import type { Theme } from '@/hooks/useTheme';

import { CameraRig } from './CameraRig';
import { INTRO_CAMERA_POSITION, SectionId, ViewId } from './hotspots';
import { PaletteProvider } from './livePalette';
import { Room } from './Room';
import { HtmlPortalProvider } from './SceneHtml';
import { bindSceneCursor, setSceneCursor } from './sceneCursor';

const BLEED_FADE = (bleed: number) =>
  `linear-gradient(to bottom, transparent 0, #000 ${bleed}px, #000 calc(100% - ${bleed}px), transparent 100%)`;

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
  // The canvas is drawn taller than the slot it appears to occupy, by this
  // many CSS pixels at the top and at the bottom, so a zoomed-in room spills
  // over the page instead of being sheared off at a hard edge
  bleed: number;
  // Pointer events are taken from this element instead of the canvas, which
  // keeps the copy the canvas now covers selectable and clickable
  eventSource: RefObject<HTMLElement | null>;
  // Where the scene's <Html> overlays — hotspot labels, section panels —
  // mount. It tracks the canvas box, not the slot, so they stay pinned to the
  // objects they label once the canvas starts overhanging
  htmlPortal: RefObject<HTMLElement | null>;
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
  bleed,
  eventSource,
  htmlPortal,
}: CozyRoomSceneProps) {
  const [hovered, setHovered] = useState<SectionId | null>(null);
  // The first frame lands mid-swoop; easing it in is kinder than a pop
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSceneCursor('locked', view !== 'overview');
  }, [view]);

  // The drag can end anywhere — outside the canvas, or on a window that
  // lost focus mid-gesture
  useEffect(() => {
    const release = () => setSceneCursor('drag', false);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, []);

  // r3f drops the canvas out of hit testing once it is fed from an
  // eventSource, so the cursor and the press that starts a drag belong on
  // that element rather than on the canvas
  useEffect(() => {
    const element = eventSource.current;
    if (!element) return;
    const grab = () => setSceneCursor('drag', true);
    bindSceneCursor(element);
    element.addEventListener('pointerdown', grab);
    return () => {
      element.removeEventListener('pointerdown', grab);
      bindSceneCursor(null);
    };
  }, [eventSource]);

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{
        position: INTRO_CAMERA_POSITION,
        fov: 38,
      }}
      // r3f types the ref as always-resolved. It is by the time this runs:
      // the hit element renders alongside the slot, and this scene is only
      // loaded (lazily, client-side) once that slot is on the page.
      eventSource={eventSource as RefObject<HTMLElement>}
      style={{
        // Overhang the slot on both edges. Symmetric, so the room stays
        // centred on the same point it would have been without the bleed.
        position: 'absolute',
        left: 0,
        right: 0,
        top: -bleed,
        bottom: -bleed,
        width: 'auto',
        height: 'auto',
        // The overhang is a soft edge, not a second hard one: the room is at
        // full strength everywhere inside the slot and dissolves across the
        // bleed, so a zoomed-in room runs out over the page rather than
        // stopping dead at a rectangle.
        maskImage: BLEED_FADE(bleed),
        WebkitMaskImage: BLEED_FADE(bleed),
        opacity: ready ? 1 : 0,
        transition: 'opacity 500ms ease-out',
      }}
      onCreated={(state) => {
        const { gl } = state;
        // Events arrive from the slot, which no longer shares an origin with
        // the canvas — so measure the pointer against the canvas itself
        state.setEvents({
          compute: (event, rootState) => {
            const rect = gl.domElement.getBoundingClientRect();
            rootState.pointer.set(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            rootState.raycaster.setFromCamera(
              rootState.pointer,
              rootState.camera,
            );
          },
        });
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onContextLost();
        });
        setReady(true);
      }}
      onPointerMissed={() => {
        if (view !== 'overview') onClose();
      }}
    >
      <HtmlPortalProvider value={htmlPortal}>
        <PaletteProvider theme={theme} reduceMotion={reduceMotion}>
          <CameraRig
            view={view}
            reduceMotion={reduceMotion}
            desktop={desktop}
            resetSignal={resetSignal}
            keyboardFocus={keyboardFocus}
            bleed={bleed}
          />
          <Room
            reduceMotion={reduceMotion}
            view={view}
            hovered={hovered}
            panel3d={desktop}
            writings={writings}
            bleed={bleed}
            onHover={setHovered}
            onSelect={onSelect}
            onClose={onClose}
            onCycleTheme={onCycleTheme}
          />
        </PaletteProvider>
      </HtmlPortalProvider>
    </Canvas>
  );
}

export default CozyRoomScene;
