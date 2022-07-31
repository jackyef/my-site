import { useQuery } from 'react-query';

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

  return useQuery(apiUrl, () => {
    return fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        return json.metadata as UrlMetadata;
      });
  });
};
