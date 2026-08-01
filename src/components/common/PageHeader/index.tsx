import { cn } from '@/utils/styles/classNames';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  titleSpacing?: string;
  className?: string;
  /**
   * Heading level. A page gets exactly one h1, so anything that renders more
   * than one of these on the same document — /about stacks four sections and
   * scrolls between them — has to demote the ones after the first. Purely a
   * semantic switch: `.page-title` carries the appearance either way, so a
   * demoted section header looks identical to the one above it.
   */
  level?: 1 | 2;
}

export function PageHeader({
  eyebrow,
  title,
  titleSpacing = 'mb-8',
  className,
  level = 1,
}: PageHeaderProps) {
  const Heading = level === 1 ? 'h1' : 'h2';

  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-[10px]">{eyebrow}</p>}
      <Heading className={cn('page-title', titleSpacing)}>{title}</Heading>
    </div>
  );
}
