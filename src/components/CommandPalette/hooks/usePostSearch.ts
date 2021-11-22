import { useQuery } from 'react-query';
import { PageData } from '../../../../types/types';

const endpoint = '/api/search';

export const usePostSearch = (query: string) => {
  const finalUrl = `${endpoint}?q=${query}`;

  const { isLoading, isError, data, error, refetch } = useQuery<PageData[]>(
    finalUrl,
    () => {
      return fetch(finalUrl)
        .then((res) => res.json())
        .then((json) => json.data);
    },
    {
      enabled: Boolean(query),
      staleTime: Infinity,
    },
  );

  return {
    isLoading,
    isError,
    data: data || [],
    error,
    refetch,
  };
};
