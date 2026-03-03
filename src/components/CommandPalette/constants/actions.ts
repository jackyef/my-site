/**
 * We store all the possible actions that can be done entirely on the client side
 * via the Command Palette here.
 *
 * Actions such as searching for page will require a request to the server, so they
 * are not included here.
 */

import { NextRouter } from 'next/router';

export const QUERIES = [
  'Enable dark theme',
  'Enable dim theme',
  'Enable light theme',
  'Share this article',
] as const;

export const ACTIONS = [
  'ENABLE_DARK_THEME',
  'ENABLE_DIM_THEME',
  'ENABLE_LIGHT_THEME',
  'SHARE_ARTICLE',
] as const;

export const DEFAULT_QUERIES = [...QUERIES];

export type Action = (typeof ACTIONS)[number];
export type Query = (typeof QUERIES)[number];

export const QUERIES_ACTIONS_MAP: Record<Query, Action> = {
  'Enable dark theme': 'ENABLE_DARK_THEME',
  'Enable dim theme': 'ENABLE_DIM_THEME',
  'Enable light theme': 'ENABLE_LIGHT_THEME',
  'Share this article': 'SHARE_ARTICLE',
};

export const filterValidQueries = (
  query: string,
  router: NextRouter,
): Query[] => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  const filtered = QUERIES.filter((q) =>
    words.every((word) => q.toLowerCase().includes(word)),
  );

  const isPostPage = router.pathname.startsWith('/posts/');

  return isPostPage
    ? filtered
    : filtered.filter((q) => q !== 'Share this article');
};
