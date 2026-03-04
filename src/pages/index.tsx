import { GetStaticProps } from 'next/types';

import { WritingItem } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { getFeaturedWritings } from '@/blog/featured';
import { mergeWritings } from '@/blog/writings';
import { PostRow } from '@/components/Blog/PostRow';
import { TextLink } from '@/components/common/TextLink';
import { HeroSection } from '@/components/home/HeroSection';
import { BlogStats, WidgetGrid } from '@/components/home/WidgetGrid';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

type Props = {
  featuredWritings: WritingItem[];
  blogStats: BlogStats;
};

export default function Home({ featuredWritings, blogStats }: Props) {
  return (
    <>
      <PageMetaTags />

      <div className="flex-1">
        <HeroSection />

        {/* Featured writings */}
        <div className="latest-pad">
          <div className="flex items-baseline justify-between mb-3">
            <p className="eyebrow">Featured writings</p>
            <TextLink className="text-[13px]" href="/blog">
              All writings →
            </TextLink>
          </div>

          <div>
            {featuredWritings.map((item) => (
              <PostRow key={item.link} item={item} />
            ))}
          </div>
        </div>

        <WidgetGrid blogStats={blogStats} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = await getPosts({ onlyPreview: true });
  const allWritings = mergeWritings(allPosts);

  return {
    props: {
      featuredWritings: getFeaturedWritings(allWritings),
      blogStats: {
        postCount: allWritings.length,
      },
    },
  };
};
