import { useLayoutEffect, useEffect, Suspense } from 'react';
import { spring } from 'react-flip-toolkit';
import tinytime from 'tinytime';
import { useRouter } from 'next/router';

import { PostMeta } from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';
import { PageMetaTags, publicUrl } from '@/components/Seo/PageMetaTags';
import { HorizontalDivider } from '@/components/Divider';
import { LazyWebmentionWidget } from '@/components/Webmention/LazyWebmentionWidget';
import { IOWrapper } from '@/components/IntersectionObserver/Wrapper';
import { useShouldAnimateNavigation } from '@/contexts/navigation';
import { MDXProvider } from '@/components/common/MDX';

import { PostHeader } from './PostHeader';

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Props {
  meta: PostMeta;
  children?: React.ReactNode;
  posts: {
    title: string;
    link: string;
  }[];
}

export default function Post({ meta, children, posts }: Props) {
  const router = useRouter();
  const postIndex = posts.findIndex((post) => post.link === router.pathname);
  const previous = posts[postIndex + 1];
  const next = posts[postIndex - 1];
  const fullUrl = `${publicUrl}${router.pathname}`;
  const shouldAnimateNavigation = useShouldAnimateNavigation();
  const isBlogPost = router.pathname.startsWith('/posts/');

  useIsomorphicLayoutEffect(() => {
    const el = document.getElementById('restOfArticle');

    if (el && shouldAnimateNavigation) {
      el.style.opacity = '0';

      spring({
        config: 'noWobble',
        values: {
          translateY: [-15, 0],
          opacity: [0, 1],
        },
        // @ts-expect-error
        onUpdate: ({ translateY, opacity }) => {
          el.style.opacity = opacity;
          el.style.transform = `translateY(${translateY}px)`;
        },
        delay: 400,
      });
    }
  }, [shouldAnimateNavigation]);

  return (
    <article>
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        readingTime={meta.readingTime}
        publishDate={postDateTemplate.render(new Date(meta.date))}
      />
      <PostHeader meta={meta} />

      <div className="pb-16 xl:pb-20">
        <div className="xl:pb-0 xl:col-span-3 xl:row-span-2">
          <div className="prose max-w-none pb-8">
            <MDXProvider>{children}</MDXProvider>
          </div>

          <HorizontalDivider />

          {isBlogPost && (
            <IOWrapper>
              {(show) =>
                show ? (
                  <Suspense
                    fallback={
                      <h3 className="text-lg font-bold mb-2">Webmentions</h3>
                    }
                  >
                    <LazyWebmentionWidget url={fullUrl} meta={meta} />
                  </Suspense>
                ) : null
              }
            </IOWrapper>
          )}
        </div>
        {isBlogPost && (
          <footer className="text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2">
            {(next || previous) && (
              <div className="space-y-8 py-8">
                {next && (
                  <div>
                    <h2 className="text-xs tracking-wide uppercase text-theme-subtitle">
                      Next Article
                    </h2>
                    <div>
                      <InternalLink href={next.link}>{next.title}</InternalLink>
                    </div>
                  </div>
                )}
                {previous && (
                  <div>
                    <h2 className="text-xs tracking-wide uppercase text-theme-subtitle">
                      Previous Article
                    </h2>
                    <div>
                      <InternalLink href={previous.link}>
                        {previous.title}
                      </InternalLink>
                    </div>
                  </div>
                )}
              </div>
            )}
          </footer>
        )}
      </div>
    </article>
  );
}
