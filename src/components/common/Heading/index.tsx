import { cn } from '@/utils/styles/classNames';

type HeadingLevel = 'hero' | 'page' | 1 | 2 | 3 | 4;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const levelStyles: Record<string, string> = {
  hero: 'hero-h1',
  page: 'page-title',
  '1': 'text-3xl md:text-5xl font-bold font-serif text-(--color-ink)',
  '2': 'text-2xl md:text-3xl font-bold font-serif text-(--color-ink)',
  '3': 'text-xl md:text-2xl font-bold font-serif text-(--color-ink)',
  '4': 'text-lg md:text-xl font-bold font-serif text-(--color-ink)',
};

const defaultElement: Record<string, string> = {
  hero: 'h1',
  page: 'h1',
  '1': 'h1',
  '2': 'h2',
  '3': 'h3',
  '4': 'h4',
};

export function Heading({
  level,
  as,
  className,
  children,
  ...rest
}: HeadingProps) {
  const key = String(level);
  const As = as ?? defaultElement[key];

  return (
    <As className={cn(levelStyles[key], className)} {...rest}>
      {children}
    </As>
  );
}
