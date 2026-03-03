import { useQuery } from '@tanstack/react-query';
import type { MetaData } from 'metadata-scraper/lib/types';

export const useUrlMetadata = (url: string) => {
  const apiUrl = `/api/og?url=${encodeURIComponent(url)}`;

  return useQuery({
    queryKey: [apiUrl],
    queryFn: async () => {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.status}`);
      }
      const json = await res.json();
      return json.metadata as MetaData;
    },
    staleTime: Infinity, // Never stale, so always get data from cache
  });
};
