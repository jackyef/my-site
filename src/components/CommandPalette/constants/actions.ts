/**
 * We store all the possible actions that can be done entirely on the client side
 * via the Command Palette here.
 *
 * Actions such as searching for page will require a request to the server, so they
 * are not included here.
 */

export const QUERIES = ['Toggle dark/light theme'] as const;

export const ACTIONS = ['TOGGLE_DARK_LIGHT_THEME'] as const;

export type Action = typeof ACTIONS[number];
export type Query = typeof QUERIES[number];

export const QUERIES_ACTIONS_MAP: Record<Query, Action> = {
  'Toggle dark/light theme': 'TOGGLE_DARK_LIGHT_THEME',
};

export const filterValidQueries = (query: string): Query[] => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  return QUERIES.filter((q) =>
    words.every((word) => q.toLowerCase().includes(word)),
  );
};
