import { useQuery } from 'react-query';

import { PageData } from '../../../../types/types';

const endpoint = '/api/search';

export const usePostSearch = (query: string) => {
  const finalUrl = `${endpoint}?q=${query}`;

  const { isLoading, isError, data, error, refetch } = useQuery<PageData[]>(
    finalUrl,
    () => {
      return fetch(finalUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }

          return res.json();
        })
        .then((json) => json.data)
        .catch(() => {
          throw new Error('Network error');
        });
    },
    {
      enabled: Boolean(query),
      staleTime: Infinity,
      keepPreviousData: true,
      retry: false,
    },
  );

  return {
    isLoading,
    isError,
    data: query && !isError ? data || [] : [],
    error,
    refetch,
  };
};
