import { cn } from '@/utils/styles/classNames';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function SectionLabel({
  children,
  className,
  as: As = 'div',
}: SectionLabelProps) {
  return (
    <As
      className={cn(
        'text-[11px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-4)',
        className,
      )}
    >
      {children}
    </As>
  );
}
