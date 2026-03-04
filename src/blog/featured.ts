import type { WritingItem } from './types';

const FEATURED_TITLES = [
  '1-billion row challenge with Node.js',
  'Getting Content Painted under 2 seconds on the Mobile Web',
  'Web security implications of 3rd party resources',
  'Writing Your Own CSS-in-JS Library',
  'Achieving 90+ Mobile Web Performance at Tokopedia',
  'Building 60 FPS QR Scanner for the Mobile Web',
];

export function getFeaturedWritings(allWritings: WritingItem[]): WritingItem[] {
  return FEATURED_TITLES.map((title) =>
    allWritings.find((w) => w.title.startsWith(title)),
  ).filter((w): w is WritingItem => w != null);
}
