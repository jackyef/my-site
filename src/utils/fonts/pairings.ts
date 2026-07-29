/**
 * The switchable type systems.
 *
 * Fraunces is the display face in all of them; what varies is the face that
 * carries the reading, and the mono that goes with it.
 *
 * `id` is the value stored in localStorage and stamped on <html> as
 * `data-type-pairing`. The CSS that each id selects — font variables plus the
 * optically matched body size — lives in the TYPE SYSTEM block of globals.css.
 *
 * Sizes there are optically matched rather than nominally matched: each face
 * was measured for x-height and sized to read at the same apparent scale, so
 * switching changes the typeface without changing how big the page feels.
 */

export type PairingId =
  | 'source-sans'
  | 'inter-tight'
  | 'public-sans'
  | 'plex-sans'
  | 'libre-franklin'
  | 'figtree'
  | 'epilogue';

export interface FontPairing {
  id: PairingId;
  /** Shown in the picker. */
  label: string;
  /** One-line character sketch, shown under the label. */
  description: string;
  /** The face's own CSS variable, so the picker can preview it in itself. */
  cssVar: string;
}

export const DEFAULT_PAIRING_ID: PairingId = 'source-sans';

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'source-sans',
    label: 'Source Sans 3',
    description: 'Built for reading',
    cssVar: '--font-source-sans',
  },
  {
    id: 'inter-tight',
    label: 'Inter Tight',
    description: 'Neutral and compact',
    cssVar: '--font-inter-tight',
  },
  {
    id: 'public-sans',
    label: 'Public Sans',
    description: 'Open and even',
    cssVar: '--font-public-sans',
  },
  {
    id: 'plex-sans',
    label: 'IBM Plex Sans',
    description: 'Matches the code blocks',
    cssVar: '--font-plex-sans',
  },
  {
    id: 'libre-franklin',
    label: 'Libre Franklin',
    description: 'Editorial grotesque',
    cssVar: '--font-libre-franklin',
  },
  {
    id: 'figtree',
    label: 'Figtree',
    description: 'Warm geometric',
    cssVar: '--font-figtree',
  },
  {
    id: 'epilogue',
    label: 'Epilogue',
    description: 'The original',
    cssVar: '--font-epilogue',
  },
];

export const PAIRING_IDS = FONT_PAIRINGS.map((p) => p.id);

export function isPairingId(value: unknown): value is PairingId {
  return typeof value === 'string' && PAIRING_IDS.includes(value as PairingId);
}

export function getPairing(id: PairingId | null): FontPairing {
  return (
    FONT_PAIRINGS.find((p) => p.id === id) ??
    FONT_PAIRINGS.find((p) => p.id === DEFAULT_PAIRING_ID)!
  );
}
