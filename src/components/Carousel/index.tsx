import * as React from 'react';

const baseButtonClasses =
  'opacity-0 md:opacity-100 flex items-center content-center absolute bg-surface-3 w-12 h-12 rounded-full border-none shadow-surface-2 z-10 items-center justify-center font-bold text-3xl';
const baseButtonStyles = {
  top: `calc(50% - 3rem / 2)`,
  transition: `transform 0.2s ease-in, opacity 0.2s ease-in`,
};

interface Props {
  children?: React.ReactNode;
}

const Carousel = ({ children }: Props) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  const handlePrev = React.useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -window.innerWidth * 0.3,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleNext = React.useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: window.innerWidth * 0.3,
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
        className="first:ml-4 overflow-x-scroll align-top whitespace-nowrap py-4 scroll-snap-xm"
      >
        {children}
      </div>
    </section>
  );
};

export default Carousel;
