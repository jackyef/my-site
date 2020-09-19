import { HorizontalDivider } from '../components/Divider';
import MediumList from '../components/Medium/List';
import { ExternalLink } from '../components/Typography/ExternalLink';
import { PageTitle } from '../components/Typography/PageTitle';
import { Paragraph } from '../components/Typography/Paragraph';
import { SectionTitle } from '../components/Typography/SectionTitle';

export default function About() {
  return (
    <>
      <PageTitle>About me</PageTitle>
      <Paragraph>
        I am a software engineer working on all-things-web. Currently I am
        working with JavaScript at{' '}
        <ExternalLink href="https://www.tokopedia.com">Tokopedia</ExternalLink>{' '}
        in the web platform team. I am currently based in Indonesia (🇮🇩) and
        working here as well, but hopefully I will be working remotely in the
        near future 👀
      </Paragraph>
      <HorizontalDivider />
      <SectionTitle>I write, kinda ✍️</SectionTitle>
      <Paragraph>
        I have always been a curious person. I love to learn things and
        understand how they work. Sometimes if I find the discovery interesting,
        I try to write an article about them to share them!
      </Paragraph>
      <Paragraph>
        I have mostly been writing on Medium, but I am currently thinking of
        publishing my writing on my own blog. If you are reading this right now,
        hopefully I have published some writings on this site by then!
      </Paragraph>
      <Paragraph>
        For now, here are some of my writings on Medium.
      </Paragraph>
      <MediumList />
      <HorizontalDivider />
    </>
  );
}
