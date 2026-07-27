import { createContext, useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Vector3 } from 'three';

import type { Theme } from '@/hooks/useTheme';

import { SCENE_PALETTES, ScenePalette } from './palette';

/**
 * The palette as mutable three.js values, eased toward the active theme
 * every frame — so switching themes animates the whole room: the sun
 * slides in the window, shadows sweep, lamps fade up.
 */
export type LivePalette = {
  sky: Color;
  ambientColor: Color;
  ambientIntensity: number;
  sunColor: Color;
  sunIntensity: number;
  sunPosition: Vector3;
  discX: number;
  discY: number;
  discScale: number;
  discColor: Color;
  windowGlowColor: Color;
  windowGlowIntensity: number;
  lampIntensity: number;
  screenIntensity: number;
  fairyIntensity: number;
};

const toLive = (palette: ScenePalette): LivePalette => ({
  sky: new Color(palette.sky),
  ambientColor: new Color(palette.ambientColor),
  ambientIntensity: palette.ambientIntensity,
  sunColor: new Color(palette.sunColor),
  sunIntensity: palette.sunIntensity,
  sunPosition: new Vector3(...palette.sunPosition),
  discX: palette.sunDisc.x,
  discY: palette.sunDisc.y,
  discScale: palette.sunDisc.scale,
  discColor: new Color(palette.sunDisc.color),
  windowGlowColor: new Color(palette.windowGlowColor),
  windowGlowIntensity: palette.windowGlowIntensity,
  lampIntensity: palette.lampIntensity,
  screenIntensity: palette.screenIntensity,
  fairyIntensity: palette.fairyIntensity,
});

const TARGETS: Record<Theme, LivePalette> = {
  light: toLive(SCENE_PALETTES.light),
  dim: toLive(SCENE_PALETTES.dim),
  dark: toLive(SCENE_PALETTES.dark),
};

const PaletteContext = createContext<React.RefObject<LivePalette>>({
  current: toLive(SCENE_PALETTES.light),
});

type PaletteProviderProps = {
  theme: Theme | null;
  reduceMotion: boolean;
  children: React.ReactNode;
};

export function PaletteProvider({
  theme,
  reduceMotion,
  children,
}: PaletteProviderProps) {
  const live = useRef<LivePalette>(toLive(SCENE_PALETTES[theme ?? 'light']));

  // Runs before consumers (priority -10) so they read this frame's values
  useFrame((_, delta) => {
    const target = TARGETS[theme ?? 'light'];
    const current = live.current;
    const alpha = reduceMotion
      ? 1
      : 1 - Math.exp(-2.6 * Math.min(delta, 0.066));

    current.sky.lerp(target.sky, alpha);
    current.ambientColor.lerp(target.ambientColor, alpha);
    current.sunColor.lerp(target.sunColor, alpha);
    current.discColor.lerp(target.discColor, alpha);
    current.windowGlowColor.lerp(target.windowGlowColor, alpha);
    current.sunPosition.lerp(target.sunPosition, alpha);

    current.ambientIntensity +=
      (target.ambientIntensity - current.ambientIntensity) * alpha;
    current.sunIntensity +=
      (target.sunIntensity - current.sunIntensity) * alpha;
    current.discX += (target.discX - current.discX) * alpha;
    current.discY += (target.discY - current.discY) * alpha;
    current.discScale += (target.discScale - current.discScale) * alpha;
    current.windowGlowIntensity +=
      (target.windowGlowIntensity - current.windowGlowIntensity) * alpha;
    current.lampIntensity +=
      (target.lampIntensity - current.lampIntensity) * alpha;
    current.screenIntensity +=
      (target.screenIntensity - current.screenIntensity) * alpha;
    current.fairyIntensity +=
      (target.fairyIntensity - current.fairyIntensity) * alpha;
  }, -10);

  return (
    <PaletteContext.Provider value={live}>{children}</PaletteContext.Provider>
  );
}

export const useLivePalette = () => useContext(PaletteContext);
