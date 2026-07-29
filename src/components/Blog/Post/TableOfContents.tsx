import { motion } from 'motion/react';
import { useId } from 'react';

import { SectionLabel } from '@/components/common/SectionLabel';
import type { PostHeading } from '@/blog/types';
import { cleanHeadingContent, slugify } from '@/lib/blog';

import { cn } from '@/utils/styles/classNames';

type Props = {
  headings: PostHeading[];
  activeSlug: string | null;
};

export const TableOfContents = ({ headings, activeSlug }: Props) => {
  const labelId = useId();
  const indicatorId = useId();

  return (
    <nav aria-labelledby={labelId} className="overflow-x-clip">
      <SectionLabel id={labelId} className="mb-3">
        On this page
      </SectionLabel>

      <ol className="list-none p-0 m-0">
        {headings.map((heading) => {
          const slug = slugify(heading.content);
          const isActive = activeSlug === slug;

          return (
            <li
              key={slug}
              className={cn(
                'relative',
                heading.level === 3 ? 'pl-5' : 'pl-[10px]',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={indicatorId}
                  className="absolute left-0 top-[2px] bottom-[2px] w-[2px] rounded-sm bg-(--color-accent)"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <a
                href={`#${slug}`}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('blog:heading-active', {
                      detail: { slug },
                    }),
                  );
                }}
                className={cn(
                  // `colors` is not a property, so the old value invalidated
                  // the whole declaration and nothing transitioned
                  'block py-1 no-underline transition-[color,transform] duration-150 leading-[1.4]',
                  heading.level === 3 ? 'text-[12px]' : 'text-[13px]',
                  'hover:text-(--color-ink-3)',
                  isActive
                    ? 'font-bold text-(--color-ink-2) transform translate-x-0.5'
                    : 'font-normal text-(--color-ink-4)',
                )}
              >
                {cleanHeadingContent(heading.content)}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
