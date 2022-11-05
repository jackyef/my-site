import { useLayoutEffect, useEffect, Suspense } from 'react';
import { spring } from 'react-flip-toolkit';
import tinytime from 'tinytime';
import { useRouter } from 'next/router';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { HorizontalDivider } from '@/components/Divider';
import { LazyWebmentionWidget } from '@/components/Webmention/LazyWebmentionWidget';
import { IOWrapper } from '@/components/IntersectionObserver/Wrapper';
import { useShouldAnimateNavigation } from '@/contexts/navigation';
import { MDXProvider } from '@/components/common/MDX';
import { Post as PostType } from '@/blog/types';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

import { PostHeader } from './PostHeader';

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Props {
  post: PostType;
}

export default function Post({ post }: Props) {
  const router = useRouter();
  const fullUrl = `https://jackyef.com${router.pathname}`;
  const shouldAnimateNavigation = useShouldAnimateNavigation();
  const isBlogPost = router.pathname.startsWith('/posts/');

  const { metadata: meta } = post;

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
        image={createOgImageUrl(meta.ogImage)}
        readingTime={meta.readingTime}
        publishDate={postDateTemplate.render(new Date(meta.date))}
      />
      <PostHeader meta={meta} />

      <div className="pb-16 xl:pb-20">
        <div className="xl:pb-0 xl:col-span-3 xl:row-span-2">
          <div className="prose max-w-none pb-8">
            <MDXProvider mdxSource={post.mdxSource} />
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
      </div>
    </article>
  );
}
