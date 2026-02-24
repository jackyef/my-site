import { motion } from 'framer-motion';
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

const rowVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.165, 0.84, 0.44, 1] },
  },
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
      <div className="flex flex-col gap-6 flex-1 overflow-hidden">
        <div className="shrink-0">
          <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
          <p className="text-white/50">Loading posts…</p>
        </div>
        <div
          className="flex flex-row gap-5 flex-1 min-h-0 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 animate-pulse w-[260px] flex-shrink-0 h-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !posts) {
    return (
      <div className="flex flex-col gap-6 flex-1 overflow-hidden">
        <div className="shrink-0">
          <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
          <p className="text-white/40">
            Failed to load posts. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">Blog</h1>
        <p className="text-white/50">{posts.length} articles</p>
      </div>

      <motion.div
        className="flex flex-row gap-5 flex-1 min-h-0 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
        variants={prefersReducedMotion ? undefined : rowVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
      >
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="h-full w-[260px] flex-shrink-0"
          >
            <PostCard
              title={post.title}
              description={post.description}
              date={post.date}
              readingTime={post.readingTime}
              tags={post.tags}
              onClick={() => push({ id: 'post', slug: post.slug })}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
