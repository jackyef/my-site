import { cn } from '@/utils/styles/classNames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md';
  as?: React.ElementType;
}

const paddingMap = {
  none: '',
  sm: 'px-[14px] py-[12px]',
  md: 'px-[20px] py-[16px]',
};

export function Card({
  children,
  className,
  hover,
  padding = 'none',
  as: As = 'div',
}: CardProps) {
  return (
    <As
      className={cn(
        'card rounded-[10px] bg-[var(--color-bg-panel)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]',
        hover && 'card-hover',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </As>
  );
}
