import { motion } from 'motion/react';
import { useId } from 'react';

import { SectionLabel } from '@/components/common/SectionLabel';
import type { PostHeading } from '@/blog/types';

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

      <ol role="list" className="list-none p-0 m-0">
        {headings.map((heading) => {
          const isActive = activeSlug === heading.id;

          return (
            <li
              key={heading.id}
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
                href={`#${heading.id}`}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('blog:heading-active', {
                      detail: { slug: heading.id },
                    }),
                  );
                }}
                className={cn(
                  // `colors` is not a property, so the old value invalidated
                  // the whole declaration and nothing transitioned
                  'block py-1 no-underline transition-[color,transform] duration-150 leading-[1.4]',
                  heading.level === 3 ? 'text-[12px]' : 'text-[13px]',
                  'hover:text-(--color-ink-2)',
                  isActive
                    ? 'font-bold text-(--color-ink-2) transform translate-x-0.5'
                    : // These are navigation links, so they sit on ink-3.
                      // ink-4 is the decorative tier and reads at ~2.5:1.
                      'font-normal text-(--color-ink-3)',
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
