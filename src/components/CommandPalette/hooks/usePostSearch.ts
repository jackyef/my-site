import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { PageData } from '../../../../types/types';

const endpoint = '/api/search';

export const usePostSearch = (query: string) => {
  const finalUrl = `${endpoint}?q=${query}`;

  const { isPending, isError, data, error, refetch } = useQuery<PageData[]>({
    queryKey: [finalUrl],
    queryFn: () => {
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
    enabled: Boolean(query),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    isLoading: isPending,
    isError,
    data: query && !isError ? data || [] : [],
    error,
    refetch,
  };
};
