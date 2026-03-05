import { Flipped } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { PostMeta } from '@/blog/types';
import { Heading } from '@/components/common/Heading';
import { Chip } from '@/components/common/Chip';
import { InternalLink } from '@/components/Typography/InternalLink';

import { formatPostDate } from '@/lib/datetime';

interface Props {
  meta: Exclude<PostMeta, 'ogImage'>;
}

export const PostHeader = ({ meta }: Props) => {
  const router = useRouter();
  const isBlogPost = router.pathname.startsWith('/posts/');

  return (
    <header className="mb-8">
      {isBlogPost && (
        <Flipped flipId={`${meta.title}-meta`} spring="noWobble" stagger>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="eyebrow">
              {formatPostDate(meta.date, true)}
            </span>
            <span className="text-(--color-ink-4) text-[11px]">&middot;</span>
            <span className="text-[12px] text-(--color-ink-3) font-medium">
              {meta.readingTime}
            </span>
          </div>
        </Flipped>
      )}

      <Flipped flipId={meta.title} spring="noWobble" translate>
        {(flippedProps: any) => (
          <Heading level={1} {...flippedProps}>
            {meta.title}
          </Heading>
        )}
      </Flipped>

      {isBlogPost && meta.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3">
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
        </div>
      )}
    </header>
  );
};
