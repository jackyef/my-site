import { motion } from 'framer-motion';
import { useId } from 'react';

import type { PostHeading } from '@/blog/types';
import { cleanHeadingContent, slugify } from '@/lib/blog';

type Props = {
  headings: PostHeading[];
  activeSlug: string | null;
};

export const TableOfContents = ({ headings, activeSlug }: Props) => {
  const labelId = useId();
  const indicatorId = useId();

  return (
    <nav aria-labelledby={labelId}>
      <div
        id={labelId}
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-4)',
          marginBottom: 12,
        }}
      >
        On this page
      </div>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map((heading) => {
          const slug = slugify(heading.content);
          const isActive = activeSlug === slug;

          return (
            <li
              key={slug}
              style={{
                position: 'relative',
                paddingLeft: heading.level === 3 ? 20 : 10,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={indicatorId}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 2,
                    bottom: 2,
                    width: 2,
                    background: 'var(--color-accent)',
                    borderRadius: 2,
                  }}
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
                style={{
                  display: 'block',
                  padding: '4px 0',
                  fontSize: heading.level === 3 ? 12 : 13,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--color-ink-2)' : 'var(--color-ink-4)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  lineHeight: 1.4,
                }}
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
