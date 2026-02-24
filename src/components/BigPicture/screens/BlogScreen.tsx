import { useQuery } from 'react-query';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import { useBigPictureContext } from '../hooks/useBigPictureContext';
import { PostCard } from '../components/PostCard';

interface PostListItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
}

const fetchPosts = async (): Promise<PostListItem[]> => {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data.posts;
};

export const BlogScreen = () => {
  const { push } = useBigPictureContext();
  const prefersReducedMotion = useReduceMotion();

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery('bp-posts', fetchPosts, {
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
          <p className="text-white/50">Loading posts…</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 animate-pulse min-h-[180px]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !posts) {
    return (
      <div className="flex flex-col gap-4 flex-1">
        <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
        <p className="text-white/40">Failed to load posts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
        <p className="text-white/50">{posts.length} articles</p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1"
        data-bp-scrollable
      >
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            readingTime={post.readingTime}
            tags={post.tags}
            onClick={() => push({ id: 'post', slug: post.slug })}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
};
