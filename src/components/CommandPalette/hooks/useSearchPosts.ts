import { useQuery } from 'react-query';

const endpoint = '/api/search';

export const useSearchPosts = (query: string) => {
  const finalUrl = `${endpoint}?q=${query}`;

  const { isLoading, isError, data, error, refetch } = useQuery(
    finalUrl,
    () => {
      return fetch(finalUrl).then((res) => res.json());
    },
    {
      enabled: Boolean(query),
      staleTime: Infinity,
    },
  );

  return {
    isLoading,
    isError,
    data,
    error,
    refetch,
  };
};
