/**
 * We store all the possible actions that can be done entirely on the client side
 * via the Command Palette here.
 *
 * Actions such as searching for page will require a request to the server, so they
 * are not included here.
 */

import { NextRouter } from 'next/router';

import { FONT_PAIRINGS, type PairingId } from '@/utils/fonts';

export const QUERIES = [
  'Enable dark theme',
  'Enable dim theme',
  'Enable light theme',
  'Share this article',
  'Use Source Sans 3 font',
  'Use Inter Tight font',
  'Use Public Sans font',
  'Use IBM Plex Sans font',
  'Use Libre Franklin font',
  'Use Figtree font',
  'Use Epilogue font',
] as const;

export const ACTIONS = [
  'ENABLE_DARK_THEME',
  'ENABLE_DIM_THEME',
  'ENABLE_LIGHT_THEME',
  'SHARE_ARTICLE',
  'SET_FONT',
] as const;

/**
 * Shown when the palette is opened with an empty query. The font actions are
 * deliberately left out so the resting list stays short — they surface as soon
 * as someone types "font", or the name of a face.
 */
export const DEFAULT_QUERIES: Query[] = [
  'Enable dark theme',
  'Enable dim theme',
  'Enable light theme',
  'Share this article',
];

export type Action = (typeof ACTIONS)[number];
export type Query = (typeof QUERIES)[number];

/** `Use <label> font` → the pairing it selects. */
export const FONT_QUERIES_MAP = Object.fromEntries(
  FONT_PAIRINGS.map((p) => [`Use ${p.label} font`, p.id]),
) as Record<string, PairingId | undefined>;

export const QUERIES_ACTIONS_MAP: Record<Query, Action> = {
  'Enable dark theme': 'ENABLE_DARK_THEME',
  'Enable dim theme': 'ENABLE_DIM_THEME',
  'Enable light theme': 'ENABLE_LIGHT_THEME',
  'Share this article': 'SHARE_ARTICLE',
  'Use Source Sans 3 font': 'SET_FONT',
  'Use Inter Tight font': 'SET_FONT',
  'Use Public Sans font': 'SET_FONT',
  'Use IBM Plex Sans font': 'SET_FONT',
  'Use Libre Franklin font': 'SET_FONT',
  'Use Figtree font': 'SET_FONT',
  'Use Epilogue font': 'SET_FONT',
};

export const filterValidQueries = (
  query: string,
  router: NextRouter,
): Query[] => {
  const isPostPage = router.pathname.startsWith('/posts/');
  const trimmed = query.trim();

  const pool: readonly Query[] = trimmed === '' ? DEFAULT_QUERIES : QUERIES;

  const words = query.split(' ').map((word) => word.toLowerCase());

  const filtered = pool.filter((q) =>
    words.every((word) => q.toLowerCase().includes(word)),
  );

  return isPostPage
    ? filtered
    : filtered.filter((q) => q !== 'Share this article');
};
