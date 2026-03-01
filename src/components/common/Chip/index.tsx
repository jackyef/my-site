import { cn } from '@/utils/styles/classNames';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'muted';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const variantMap = {
  default:
    'bg-[var(--color-bg-panel)] text-[var(--color-ink-2)] border-[var(--color-border)]',
  highlight:
    'bg-[var(--color-accent-xl)] text-[var(--color-accent-text)] border-[var(--color-accent-l)]',
  muted:
    'bg-[var(--color-bg)] text-[var(--color-ink-3)] border-[var(--color-border)]',
};

const sizeMap = {
  xs: 'text-[11px] px-[7px] py-[2px]',
  sm: 'text-[12px] px-[9px] py-[3px]',
  md: 'text-[13px] px-[12px] py-[5px]',
};

export function Chip({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'chip inline-block rounded-full border font-medium leading-none',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
