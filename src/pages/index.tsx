import { Flipped } from 'react-flip-toolkit';
import { GetServerSideProps } from 'next';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { LandingHero } from '@/components/Hero';

export default function Home() {
  return (
    <>
      <PageMetaTags />
      <LandingHero />

      <div className="my-16" />

      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps) => (
          <SectionTitle {...flippedProps}>Latest writings ✍️</SectionTitle>
        )}
      </Flipped>

      <PostPreviewList count={4} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  if (ctx.req.headers?.['user-agent']?.includes('Instagram')) {
    // When opened in the IG in-app browser, make it as if this page is sending
    // a file response to download. This will cause IG to defer to the external browser
    ctx.res.setHeader('Content-type', 'application/pdf');
    ctx.res.setHeader('Content-Disposition', 'inline');
  }

  return {
    props: {},
  };
};
