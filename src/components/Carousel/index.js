import React, { useRef, useCallback, useContext } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa/';
import { ThemeContext } from '../../layouts';

const Carousel = ({ children }) => {
  const theme = useContext(ThemeContext);
  const carouselRef = useRef();
  const prevRef = useRef();
  const nextRef = useRef();

  const handlePrev = useCallback(() => {
    carouselRef.current.scrollBy({ left: -window.innerWidth * 0.3, behavior: 'smooth' });
  }, []);

  const handleNext = useCallback(() => {
    carouselRef.current.scrollBy({ left: window.innerWidth * 0.3, behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const sl = carouselRef.current.scrollLeft;
      const sw = carouselRef.current.scrollWidth;
      const ow = carouselRef.current.offsetWidth;

      if (sl <= 10) {
        prevRef.current.classList.add('hide');
      } else {
        prevRef.current.classList.remove('hide');
      }

      if (sw <= sl + ow) {
        nextRef.current.classList.add('hide');
      } else {
        nextRef.current.classList.remove('hide');
      }
    });
  }, []);

  return (
    <React.Fragment>
      <section>
        <button className="prev hide" ref={prevRef} onClick={handlePrev} aria-label="previous">
          <FaArrowLeft size={16} />
        </button>
        <button className="next" ref={nextRef} onClick={handleNext} aria-label="next">
          <FaArrowRight size={16} />
        </button>
        <div ref={carouselRef} onScroll={handleScroll}>
          {children}
        </div>
      </section>

      <style jsx>{`
        section {
          display: block;
          position: relative;
        }

        div {
          padding: 0 ${theme.space.s};
          white-space: nowrap;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          vertical-align: top;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: -ms-autohiding-scrollbar;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          background: ${theme.color.neutral.gray.a};
          width: ${theme.space.l};
          height: ${theme.space.l};
          border-radius: 50%;
          border: none;
          box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.6);
          top: ${`calc(50% - ${theme.space.l} / 2)`};
          transition: transform 0.2s ease-in, opacity 0.2s ease-in;
          z-index: 1;
          opacity: 0;
        }

        .prev {
          transform: translateX(-30px) scale(0);
          left: -20px;
        }

        .next {
          transform: translateX(30px) scale(0);
          right: -20px;
        }

        .prev.hide {
          opacity: 0 !important;
          transform: translateX(-30px) scale(0) !important;
        }

        .next.hide {
          opacity: 0 !important;
          transform: translateX(30px) scale(0) !important;
        }

        @above desktop {
          section:hover > button {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Carousel;
