import tinytime from 'tinytime';
import { InternalLink } from '../components/Typography/InternalLink';
import { ExternalLink } from '../components/Typography/ExternalLink';
import { PageTitle } from '../components/Typography/PageTitle';
import { Paragraph } from '../components/Typography/Paragraph';
import { PageContainer } from '../components/Page/PageContainer';
import { HorizontalDivider } from '../components/Divider';
import getAllPostPreviews from '../blog/getAllPostPreviews';

const posts = getAllPostPreviews();

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}');

export default function Home() {
  return (
    <PageContainer>
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
      <ul className="divide-y divide-gray-200">
        {posts.map(({ link, module: { default: Component, meta } }) => {
          return (
            <li key={link} className="py-12">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500">
                    <time dateTime={meta.date}>
                      {postDateTemplate.render(new Date(meta.date))}
                    </time>
                  </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                  <div className="space-y-6">
                    <h2 className="text-2xl leading-8 font-bold tracking-tight">
                      <InternalLink href={link}>
                        <a className="text-gray-900">{meta.title}</a>
                      </InternalLink>
                    </h2>
                    <div className="prose max-w-none text-gray-500">
                      <Component />
                    </div>
                  </div>
                  <div className="text-base leading-6 font-medium">
                    <InternalLink
                      href={link}
                      aria-label={`Read "${meta.title}"`}
                    >
                      Read more &rarr;
                    </InternalLink>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
