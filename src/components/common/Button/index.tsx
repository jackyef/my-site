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
    'bg-(--color-accent) text-(--color-on-accent) no-underline hover:[filter:brightness(1.1)] hover:-translate-y-px',
  secondary:
    'bg-transparent text-(--color-ink-2) font-medium border-[1.5px] border-(--color-border-hi) no-underline hover:border-(--color-accent) hover:text-(--color-accent-text)',
  ghost:
    'bg-transparent text-(--color-ink-3) font-medium no-underline hover:bg-(--color-bg-hover) hover:text-(--color-ink-2)',
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
        'inline-flex items-center rounded-full transition-[filter,transform,background,border-color,color] duration-[180ms]',
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
