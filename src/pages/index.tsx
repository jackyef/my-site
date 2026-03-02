import { GetStaticProps } from 'next/types';

import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { PostRow } from '@/components/Blog/PostRow';
import { TextLink } from '@/components/common/TextLink';
import { HeroSection } from '@/components/home/HeroSection';
import { WidgetGrid } from '@/components/home/WidgetGrid';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

type Props = {
  posts: Post[];
};

export default function Home({ posts }: Props) {
  return (
    <>
      <PageMetaTags />

      <div className="flex-1">
        <HeroSection />
        <WidgetGrid />

        {/* Recent posts */}
        <div className="latest-pad">
          <div className="flex items-baseline justify-between mb-3">
            <p className="eyebrow">Latest writings</p>
            <TextLink href="/blog">All posts →</TextLink>
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
  return {
    props: {
      posts: await getPosts({ limit: 5, onlyPreview: true }),
    },
  };
};
