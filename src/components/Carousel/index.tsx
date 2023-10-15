import * as React from 'react';
import { css } from 'goober';

import { cn } from '@/lib/classNames';

const baseButtonClasses =
  'opacity-0 md:opacity-100 flex items-center content-center absolute bg-surface-3 w-12 h-12 rounded-full border-none shadow-surface-2 z-10 items-center justify-center font-bold text-md';
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

  const handleScroll = React.useCallback(() => {
    requestAnimationFrame(() => {
      if (carouselRef.current && prevRef.current && nextRef.current) {
        const sl = carouselRef.current.scrollLeft;
        const sw = carouselRef.current.scrollWidth;
        const ow = carouselRef.current.offsetWidth;

        if (sl <= 10) {
          prevRef.current.classList.add('scale-0');
        } else {
          prevRef.current.classList.remove('scale-0');
        }

        if (sw <= sl + ow) {
          nextRef.current.classList.add('scale-0');
        } else {
          nextRef.current.classList.remove('scale-0');
        }
      }
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
