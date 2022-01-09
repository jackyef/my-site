import { Flipped } from 'react-flip-toolkit';

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
