import tinytime from 'tinytime';
import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';
import { css } from 'goober';

import { InternalLink } from '@/components/Typography/InternalLink';
import { Tag } from '@/components/common/Tag';
import { SkipSSR } from '@/components/SkipSSR';
import { MDXProvider } from '@/components/common/MDX';
import { getHslaColor } from '@/lib/styles/colors';
import { Post } from '@/blog/types';

import { cn } from '@/utils/styles/classNames';
import { sendEventTracker } from '@/utils/analytics/tracker';

import { TreeList, TreeListItem } from './TreeList';

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}');

interface Props {
  posts?: Post[];
}

export const PostPreviewList = ({ posts = [] }: Props) => {
  const router = useRouter();

  return (
    <TreeList>
      {posts.map(({ link, mdxSource, metadata }) => {
        return (
          <TreeListItem key={link}>
            <article className="space-y-2 pl-4 md:pl-16">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Flipped
                      flipId={metadata.title}
                      spring="noWobble"
                      translate
                    >
                      <h2
                        className={cn(
                          'text-xl md:text-2xl font-heading leading-8 font-bold',
                        )}
                      >
                        <InternalLink
                          href={link}
                          className={cn(
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
                              label: metadata.title,
                            });
                          }}
                        >
                          {metadata.title}
                        </InternalLink>
                      </h2>
                    </Flipped>
                    <Flipped
                      flipId={`${metadata.title}-meta`}
                      spring="noWobble"
                    >
                      <div className="flex items-center flex-wrap">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-xs leading-6 font text-theme-subtitle">
                            <time dateTime={metadata.date}>
                              <SkipSSR fallback={metadata.date}>
                                {postDateTemplate.render(
                                  new Date(metadata.date),
                                )}
                              </SkipSSR>
                            </time>
                          </dd>
                        </dl>
                        <div className="mx-1">&middot;</div>
                        <dl className="mr-3">
                          <dt className="sr-only">Time to read</dt>
                          <dd className="text-xs leading-6 font text-theme-subtitle">
                            {metadata.readingTime} ☕
                          </dd>
                        </dl>
                        <dl>
                          <dt className="sr-only">Post category</dt>
                          <dd className="flex space-x-2 text-xs">
                            {metadata.tags.map((tag) => (
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
                    flipId={`${metadata.title}-excerpt`}
                    spring="noWobble"
                    translate
                  >
                    <div className="prose max-w-none text-theme-text">
                      <MDXProvider mdxSource={mdxSource} />
                    </div>
                  </Flipped>
                </div>
                <Flipped
                  flipId={`${metadata.title}-readmore`}
                  spring="noWobble"
                >
                  <div className="text-base leading-6 font-medium">
                    <InternalLink
                      href={link}
                      aria-label={`Read "${metadata.title}"`}
                      onClick={() => {
                        sendEventTracker({
                          name: 'click',
                          category: `${router.pathname} - post preview read more`,
                          label: metadata.title,
                        });
                      }}
                    >
                      Read more &rarr;
                    </InternalLink>
                  </div>
                </Flipped>
              </div>
            </article>
          </TreeListItem>
        );
      })}
    </TreeList>
  );
};
