import tinytime from 'tinytime';
import { Flipped } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { PostMeta } from '@/blog/types';
import { Heading } from '@/components/common/Heading';
import { Chip } from '@/components/common/Chip';
import { Text } from '@/components/common/Text';
import { InternalLink } from '@/components/Typography/InternalLink';
import { SkipSSR } from '@/components/SkipSSR';

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');
const postDateTemplateXl = tinytime('{MMMM} {DD}, {YYYY}');

interface Props {
  meta: Exclude<PostMeta, 'ogImage'>;
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
              {(flippedProps: any) => (
                <Heading level={1} {...flippedProps}>
                  {meta.title}
                </Heading>
              )}
            </Flipped>
          </div>
          {isBlogPost && (
            <Flipped flipId={`${meta.title}-meta`} spring="noWobble" stagger>
              <dl className="mt-1">
                <Text
                  as="div"
                  variant="body-sm"
                  color="ink-3"
                  className="flex flex-row flex-wrap space-x-1 leading-6 items-center"
                >
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
                  <dd className="leading-6">{meta.readingTime}</dd>
                  <div className="mr-2" />
                  <dt className="sr-only">Post category</dt>
                  <dd className="flex space-x-2">
                    {meta.tags.map((tag) => (
                      <Chip key={tag} size="xs" variant="highlight">
                        <InternalLink
                          className="hover:underline"
                          href={`/blog?tags=${tag}`}
                          isNotFancy
                        >
                          {tag}
                        </InternalLink>
                      </Chip>
                    ))}
                  </dd>
                </Text>
              </dl>
            </Flipped>
          )}
        </div>
      </header>

      <div className="my-6" />
    </>
  );
};
