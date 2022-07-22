import type { ParsedUrlQuery } from 'querystring';

export const getQueryParam = (
  query: ParsedUrlQuery,
  key: string,
): string | null => {
  const queryKey = query?.[key];

  if (Array.isArray(queryKey)) {
    return queryKey?.[0];
  }

  return queryKey || null;
};
