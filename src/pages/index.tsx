import { GetStaticProps } from 'next/types';

import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { PostRow } from '@/components/Blog/PostRow';
import { TextLink } from '@/components/common/TextLink';
import { HeroSection } from '@/components/home/HeroSection';
import { BlogStats, WidgetGrid } from '@/components/home/WidgetGrid';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

type Props = {
  posts: Post[];
  blogStats: BlogStats;
};

export default function Home({ posts, blogStats }: Props) {
  return (
    <>
      <PageMetaTags />

      <div className="flex-1">
        <HeroSection />
        <WidgetGrid blogStats={blogStats} />

        {/* Recent posts */}
        <div className="latest-pad">
          <div className="flex items-baseline justify-between mb-3">
            <p className="eyebrow">Latest writings</p>
            <TextLink className="text-[13px]" href="/blog">All posts →</TextLink>
          </div>

          <div>
            {posts.map((post) => (
              <PostRow key={post.link} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = await getPosts({ onlyPreview: true });

  return {
    props: {
      posts: allPosts.slice(0, 5),
      blogStats: {
        postCount: allPosts.length,
      },
    },
  };
};
