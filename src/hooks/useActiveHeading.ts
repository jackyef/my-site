import { useEffect, useState } from 'react';

import type { PostHeading } from '@/blog/types';

/**
 * Tracks the currently visible heading in a blog post.
 *
 * Works by listening to 'blog:heading-active' custom events dispatched by the
 * withTocHighlighter HOC (which wraps each MDX h2/h3 with a framer-motion
 * viewport observer). Initialises to the first heading so the indicator is
 * visible immediately on page load.
 */
export function useActiveHeading(headings: PostHeading[]): string | null {
  const [activeSlug, setActiveSlug] = useState<string | null>(() =>
    headings.length > 0 ? headings[0].id : null,
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const { slug } = (e as CustomEvent<{ slug: string }>).detail;
      setActiveSlug(slug);
    };

    window.addEventListener('blog:heading-active', handler);
    return () => window.removeEventListener('blog:heading-active', handler);
  }, []);

  return activeSlug;
}
