import { InternalLink } from '../components/Typography/InternalLink';
import { ExternalLink } from '../components/Typography/ExternalLink';
import { PageTitle } from '../components/Typography/PageTitle';
import { Paragraph } from '../components/Typography/Paragraph';
import { PageContainer } from '../components/Page/PageContainer';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { useRouter } from 'next/router';

import { sendEventTracker } from '@/utils/analytics/tracker';
import { WaveBackground } from '@/components/Background/WaveBackground';

export default function Home() {
  const router = useRouter();

  return (
    <PageContainer>
      <WaveBackground />
      <PageMetaTags />
      <PageTitle>Hi, I am Jacky! 👋</PageTitle>
      <Paragraph>
        I am a software engineer working with JavaScript and on all-things-web.
        I am currently taking a short break before continuing on to the next
        adventure. You might know me from my works with{' '}
        <ExternalLink href="https://www.tokopedia.com">Tokopedia</ExternalLink>.
        I previously worked in the web platform team there. I am currently based
        in Indonesia (🇮🇩).
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

      <SectionTitle>Latest writings ✍️</SectionTitle>
      <PostPreviewList />
    </PageContainer>
  );
}
