import tinytime from 'tinytime';
import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';
import clsx from 'clsx';
import { css } from 'goober';

import getAllPostPreviews, {
  getAllPostWithTags,
} from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';
import { Tag } from '@/components/common/Tag';
import { SkipSSR } from '@/components/SkipSSR';
import { MDXProvider } from '@/components/common/MDX';
import { getHslaColor } from '@/lib/styles/colors';

import { sendEventTracker } from '@/utils/analytics/tracker';

const posts = getAllPostPreviews();

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}');

interface Props {
  count?: number;
  tags?: string[];
}

export const PostPreviewList = ({ count = 0, tags = [] }: Props) => {
  const router = useRouter();
  let shownPosts = count ? posts.slice(0, count) : posts;

  if (tags.length > 0) {
    shownPosts = getAllPostWithTags(tags);
  }

  return (
    <ul className="divide-y divide-gray-400 divide-opacity-50">
      {shownPosts.map(({ link, module: { default: Component, meta } }) => {
        return (
          <li key={link} className="pb-4 pt-8">
            <article className="space-y-2">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Flipped flipId={meta.title} spring="noWobble" translate>
                      <h2 className="text-xl md:text-2xl leading-8 font-bold">
                        <InternalLink
                          href={link}
                          className={clsx(
                            'font-bold',
                            css`
                              & {
                                color: ${getHslaColor('heading')} !important;
                              }
                            `,
                          )}
                          onClick={() => {
                            sendEventTracker({
                              name: 'click',
                              category: `${router.pathname} - post preview title`,
                              label: meta.title,
                            });
                          }}
                        >
                          {meta.title}
                        </InternalLink>
                      </h2>
                    </Flipped>
                    <Flipped flipId={`${meta.title}-meta`} spring="noWobble">
                      <div className="flex items-center flex-wrap">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-xs leading-6 font text-theme-subtitle">
                            <time dateTime={meta.date}>
                              <SkipSSR fallback={meta.date}>
                                {postDateTemplate.render(new Date(meta.date))}
                              </SkipSSR>
                            </time>
                          </dd>
                        </dl>
                        <div className="mx-1">&middot;</div>
                        <dl className="mr-3">
                          <dt className="sr-only">Time to read</dt>
                          <dd className="text-xs leading-6 font text-theme-subtitle">
                            {meta.readingTime} ☕
                          </dd>
                        </dl>
                        <dl>
                          <dt className="sr-only">Post category</dt>
                          <dd className="flex space-x-2 text-xs">
                            {meta.tags.map((tag) => (
                              <Tag key={tag} variant="secondary">
                                <InternalLink
                                  className="hover:underline"
                                  href={`/blog?tags=${tag}`}
                                  isNotFancy
                                >
                                  {tag}
                                </InternalLink>
                              </Tag>
                            ))}
                          </dd>
                        </dl>
                      </div>
                    </Flipped>
                  </div>

                  <Flipped
                    flipId={`${meta.title}-excerpt`}
                    spring="noWobble"
                    translate
                  >
                    <div className="prose max-w-none text-theme-text">
                      <MDXProvider>
                        <Component />
                      </MDXProvider>
                    </div>
                  </Flipped>
                </div>
                <Flipped flipId={`${meta.title}-readmore`} spring="noWobble">
                  <div className="text-base leading-6 font-medium">
                    <InternalLink
                      href={link}
                      aria-label={`Read "${meta.title}"`}
                      onClick={() => {
                        sendEventTracker({
                          name: 'click',
                          category: `${router.pathname} - post preview read more`,
                          label: meta.title,
                        });
                      }}
                    >
                      Read more &rarr;
                    </InternalLink>
                  </div>
                </Flipped>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
};
