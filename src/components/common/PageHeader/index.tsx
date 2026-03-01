import { cn } from '@/utils/styles/classNames';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  titleSpacing?: string;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  titleSpacing = 'mb-8',
  className,
}: PageHeaderProps) {
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-[10px]">{eyebrow}</p>}
      <h1 className={cn('page-title', titleSpacing)}>{title}</h1>
    </div>
  );
}
