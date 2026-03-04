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
      <PageHeader
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
        <TextLink className="text-[13px]" href="/blog">
          View all writings →
        </TextLink>
      </div>
    </div>
  );
}
