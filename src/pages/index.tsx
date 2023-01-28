import { Flipped } from 'react-flip-toolkit';
import { GetStaticProps } from 'next/types';
import { useRouter } from 'next/router';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { LandingHero } from '@/components/Hero';
import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { Panel } from '@/components/common/Panel';
import { Paragraph } from '@/components/Typography/Paragraph';

type Props = {
  posts: Post[];
};

export default function Home({ posts }: Props) {
  const router = useRouter();
  const wasRedirected = router.query.status === 'redirected';

  return (
    <>
      <PageMetaTags />

      <section aria-label="hero section">
        {wasRedirected && (
          <Panel title="⚠ Notice" type="info">
            <Paragraph>
              Looks like you were redirected here!{' '}
              <a
                className="underline"
                href="#"
                onClick={() => window.history.back()}
              >
                Click here to go back.
              </a>
            </Paragraph>
          </Panel>
        )}
        <LandingHero />
      </section>

      <div className="my-16" />

      <section aria-label="latest writings">
        <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
          {(flippedProps: any) => (
            <SectionTitle {...flippedProps}>Latest writings ✍️</SectionTitle>
          )}
        </Flipped>

        <PostPreviewList posts={posts} />
      </section>
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
