import { UnorderedList } from '@/components/common/List/UnorderedList';
import { Panel } from '@/components/common/Panel';
import { HorizontalDivider } from '@/components/Divider';
import { SectionContainer } from '@/components/SectionContainer';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { InternalLink } from '@/components/Typography/InternalLink';
import { PageTitle } from '@/components/Typography/PageTitle';
import { Paragraph } from '@/components/Typography/Paragraph';
import { SectionTitle } from '@/components/Typography/SectionTitle';

const ThoughtsIndexPage = () => {
  return (
    <>
      <PageMetaTags
        title="Thoughts 🤔💭"
        description="List of my thoughts on some topics"
        image="https://jackyef-og-img.vercel.app/**Thoughts%20%F0%9F%A4%94%F0%9F%92%AD**.png?fontSize=150px"
      />
      <PageTitle>
        Thoughts <EmojiSpan>🤔💭</EmojiSpan>
      </PageTitle>

      <Paragraph>
        This page is home to my thoughts on some topics. The idea came one day
        when I felt like I was getting asked similar questions quite often.
        Instead of answering them with a similar answer everytime, why not
        compile them at one place so they can be easily discoverable and
        shareable? It&apos;s kinda like{' '}
        <ExternalLink href="https://reactjs.org/docs/error-decoder.html/?invariant=425">
          React error page
        </ExternalLink>
        , where you can find answer for specific invariant error code, but for
        topics instead!
      </Paragraph>

      <Paragraph></Paragraph>

      <Panel type="info" title="Disclaimer">
        <Paragraph className="text-inherit">
          I am a big believer of holding opinions loosely. Chances are my
          opinions on these topics will change as time passes, condition changes
          and/or I discover new information. When that happens, I might not
          always be able to keep my thoughts here up-to-date.
        </Paragraph>

        <Paragraph className="text-inherit">
          All of these are just one guy&apos;s opinions, very likely to be
          biased and influenced by my own personal experience. Which is to say
          the things I say here might not be really applicable to others. With
          that being said, I do hope my perspectives can be helpful to a subset
          of people. <EmojiSpan>😄</EmojiSpan>
        </Paragraph>
      </Panel>

      <HorizontalDivider />

      <SectionTitle>Topics</SectionTitle>

      <div className="my-4">
        <UnorderedList>
          <li>
            <InternalLink
              className="hover:underline"
              isNotFancy
              href="/thoughts/self-taught-first-job-in-tech"
            >
              I am self-taught. how do I land my first job in tech?
            </InternalLink>
          </li>
        </UnorderedList>
      </div>
    </>
  );
};

export default ThoughtsIndexPage;
