import { cn } from '@/utils/styles/classNames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  as?: React.ElementType;
  className?: string;
  href?: string;
}

const variantMap = {
  primary:
    'bg-[var(--color-accent)] text-white font-semibold no-underline hover:[filter:brightness(1.1)] hover:-translate-y-px',
  secondary:
    'bg-transparent text-[var(--color-ink-2)] font-medium border border-[var(--color-border-hi)] no-underline hover:bg-[var(--color-bg-hover)]',
  ghost:
    'bg-transparent text-[var(--color-ink-3)] font-medium no-underline hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-ink-2)]',
};

const sizeMap = {
  sm: 'px-3 py-[6px] text-[13px]',
  md: 'px-5 py-[9px] text-[14px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  as: As = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <As
      className={cn(
        'inline-flex items-center rounded-lg transition-[filter,transform,background,border-color] duration-[180ms]',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
