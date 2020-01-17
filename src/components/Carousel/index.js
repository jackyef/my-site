import React, { useRef, useCallback, useContext } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa/';
import { ThemeContext } from '../../layouts';

const Carousel = ({ children }) => {
  const theme = useContext(ThemeContext);
  const carouselRef = useRef();
  const prevRef = useRef();
  const nextRef = useRef();

  const handlePrev = useCallback(() => {
    carouselRef.current.scrollBy({ left: -window.innerWidth * 0.5, behavior: 'smooth' });
  }, []);

  const handleNext = useCallback(() => {
    carouselRef.current.scrollBy({ left: window.innerWidth * 0.5, behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const sl = carouselRef.current.scrollLeft;
      const sw = carouselRef.current.scrollWidth;
      const ow = carouselRef.current.offsetWidth;

      if (sl <= 10) {
        prevRef.current.style.transform = 'scale(0)';
        prevRef.current.style.opacity = '0';
      } else {
        prevRef.current.style.transform = 'scale(1)';
        prevRef.current.style.opacity = '';
      }

      if (sw <= sl + ow) {
        nextRef.current.style.transform = 'scale(0)';
        nextRef.current.style.opacity = '0';
      } else {
        nextRef.current.style.transform = 'scale(1)';
        nextRef.current.style.opacity = '';
      }
    });
  }, []);

  return (
    <React.Fragment>
      <section>
        <button className="prev" ref={prevRef} onClick={handlePrev}>
          <FaArrowLeft size={16} />
        </button>
        <button className="next" ref={nextRef} onClick={handleNext}>
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
          transform: translateY(-50%);
          border-radius: 50%;
          border: none;
          box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.6);
          top: ${`calc(50% - ${theme.space.l} / 2)`};
          transition: transform 0.1s ease-in, opacity 0.1s ease-in;
          z-index: 1;
          opacity: 0;
        }

        button:hover {
          opacity: 1;
        }

        .prev {
          left: -20px;
          transform: scale(0);
        }

        .next {
          right: -20px;
          transform: scale(1);
        }

        @above desktop {
          button {
            opacity: 0.8;
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
