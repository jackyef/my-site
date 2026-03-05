import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utils/styles/classNames';

import { useMessyStack } from './useMessyStack';

interface MessyCarouselProps {
  children: React.ReactNode;
  className?: string;
}

const ITEM_CLASS = cn(
  'shrink-0 sticky',
  '[translate:0_var(--ty,0px)]',
  '[rotate:var(--r,0deg)]',
  '[z-index:var(--z,auto)]',
  '[transition:rotate_0.3s_ease-out,translate_0.3s_ease-out,scale_0.3s_ease-out]',
  'hover:[rotate:0deg] hover:[translate:0_0] hover:[scale:1.05]',
);

const BUTTON_BASE = cn(
  'hidden md:flex',
  'absolute top-1/3 -translate-y-1/2 z-30',
  'items-center justify-center',
  'size-9 rounded-full',
  'bg-(--color-bg-panel)/80 backdrop-blur-sm',
  'border border-(--color-border)',
  'text-(--color-ink-3) hover:text-(--color-ink)',
  'cursor-pointer',
  'transition-[opacity,scale,rotate] duration-300',
  '[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]',
  'hover:scale-110',
  'active:scale-90',
  '[&]:starting:scale-0 [&]:starting:opacity-0 [&]:starting:rotate-45',
);

export function MessyCarousel({ children, className }: MessyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useMessyStack(containerRef);

  return (
    <div className="relative">
      <button
        className={cn(
          BUTTON_BASE,
          'left-0 md:left-1',
          canScrollLeft
            ? 'scale-100 opacity-100 rotate-0'
            : 'scale-0 opacity-0 -rotate-45 pointer-events-none',
        )}
        onClick={scrollLeft}
        aria-label="Scroll left"
        tabIndex={canScrollLeft ? 0 : -1}
      >
        <ChevronLeft size={18} />
      </button>
      <div
        ref={containerRef}
        className={cn(
          'flex gap-5 overflow-x-auto pt-3 pb-10 -mx-5 px-5 md:-mx-13 md:px-13',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        {children}
      </div>
      <button
        className={cn(
          BUTTON_BASE,
          'right-0 md:right-1',
          canScrollRight
            ? 'scale-100 opacity-100 rotate-0'
            : 'scale-0 opacity-0 rotate-45 pointer-events-none',
        )}
        onClick={scrollRight}
        aria-label="Scroll right"
        tabIndex={canScrollRight ? 0 : -1}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

interface MessyCarouselItemProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  index: number;
  [key: string]: unknown;
}

export function MessyCarouselItem({
  children,
  className,
  as: As = 'div',
  index,
  ...rest
}: MessyCarouselItemProps) {
  return (
    <As
      data-carousel-item
      className={cn(ITEM_CLASS, className)}
      style={{ left: `${index * 6}px` }}
      {...rest}
    >
      {children}
    </As>
  );
}
