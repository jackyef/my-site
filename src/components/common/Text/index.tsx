import { cn } from '@/utils/styles/classNames';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'lead' | 'body' | 'body-sm' | 'caption' | 'caption-sm';
  color?: 'ink' | 'ink-2' | 'ink-3' | 'ink-4' | 'accent';
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const variantMap = {
  lead: 'text-lg md:text-xl leading-relaxed',
  body: 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-[13px] leading-normal',
  'caption-sm': 'text-[11px] leading-normal',
};

const colorMap = {
  ink: 'text-[var(--color-ink)]',
  'ink-2': 'text-[var(--color-ink-2)]',
  'ink-3': 'text-[var(--color-ink-3)]',
  'ink-4': 'text-[var(--color-ink-4)]',
  accent: 'text-[var(--color-accent-text)]',
};

export function Text({
  variant = 'body',
  color = 'ink',
  as: As = 'p',
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <As
      className={cn(variantMap[variant], colorMap[color], className)}
      {...rest}
    >
      {children}
    </As>
  );
}
