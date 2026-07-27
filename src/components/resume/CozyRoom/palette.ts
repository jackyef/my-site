import type { Theme } from '@/hooks/useTheme';

/**
 * Material + lighting palettes for the 3D room.
 *
 * Note: these hex values intentionally live outside globals.css — they are
 * three.js material/light colors (WebGL), not CSS, so design tokens can't
 * reach them. Keep every scene color in this file.
 */

export const MATERIALS = {
  floor: '#b98b64',
  rug: '#5f8f83',
  rugInner: '#7aa99c',
  wall: '#f0e0c8',
  wallTrim: '#e2cba9',
  woodDark: '#8a5a3b',
  wood: '#a9744f',
  woodLight: '#c9955f',
  metal: '#54524e',
  screenBezel: '#2c2c34',
  cork: '#c8a06a',
  paper: '#f7f2e7',
  leaf: '#5c8a4e',
  leafDark: '#48713d',
  pot: '#b35d3f',
  dog: '#c89e6a',
  dogDark: '#a87f52',
  dogNose: '#38302c',
  bed: '#8a6a4f',
  bedCushion: '#d9c2a3',
  curtain: '#b96a4b',
  clockFace: '#f7f2e7',
  mug: '#2c6464',
  lampShade: '#e8b46a',
  envelope: '#f3ede0',
  envelopeFlag: '#c25b4e',
  books: ['#c25b4e', '#5f8f83', '#e0a458', '#7d6b94', '#4a7fa5', '#a9744f'],
  pins: ['#c25b4e', '#4a7fa5', '#5c8a4e', '#e0a458'],
  screenCode: ['#7fd1c0', '#e0a458', '#c9d1d9', '#8aa9e8'],
} as const;

export type ScenePalette = {
  sky: string;
  ambientColor: string;
  ambientIntensity: number;
  sunColor: string;
  sunIntensity: number;
  // Where the sun/moon sits in the world, outside the window — the
  // directional light follows it, so shadows genuinely come from it
  sunPosition: [number, number, number];
  // The visible sun/moon disc in the window pane (window-local x/y)
  sunDisc: { x: number; y: number; scale: number; color: string };
  windowGlowColor: string;
  windowGlowIntensity: number;
  lampIntensity: number;
  screenIntensity: number;
  fairyIntensity: number;
};

export const SCENE_PALETTES: Record<Theme, ScenePalette> = {
  // Soft afternoon light — sun high in the sky
  light: {
    sky: '#bfe3f7',
    ambientColor: '#fff4e0',
    ambientIntensity: 1.0,
    sunColor: '#fff1cf',
    sunIntensity: 3.4,
    sunPosition: [-9, 9, -0.6],
    sunDisc: { x: -0.3, y: 0.45, scale: 0.7, color: '#fff3c4' },
    windowGlowColor: '#dff2ff',
    windowGlowIntensity: 6,
    lampIntensity: 4,
    screenIntensity: 0.75,
    fairyIntensity: 0.15,
  },
  // Golden-hour dusk — sun low, long warm shadows
  dim: {
    sky: '#f5a86f',
    ambientColor: '#ffd9b0',
    ambientIntensity: 0.62,
    sunColor: '#ffb066',
    sunIntensity: 2.4,
    sunPosition: [-10, 3.0, -2.6],
    sunDisc: { x: 0.12, y: -0.28, scale: 1.5, color: '#ff9d54' },
    windowGlowColor: '#ffc48a',
    windowGlowIntensity: 9,
    lampIntensity: 14,
    screenIntensity: 1.1,
    fairyIntensity: 1.0,
  },
  // Quiet night — moonlight, lamp and monitor take over
  dark: {
    sky: '#16213e',
    ambientColor: '#8899cc',
    ambientIntensity: 0.4,
    sunColor: '#9db4ff',
    sunIntensity: 1.0,
    sunPosition: [-9, 6.5, 0.3],
    sunDisc: { x: 0.3, y: 0.38, scale: 1.0, color: '#f4f0dc' },
    windowGlowColor: '#a9c0ff',
    windowGlowIntensity: 4,
    lampIntensity: 22,
    screenIntensity: 1.6,
    fairyIntensity: 1.6,
  },
};
