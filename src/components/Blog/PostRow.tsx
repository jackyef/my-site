import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { WritingItem } from '@/blog/types';
import { Chip } from '@/components/common/Chip';

import { formatPostDate } from '@/lib/datetime';

interface PostRowProps {
  item: WritingItem;
}

export function PostRow({ item }: PostRowProps) {
  const { link, title, tags, date, readingTime, isExternal, publication, isLatest } =
    item;
  const firstTag = tags[0];

  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-(--color-ink) leading-[1.5] flex-1 group-hover:text-(--color-accent-text)">
            {title}
            {isExternal && (
              <ArrowUpRight
                size={13}
                className="inline ml-1 -translate-y-[1px] text-(--color-ink-4)"
                aria-hidden="true"
              />
            )}
          </span>
          {isLatest && (
            <Chip
              variant="highlight"
              size="xs"
              className="shrink-0 whitespace-nowrap"
            >
              latest
            </Chip>
          )}
          {publication ? (
            <Chip
              variant="muted"
              size="xs"
              className="shrink-0 whitespace-nowrap"
            >
              {publication}
            </Chip>
          ) : (
            firstTag && (
              <Chip
                variant="highlight"
                size="xs"
                className="shrink-0 whitespace-nowrap"
              >
                {firstTag}
              </Chip>
            )
          )}
        </div>
        <div className="text-[12px] text-(--color-ink-4) mt-[2px]">
          {formatPostDate(date)} · {readingTime}
        </div>
      </div>
    </>
  );

  const className =
    'flex items-baseline gap-3 -mx-3 px-3 py-[10px] no-underline transition-[background] duration-[120ms] hover:bg-(--color-bg-hover) rounded-lg group';

  if (isExternal) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link} className={className}>
      {content}
    </Link>
  );
}
