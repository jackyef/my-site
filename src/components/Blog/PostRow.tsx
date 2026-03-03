import Link from 'next/link';
import tinytime from 'tinytime';

import { Post } from '@/blog/types';
import { Chip } from '@/components/common/Chip';

const dateTemplate = tinytime('{DD} {MM} {YYYY}');

interface PostRowProps {
  post: Post;
}

export function PostRow({ post }: PostRowProps) {
  const { link, metadata } = post;
  const firstTag = metadata.tags[0];

  return (
    <Link
      href={link}
      className="flex items-baseline gap-3 -mx-3 px-3 py-[10px] no-underline transition-[background] duration-[120ms] hover:bg-(--color-bg-hover) rounded-lg group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-(--color-ink) leading-[1.5] flex-1 group-hover:text-(--color-accent-text)">
            {metadata.title}
          </span>
          {firstTag && (
            <Chip
              variant="highlight"
              size="xs"
              className="shrink-0 whitespace-nowrap"
            >
              {firstTag}
            </Chip>
          )}
        </div>
        <div className="text-[12px] text-(--color-ink-4) mt-[2px]">
          {dateTemplate.render(new Date(metadata.date))} ·{' '}
          {metadata.readingTime}
        </div>
      </div>
    </Link>
  );
}
