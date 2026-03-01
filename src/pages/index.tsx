import Link from 'next/link';
import { GetStaticProps } from 'next/types';

import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { PostRow } from '@/components/Blog/PostRow';
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

      <div style={{ flex: 1 }}>
        <HeroSection />
        <WidgetGrid />

        {/* Recent posts */}
        <div className="latest-pad">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <p className="eyebrow">Latest writings</p>
            <Link
              href="/blog"
              style={{
                fontSize: 13,
                color: 'var(--color-accent-text)',
                textDecoration: 'none',
              }}
              className="hover:underline"
            >
              All posts →
            </Link>
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
