import Link from 'next/link';

import { cn } from '@/utils/styles/classNames';

interface TextLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function TextLink({ children, href, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-(--color-accent-text) no-underline hover:underline',
        className,
      )}
    >
      {children}
    </Link>
  );
}
