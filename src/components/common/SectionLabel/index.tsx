import { asLooseComponent } from '@/utils/polymorphic';
import { cn } from '@/utils/styles/classNames';

interface SectionLabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function SectionLabel({
  children,
  className,
  as = 'div',
  ...rest
}: SectionLabelProps) {
  const As = asLooseComponent(as);

  return (
    <As
      className={cn(
        // ink-3 rather than ink-4. These are group headings — sidebar nav
        // sections, widget titles, command-palette result groups — and at 11px
        // they count as small text, so they owe the reader the full 4.5:1.
        'text-[11px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-3)',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
