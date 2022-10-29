import fs from 'fs';
import path from 'path';

import { serialize } from 'next-mdx-remote/serialize';
import { Flipped } from 'react-flip-toolkit';
import { GetStaticProps } from 'next/types';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { LandingHero } from '@/components/Hero';
import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';

type Props = {
  posts: Post[];
};

export default function Home({ posts }: Props) {
  return (
    <>
      <PageMetaTags />
      <LandingHero />

      <div className="my-16" />

      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps: any) => (
          <SectionTitle {...flippedProps}>Latest writings ✍️</SectionTitle>
        )}
      </Flipped>

      <PostPreviewList posts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      posts: await getPosts({ limit: 3, onlyPreview: true }),
    },
  };
};
