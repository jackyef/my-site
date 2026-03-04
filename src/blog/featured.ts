import type { WritingItem } from './types';

const FEATURED_TITLES = [
  '1-billion row challenge with Node.js',
  'Web security implications of 3rd party resources',
  'Writing Your Own CSS-in-JS Library',
  'Building 60 FPS QR Scanner for the Mobile Web',
  'Getting Content Painted under 2 seconds on the Mobile Web',
];

export function getFeaturedWritings(allWritings: WritingItem[]): WritingItem[] {
  return FEATURED_TITLES.map((title) =>
    allWritings.find((w) => w.title.startsWith(title)),
  ).filter((w): w is WritingItem => w != null);
}
