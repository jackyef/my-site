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
  cat: '#4a4a58',
  catEar: '#3a3a46',
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
  windowGlowColor: string;
  windowGlowIntensity: number;
  lampIntensity: number;
  screenIntensity: number;
  moonVisible: boolean;
};

export const SCENE_PALETTES: Record<Theme, ScenePalette> = {
  // Soft afternoon light
  light: {
    sky: '#bfe3f7',
    ambientColor: '#fff4e0',
    ambientIntensity: 0.85,
    sunColor: '#fff1cf',
    sunIntensity: 2.6,
    windowGlowColor: '#dff2ff',
    windowGlowIntensity: 6,
    lampIntensity: 4,
    screenIntensity: 0.75,
    moonVisible: false,
  },
  // Golden-hour dusk
  dim: {
    sky: '#f5a86f',
    ambientColor: '#ffd9b0',
    ambientIntensity: 0.5,
    sunColor: '#ffb066',
    sunIntensity: 1.8,
    windowGlowColor: '#ffc48a',
    windowGlowIntensity: 9,
    lampIntensity: 14,
    screenIntensity: 1.1,
    moonVisible: false,
  },
  // Quiet night, lamp and monitor take over
  dark: {
    sky: '#16213e',
    ambientColor: '#8899cc',
    ambientIntensity: 0.32,
    sunColor: '#9db4ff',
    sunIntensity: 0.7,
    windowGlowColor: '#a9c0ff',
    windowGlowIntensity: 4,
    lampIntensity: 22,
    screenIntensity: 1.6,
    moonVisible: true,
  },
};
