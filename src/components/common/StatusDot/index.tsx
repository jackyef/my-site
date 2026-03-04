import { cn } from '@/utils/styles/classNames';

interface StatusDotProps {
  color?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  color = 'var(--color-success)',
  pulse = true,
  className,
}: StatusDotProps) {
  return (
    <span
      className={cn(
        'w-[7px] h-[7px] rounded-full shrink-0 inline-block',
        pulse && 'animate-pulse',
        className,
      )}
      style={{ background: color }}
    />
  );
}
