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
    // 740px of column (a 636px measure once .post-pad's gutters are removed)
    // plus a 224px rail = 964px, which the 1024px track holds. Without the rail
    // the column simply centres inside the track.
    //
    // One width for everything in the post. The column used to be 784px and
    // the reading measure was pulled in separately with a `ch` cap on the text
    // elements, which left prose visibly narrower than the code blocks and
    // tables sitting beside it — two different right-hand edges down the same
    // article. Sizing the column instead puts every child on the same edge and
    // does the measure work in one place.
    //
    // 636px is the narrowest width at which all six reading pairings clear 75
    // characters a line — Public Sans binds, at 76.6; the default Source Sans
    // runs to 81.4. That is past the classic 75 ceiling on purpose: the
    // ceiling is there because long lines make the eye mis-land on the return
    // sweep, and the fix for that is leading, not width. These pairings run
    // 1.62-1.65 against the 1.4-1.5 the old advice assumes. The column this
    // replaced ran to 90 characters with the same leading.
    //
    // Measure it by paragraph height over line-height, not by counting a
    // Range's client rects — a range splits at every inline element boundary,
    // so any paragraph with a link or inline code reports phantom extra lines
    // and understates the measure by five or six characters.
    //
    // The width is also what decides whether the table of contents can sit
    // beside the article; see the rail's breakpoint below.
    <div className="flex items-start justify-center w-[1024px] max-w-full min-w-0 mx-auto">
      <main className="post-pad min-w-0 flex-1 max-w-[740px]">
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
        // 1184px viewport − 220px sidebar leaves 964px of content area, which
        // the 740px column and the 224px rail fill exactly. Below that the
        // rail would start eating into the measure, so it drops out instead.
        //
        // This number is not free to choose: it follows from the column, and
        // every 16px added there pushes it 16px up and takes the rail off a
        // screen size that had it. What it has to clear is the machines this
        // gets read on — at 100% zoom a 13" Retina MacBook Pro is 1280 CSS px,
        // a 13" M-series 1440, a 14" 1512, a 16" 1728. 1184 leaves the
        // narrowest of those 96px of slack for a window that isn't maximised.
        <aside className="hidden min-[1184px]:block w-52 shrink-0 pt-10 pb-10 pl-4 sticky top-0 max-h-dvh overflow-y-auto">
          <TableOfContents headings={post.headings} activeSlug={activeSlug} />
        </aside>
      )}
    </div>
  );
}
