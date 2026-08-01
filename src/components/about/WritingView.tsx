import { WritingItem } from '@/blog/types';
import { PostRow } from '@/components/Blog/PostRow';
import { PageHeader } from '@/components/common/PageHeader';
import { TextLink } from '@/components/common/TextLink';

interface WritingViewProps {
  featuredWritings: WritingItem[];
}

export function WritingView({ featuredWritings }: WritingViewProps) {
  return (
    <div className="page-pad">
      {/* h2, not h1: /about renders all four sections at once and
          scrolls between them, so only the bio at the top is the
          page heading. */}
      <PageHeader
        level={2}
        eyebrow="Writing"
        title={
          <>
            Featured <em>writings.</em>
          </>
        }
      />

      <div>
        {featuredWritings.map((item) => (
          <PostRow key={item.link} item={item} />
        ))}
      </div>

      <div className="mt-4">
        <TextLink standalone className="text-[13px]" href="/blog">
          View all writings →
        </TextLink>
      </div>
    </div>
  );
}
