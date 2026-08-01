import { useRouter } from 'next/router';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { MDXProvider } from '@/components/common/MDX';
import { Post as PostType } from '@/blog/types';
import { TwitterShare } from '@/components/Social/TwitterShare';
import { formatPostDate } from '@/lib/datetime';

import { useActiveHeading } from '@/hooks/useActiveHeading';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

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
    // 680px of column (a 576px measure once .post-pad's gutters are removed)
    // plus a 224px rail = 904px, which the 1024px track holds with room to
    // spare. Without the rail the column simply centres inside the track.
    //
    // One width for everything in the post. The column used to be 784px and
    // the reading measure was pulled in separately with a `ch` cap on the text
    // elements, which left prose visibly narrower than the code blocks and
    // tables sitting beside it — two different right-hand edges down the same
    // article. Narrowing the column instead puts every child on the same edge
    // and does the measure work in one place: 576px reads at 65-73 characters
    // across all six reading fonts, comfortably inside the 45-75 band.
    <div className="flex items-start justify-center w-[1024px] max-w-full min-w-0 mx-auto">
      <main className="post-pad min-w-0 flex-1 max-w-[680px]">
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
        // 1200px viewport − 220px sidebar leaves 980px of content area, enough
        // for the rail and a 650px-odd measure. Anything narrower and the
        // column gets cramped, so the rail drops out instead.
        <aside className="hidden min-[1200px]:block w-52 shrink-0 pt-10 pb-10 pl-4 sticky top-0 max-h-dvh overflow-y-auto">
          <TableOfContents headings={post.headings} activeSlug={activeSlug} />
        </aside>
      )}
    </div>
  );
}
