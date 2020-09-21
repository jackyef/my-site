import { InternalLink } from '../components/Typography/InternalLink';
import { ExternalLink } from '../components/Typography/ExternalLink';
import { PageTitle } from '../components/Typography/PageTitle';
import { Paragraph } from '../components/Typography/Paragraph';
import { PageContainer } from '../components/Page/PageContainer';
import { HorizontalDivider } from '../components/Divider';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { SectionTitle } from '@/components/Typography/SectionTitle';

export default function Home() {
  return (
    <PageContainer>
      <PageMetaTags />
      <PageTitle>Hi, I am Jacky! 👋</PageTitle>
      <Paragraph>
        I am a software engineer working on all-things-web. Currently I am
        working with JavaScript at{' '}
        <ExternalLink href="https://www.tokopedia.com">Tokopedia</ExternalLink>{' '}
        in the web platform team. I am currently based in Indonesia (🇮🇩) and
        working here as well.
      </Paragraph>

      <Paragraph>
        <InternalLink href="/about">More about me &rarr;</InternalLink>
      </Paragraph>

      <Paragraph>
        <ExternalLink href="https://twitter.com/jackyef__">
          @jackyef__ on Twitter
        </ExternalLink>
      </Paragraph>
      <HorizontalDivider />

      <SectionTitle>
        Latest writings ✍️
      </SectionTitle>
      <PostPreviewList />
    </PageContainer>
  );
}
