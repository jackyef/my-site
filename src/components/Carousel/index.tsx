import * as React from 'react';
import { css } from 'goober';

import { cn } from '@/utils/styles/classNames';

const baseButtonClasses =
  'opacity-0 md:opacity-100 flex items-center content-center absolute bg-(--color-bg-panel) text-(--color-ink-2) w-12 h-12 rounded-full border-none shadow-(--shadow-md) z-10 items-center justify-center font-bold text-base';
const baseButtonStyles = {
  top: `calc(50% - 3rem / 2)`,
  transition: `transform 0.2s ease-in, opacity 0.2s ease-in`,
};

interface Props {
  children?: React.ReactNode;
  scrollTimelineName?: string;
}

const Carousel = ({ children, scrollTimelineName }: Props) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  const handlePrev = React.useCallback(() => {
    if (carouselRef.current) {
      const child =
        carouselRef.current.children[carouselRef.current.children.length - 1];
      const childWidth = child.clientWidth;
      carouselRef.current.scrollBy({
        left: -childWidth,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleNext = React.useCallback(() => {
    if (carouselRef.current) {
      const child =
        carouselRef.current.children[carouselRef.current.children.length - 1];
      const childWidth = child.clientWidth;

      carouselRef.current.scrollBy({
        left: childWidth,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollRaf = React.useRef(0);
  const handleScroll = React.useCallback(() => {
    cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      const prev = prevRef.current;
      const next = nextRef.current;
      if (!carousel || !prev || !next) return;

      // Batch all reads first
      const sl = carousel.scrollLeft;
      const sw = carousel.scrollWidth;
      const ow = carousel.offsetWidth;

      // Then batch all writes
      prev.classList.toggle('scale-0', sl <= 10);
      next.classList.toggle('scale-0', sw <= sl + ow);
    });
  }, []);

  return (
    <section className="relative overflow-x-hidden md:overflow-x-visible isolate">
      <button
        className={`${baseButtonClasses} transform scale-0`}
        style={{
          ...baseButtonStyles,
          left: '-30px',
        }}
        ref={prevRef}
        onClick={handlePrev}
        aria-label="previous"
      >
        &larr;
      </button>
      <button
        className={`${baseButtonClasses} transform`}
        style={{
          ...baseButtonStyles,
          right: '-30px',
        }}
        ref={nextRef}
        onClick={handleNext}
        aria-label="next"
      >
        &rarr;
      </button>
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className={cn(
          'first:ml-4 overflow-x-scroll align-top whitespace-nowrap py-4',
          // Position sticky doesn't work well with scroll snap
          // When a `scrollTimelineName` is provided, we want to use sticky
          scrollTimelineName
            ? css`
                scroll-timeline-name: --${scrollTimelineName};
                scroll-timeline-axis: x;
              `
            : 'scroll-snap-xm',
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default Carousel;
