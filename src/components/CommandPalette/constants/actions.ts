/**
 * We store all the possible actions that can be done entirely on the client side
 * via the Command Palette here.
 *
 * Actions such as searching for page will require a request to the server, so they
 * are not included here.
 */

import { matchSorter } from 'match-sorter';
import { NextRouter } from 'next/router';

export const QUERIES = [
  'Toggle dark/light theme',
  'Share this article',
] as const;

export const ACTIONS = ['TOGGLE_DARK_LIGHT_THEME', 'SHARE_ARTICLE'] as const;

export const DEFAULT_QUERIES = [...QUERIES];

export type Action = typeof ACTIONS[number];
export type Query = typeof QUERIES[number];

export const QUERIES_ACTIONS_MAP: Record<Query, Action> = {
  'Toggle dark/light theme': 'TOGGLE_DARK_LIGHT_THEME',
  'Share this article': 'SHARE_ARTICLE',
};

export const filterValidQueries = (
  query: string,
  router: NextRouter,
): Query[] => {
  const matched = matchSorter(QUERIES, query);

  const isPostPage = router.pathname.startsWith('/posts/');

  return isPostPage
    ? matched
    : matched.filter((q) => q !== 'Share this article');
};
