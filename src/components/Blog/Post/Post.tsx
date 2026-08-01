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
    // 760px of column (a 656px measure once .post-pad's gutters are removed)
    // plus a 224px rail = 984px, which the 1024px track holds. Without the rail
    // the column simply centres inside the track.
    //
    // One width for everything in the post. The column used to be 784px and
    // the reading measure was pulled in separately with a `ch` cap on the text
    // elements, which left prose visibly narrower than the code blocks and
    // tables sitting beside it — two different right-hand edges down the same
    // article. Sizing the column instead puts every child on the same edge and
    // does the measure work in one place. 656px reads at 75-80 characters
    // across the six reading fonts: over the 75 the classic band gives, but
    // that ceiling is about mis-landing the return sweep, and 1.62-1.65 leading
    // buys most of that back. The old 784px column ran to 83.
    <div className="flex items-start justify-center w-[1024px] max-w-full min-w-0 mx-auto">
      <main className="post-pad min-w-0 flex-1 max-w-[760px]">
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
        // 1216px viewport − 220px sidebar leaves 996px of content area, which
        // the 760px column and the 224px rail fit inside with 12px to spare.
        // Anything narrower and the rail would start eating into the measure,
        // so it drops out instead. The breakpoint moved up from 1200 when the
        // column widened; at 1200 the two together came to 984 against 980
        // available, and the column paid the 4px.
        <aside className="hidden min-[1216px]:block w-52 shrink-0 pt-10 pb-10 pl-4 sticky top-0 max-h-dvh overflow-y-auto">
          <TableOfContents headings={post.headings} activeSlug={activeSlug} />
        </aside>
      )}
    </div>
  );
}
