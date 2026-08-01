import Link from 'next/link';

import { cn } from '@/utils/styles/classNames';

interface TextLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  /**
   * The link stands on its own line — "All writings →" under a section
   * heading, rather than a phrase inside a sentence. Standalone links are
   * destinations you aim at, so on touch they get a thumb-sized band; a link
   * inside a paragraph is exempt from the 44px floor and must stay `inline`,
   * or the padding overlaps the lines above and below it.
   */
  standalone?: boolean;
}

export function TextLink({
  children,
  href,
  className,
  standalone,
}: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-(--color-accent-text) no-underline hover:underline',
        standalone && 'inline-block py-0.5 pointer-coarse:py-3',
        className,
      )}
    >
      {children}
    </Link>
  );
}
