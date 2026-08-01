import { asLooseComponent } from '@/utils/polymorphic';
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

/**
 * `text-pretty` on the short roles only.
 *
 * A standfirst or a caption is a two-or-three-line block where a lone word
 * stranded on the last line is the whole shape of it, and `pretty` fixes that
 * by pulling one word down. `body` and `lead` at a capped measure are running
 * copy — `pretty` costs layout passes there for a payoff nobody sees, and
 * `balance` would be worse still. Headings get `balance` globally instead.
 */
const variantMap: Record<TextVariant, string> = {
  lead: 'text-lg md:text-xl leading-relaxed text-pretty',
  body: 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-[13px] leading-normal text-pretty',
  'caption-sm': 'text-[11px] leading-normal text-pretty',
};

const colorMap: Record<TextColor, string> = {
  ink: 'text-(--color-ink)',
  'ink-2': 'text-(--color-ink-2)',
  'ink-3': 'text-(--color-ink-3)',
  'ink-4': 'text-(--color-ink-4)',
  accent: 'text-(--color-accent-text)',
};

/**
 * Default color per variant — matches the design system's text hierarchy.
 *
 * `caption-sm` used to default to `ink-4`, which is the one tier the ramp
 * documents as unreadable on purpose ("separator marks, sparkline fills and
 * icons that repeat information an adjacent element already carries"). Being
 * the default meant every 11px caption opted into ~2.5:1 without asking —
 * career date ranges and timeline years among them. Small is a size, not a
 * licence to be faint; `color="ink-4"` is still there for the genuinely
 * decorative cases.
 */
const defaultColor: Record<TextVariant, TextColor> = {
  lead: 'ink',
  body: 'ink-2',
  'body-sm': 'ink-2',
  caption: 'ink-3',
  'caption-sm': 'ink-3',
};

export function Text({
  variant = 'body',
  color,
  as = 'p',
  className,
  children,
  ...rest
}: TextProps) {
  const As = asLooseComponent(as);
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
