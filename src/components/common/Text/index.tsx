import { cn } from '@/utils/styles/classNames';

type TextVariant = 'lead' | 'body' | 'body-sm' | 'caption' | 'caption-sm';
type TextColor = 'ink' | 'ink-2' | 'ink-3' | 'ink-4' | 'accent';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const variantMap: Record<TextVariant, string> = {
  lead: 'text-lg md:text-xl leading-relaxed',
  body: 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-[13px] leading-normal',
  'caption-sm': 'text-[11px] leading-normal',
};

const colorMap: Record<TextColor, string> = {
  ink: 'text-(--color-ink)',
  'ink-2': 'text-(--color-ink-2)',
  'ink-3': 'text-(--color-ink-3)',
  'ink-4': 'text-(--color-ink-4)',
  accent: 'text-(--color-accent-text)',
};

/** Default color per variant — matches the design system's text hierarchy */
const defaultColor: Record<TextVariant, TextColor> = {
  lead: 'ink',
  body: 'ink-2',
  'body-sm': 'ink-2',
  caption: 'ink-3',
  'caption-sm': 'ink-4',
};

export function Text({
  variant = 'body',
  color,
  as: As = 'p',
  className,
  children,
  ...rest
}: TextProps) {
  const resolvedColor = color ?? defaultColor[variant];

  return (
    <As
      className={cn(variantMap[variant], colorMap[resolvedColor], className)}
      {...rest}
    >
      {children}
    </As>
  );
}
