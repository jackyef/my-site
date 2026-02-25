import { useQuery } from 'react-query';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { MDXProvider } from '@/components/common/MDX';
import type { PostMeta } from '@/blog/types';

interface PostData {
  metadata: PostMeta;
  mdxSource: MDXRemoteSerializeResult;
}

const fetchPost = async (slug: string): Promise<PostData> => {
  const res = await fetch(`/api/posts/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
};

interface Props {
  slug: string;
}

export const PostReaderScreen = ({ slug }: Props) => {
  const { data, isLoading, isError } = useQuery(
    ['bp-post', slug],
    () => fetchPost(slug),
    { staleTime: 10 * 60 * 1000 },
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 flex-1">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-2/3 mb-3" />
          <div className="h-4 bg-white/5 rounded w-1/3 mb-8" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 bg-white/5 rounded mb-2 ${
                i % 3 === 2 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40">Failed to load post. Please try again.</p>
      </div>
    );
  }

  const { metadata, mdxSource } = data;

  return (
    <div className="flex flex-col gap-4 p-6 flex-1 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
          {metadata.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <span>
            {new Date(metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>·</span>
          <span>{metadata.readingTime}</span>
          {metadata.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" data-bp-scrollable>
        <div
          className="prose prose-invert prose-sm lg:prose-base max-w-none pb-16"
          style={
            {
              '--tw-prose-body': 'rgba(255,255,255,0.75)',
              '--tw-prose-headings': '#fff',
              '--tw-prose-links': '#06b6d4',
              '--tw-prose-code': '#e2e8f0',
              '--tw-prose-pre-bg': 'rgba(255,255,255,0.05)',
            } as React.CSSProperties
          }
        >
          <MDXProvider mdxSource={mdxSource} />
        </div>
      </div>
    </div>
  );
};
