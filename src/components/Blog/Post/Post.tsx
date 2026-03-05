import { useRouter } from 'next/router';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { MDXProvider } from '@/components/common/MDX';
import { Post as PostType } from '@/blog/types';
import { TwitterShare } from '@/components/Social/TwitterShare';

import { useActiveHeading } from '@/hooks/useActiveHeading';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { formatPostDate } from '@/lib/datetime';

import { PostHeader } from './PostHeader';
import { TableOfContents } from './TableOfContents';

interface Props {
  post: PostType;
}

export default function Post({ post }: Props) {
  const router = useRouter();
  const fullUrl = `https://jackyef.com${router.pathname}`;
  const isBlogPost = router.pathname.startsWith('/posts/');
  const activeSlug = useActiveHeading(post.headings);

  const { metadata: meta } = post;

  return (
    <div className="flex items-start w-[1100px] max-w-full min-w-0 mx-auto">
      <main className="page-pad py-8 min-w-0 flex-1 max-w-[880px]">
        <article>
          <PageMetaTags
            title={meta.title}
            description={meta.description}
            image={createOgImageUrl(meta.ogImage)}
            readingTime={meta.readingTime}
            publishDate={formatPostDate(meta.date)}
          />
          <PostHeader meta={meta} />

          <div className="pb-16 xl:pb-20">
            <div className="prose max-w-none pb-8">
              <MDXProvider mdxSource={post.mdxSource} />
            </div>

            {isBlogPost && (
              <TwitterShare text={`${meta.title} ${fullUrl} via @jackyef__`}>
                Share on Twitter →
              </TwitterShare>
            )}
          </div>
        </article>
      </main>

      {isBlogPost && post.headings.length > 0 && (
        <aside className="hidden min-[1400px]:block w-52 shrink-0 pt-8 pl-4 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <TableOfContents headings={post.headings} activeSlug={activeSlug} />
        </aside>
      )}
    </div>
  );
}
