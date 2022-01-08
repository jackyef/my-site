import { Flipped } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { InternalLink } from '@/components/Typography/InternalLink';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { PageTitle } from '@/components/Typography/PageTitle';
import { Paragraph } from '@/components/Typography/Paragraph';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { sendEventTracker } from '@/utils/analytics/tracker';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <PageMetaTags />
      <PageTitle>Hi, I am Jacky! 👋</PageTitle>
      <Paragraph>
        I am a software engineer working with JavaScript and on all-things-web.
        I am currently based in Jakarta, Indonesia (🇮🇩), working remotely at{' '}
        <ExternalLink href="https://www.stickermule.com">
          Sticker Mule
        </ExternalLink>
        . You might know me from my previous work with{' '}
        <ExternalLink href="https://www.tokopedia.com">
          Tokopedia&rsquo;s Web Platform team
        </ExternalLink>
        .
      </Paragraph>

      <Paragraph>
        <InternalLink
          href="/about"
          onClick={() => {
            sendEventTracker({
              name: 'click',
              category: `${router.pathname} - hero`,
              label: 'More about me &arr;',
            });
          }}
        >
          More about me &rarr;
        </InternalLink>
      </Paragraph>

      <Paragraph>
        <ExternalLink
          href="https://twitter.com/jackyef__"
          onClick={() => {
            sendEventTracker({
              name: 'click',
              category: `${router.pathname} - hero`,
              label: '@jackyef__ on Twitter',
            });
          }}
        >
          @jackyef__ on Twitter
        </ExternalLink>
      </Paragraph>

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
