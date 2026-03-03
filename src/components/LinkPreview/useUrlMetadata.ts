import { useQuery } from '@tanstack/react-query';

type UrlMetadata = {
  title: string;
  description: string;
  language: string;
  type: string;
  url: string;
  provider: string;
  author: string;
  published: string;
  twitter: string;
  image: string;
  icon: string;
};

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
      return json.metadata as UrlMetadata;
    },
    staleTime: Infinity, // Never stale, so always get data from cache
  });
};
