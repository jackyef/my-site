import { useQuery } from 'react-query';

interface Author {
  type: string;
  name: string;
  url: string;
  photo: string;
}

const endpoint = 'https://webmention.io/api/mentions.jf2?per-page=1000';


export const useWebmention = (url: string) => {
  const finalUrl = `${endpoint}&target=${url}`;

  const { isLoading, isError, data, error, refetch } = useQuery(finalUrl, () => {
    return fetch(finalUrl)
      .then((res) => res.json())
      .then((data) => {
        const likes: any[] = [];
        const discussions: any[] = [];
        const reposts: any[] = [];
        const authors: Map<string, Author> = new Map();

        if (data && data.children) {
          data.children.forEach((v: any) => {
            const wmProp = v?.['wm-property'];

            // someone liked a tweet with this url
            if (wmProp === 'like-of') likes.push(v);
            
            // someone replied to a tweet with this url
            // OR
            // when someone made their own tweet containing this url
            else if (wmProp === 'in-reply-to' || wmProp === 'mention-of')
              discussions.push(v);

            // retweets
            else if (wmProp === 'repost-of') reposts.push(v);

            if (v?.author?.url) {
              authors.set(v.author.url, v.author);
            }
          });
        }

        return {
          likes,
          discussions,
          reposts,
          authors: [...authors].map(([, value]) => value),
        }
      });
  }, {
    staleTime: Infinity,
  });

  return {
    isLoading,
    isError,
    data,
    error,
    refetch,
  };
};
