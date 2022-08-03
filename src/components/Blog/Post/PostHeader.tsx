import tinytime from 'tinytime';
import { Flipped } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { PageTitle } from '@/components/Typography/PageTitle';
import { PostMeta } from '@/blog/getAllPostPreviews';
import { Tag } from '@/components/common/Tag';
import { InternalLink } from '@/components/Typography/InternalLink';
import { SkipSSR } from '@/components/SkipSSR';

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');
const postDateTemplateXl = tinytime('{MMMM} {DD}, {YYYY}');

interface Props {
  meta: PostMeta;
}

export const PostHeader = ({ meta }: Props) => {
  const router = useRouter();

  const isBlogPost = router.pathname.startsWith('/posts/');

  return (
    <>
      <header>
        <div>
          <div>
            <Flipped flipId={meta.title} spring="noWobble" translate>
              {(flippedProps) => (
                <PageTitle {...flippedProps}>{meta.title}</PageTitle>
              )}
            </Flipped>
          </div>
          {isBlogPost && (
            <Flipped flipId={`${meta.title}-meta`} spring="noWobble" stagger>
              <dl className="mt-1">
                <div className="flex flex-row flex-wrap space-x-1 text-sm leading-6 text-theme-subtitle items-center">
                  <dt>Published on</dt>
                  <dd>
                    <time className="block md:hidden" dateTime={meta.date}>
                      <SkipSSR fallback={meta.date}>
                        {postDateTemplate.render(new Date(meta.date))}
                      </SkipSSR>
                    </time>
                    <time className="hidden md:block" dateTime={meta.date}>
                      <SkipSSR fallback={meta.date}>
                        {postDateTemplateXl.render(new Date(meta.date))}
                      </SkipSSR>
                    </time>
                  </dd>
                  <div className="mx-1">&middot;</div>
                  <dt className="sr-only">Time to read</dt>
                  <dd className="leading-6">{meta.readingTime} ☕</dd>
                  <div className="mr-2" />
                  <dt className="sr-only">Post category</dt>
                  <dd className="flex space-x-2">
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
                </div>
              </dl>
            </Flipped>
          )}
        </div>
      </header>

      <hr className="mx-6 xl:mx-8 border-gray-400 border-opacity-50 my-6" />
    </>
  );
};
