import type { GetStaticProps, NextPage } from 'next';

import { UnorderedList } from '@/components/common/List/UnorderedList';
import { Panel } from '@/components/common/Panel';
import { HorizontalDivider } from '@/components/Divider';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { InternalLink } from '@/components/Typography/InternalLink';
import { PageTitle } from '@/components/Typography/PageTitle';
import { Paragraph } from '@/components/Typography/Paragraph';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { SkipSSR } from '@/components/SkipSSR';
import { getAllThoughtPages } from '@/blog/getAllThoughtPages';
import { LightButton } from '@/components/common/Button/LightButton';

import { getRelativeTimeFromNow } from '@/utils/datetime/getRelativeTime';

type Thought = {
  title: string;
  href: string;
  lastUpdatedAt: string;
};

interface Props {
  thoughts: Thought[];
}

const ThoughtsIndexPage: NextPage<Props> = ({ thoughts }) => {
  return (
    <>
      <PageMetaTags
        title="Thoughts 💭"
        description="List of my thoughts on some topics"
        image="https://jackyef-og-img.vercel.app/**Thoughts%20%F0%9F%A4%94%F0%9F%92%AD**.png?fontSize=150px"
      />
      <PageTitle>
        Thoughts <EmojiSpan>💭</EmojiSpan>
      </PageTitle>

      <Paragraph>
        This page is home to my thoughts on some topics. The idea came one day
        when I felt like I was getting asked similar questions quite often.
        Instead of answering them with a similar answer everytime, why not
        compile them at one place so they can be easily discoverable and
        shareable?
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

      <Panel
        type="primary"
        title="Got topics you would like to hear my thought of?"
      >
        <Paragraph className="text-inherit">
          If you have some topics you would like to hear my thoughts of, feel
          free to submit an issue on the GitHub repository!
        </Paragraph>

        <div className="mx-auto mb-4">
          <ExternalLink
            isNotFancy
            href="https://github.com/jackyef/my-site/issues/new"
          >
            <LightButton variant="primary">Submit an issue</LightButton>
          </ExternalLink>
        </div>
      </Panel>

      <HorizontalDivider />

      <SectionTitle>Topics</SectionTitle>

      <div className="my-4">
        <UnorderedList>
          {thoughts.map((thought) => (
            <li key={thought.title}>
              <InternalLink
                className="hover:underline"
                isNotFancy
                href={thought.href}
              >
                {thought.title}
              </InternalLink>

              <span className="text-theme-subtitle text-sm italic ml-2">
                Last updated{' '}
                <SkipSSR fallback={thought.lastUpdatedAt}>
                  {getRelativeTimeFromNow(new Date(thought.lastUpdatedAt))}
                </SkipSSR>
              </span>
            </li>
          ))}
        </UnorderedList>

        <div className="my-4">
          <UnorderedList>
            {/* TODO: Write thoughts on these */}
            <li>
              Keeping up with new technology
              <span className="text-theme-subtitle text-sm italic ml-2">
                Upcoming...
              </span>
            </li>
            <li>
              Knowing how to write &apos;good&apos; code
              <span className="text-theme-subtitle text-sm italic ml-2">
                Upcoming...
              </span>
            </li>
          </UnorderedList>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const thoughtPosts = await getAllThoughtPages();

  return {
    props: {
      thoughts: thoughtPosts.map((thoughtPost) => ({
        href: thoughtPost.link,
        title: thoughtPost.module.meta.title.replace('Thoughts: ', ''),
        lastUpdatedAt: thoughtPost.module.meta.date,
      })),
    },
  };
};

export default ThoughtsIndexPage;
