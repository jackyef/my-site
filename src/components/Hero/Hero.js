import React from 'react';

import DarkModeToggle from './DarkModeToggle';
import DownArrowButton from './DownArrowButton';

const browserCanUseCssVariables = () => {
  return typeof window !== 'undefined' && window.CSS && CSS.supports('color', 'var(--fake-var)');
}

const Hero = props => {
  const { scrollToContent, theme } = props;

  return (
    <React.Fragment>
      <section className="hero">
        {browserCanUseCssVariables ? <DarkModeToggle /> : null}
        <h1>Hi, I am Jacky 👋</h1>
        <DownArrowButton theme={theme} onClick={scrollToContent} />
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .hero {
          position: relative;
          align-items: center;
          background: ${theme.hero.background.light};
          z-index: 5;
          background-size: cover;
          transition: background 0.5s ease-out;
          color: ${theme.text.color.primary.inverse};
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          min-height: 100vh;
          height: 100px;
          padding: ${theme.space.inset.l};
          padding-top: ${theme.header.height.homepage};
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: var(--dark-mode-enabled);
          background: ${theme.hero.background.dark};
          transition: 0.4s;
          z-index: -1;
        }

        h1 {
          text-align: center;
          font-size: ${theme.hero.h1.size};
          margin: ${theme.space.stack.l};
          color: ${theme.hero.h1.color};
          line-height: ${theme.hero.h1.lineHeight};
          text-remove-gap: both 0 'Open Sans';

          :global(strong) {
            position: relative;

            &::after,
            &::before {
              content: '›';
              color: ${theme.text.color.attention};
              margin: 0 ${theme.space.xs} 0 0;
              text-shadow: 0 0 ${theme.space.s} ${theme.color.neutral.gray.k};
            }
            &::after {
              content: '‹';
              margin: 0 0 0 ${theme.space.xs};
            }
          }
        }

        @from-width tablet {
          h1 {
            max-width: 90%;
            font-size: ${`calc(${theme.hero.h1.size} * 1.3)`};
          }
        }

        @from-width desktop {
          h1 {
            max-width: 80%;
            font-size: ${`calc(${theme.hero.h1.size} * 1.5)`};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Hero;
