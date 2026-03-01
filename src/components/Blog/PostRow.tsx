import Link from 'next/link';
import tinytime from 'tinytime';

import { Post } from '@/blog/types';

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
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid var(--color-border)',
        textDecoration: 'none',
        transition: 'background 0.12s',
      }}
      className="hover:bg-[var(--color-bg-hover)] group"
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-ink)',
              lineHeight: 1.5,
              flex: 1,
            }}
            className="group-hover:text-[var(--color-accent-text)]"
          >
            {metadata.title}
          </span>
          {firstTag && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 7px',
                borderRadius: 100,
                background: 'var(--color-accent-xl)',
                color: 'var(--color-accent-text)',
                border: '1px solid var(--color-accent-l)',
                lineHeight: 1,
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {firstTag}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-ink-4)',
            marginTop: 2,
          }}
        >
          {dateTemplate.render(new Date(metadata.date))} ·{' '}
          {metadata.readingTime}
        </div>
      </div>
    </Link>
  );
}
