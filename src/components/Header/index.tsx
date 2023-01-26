import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { css } from 'goober';
import { Flipper } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { SectionContainer } from '@/components/SectionContainer';
import { getHslaColor, getHslString } from '@/lib/styles/colors';

import { ThemePicker } from '../Theme/ThemePicker';

import { navLinks } from './constants';
import { NavLink } from './NavLink';
import { PwaInstallButton } from './PwaInstallButton';
import { CommandBarToggle } from './CommandBarToggle';

export default function Header() {
  const [shouldBeMoreOpaque, setShouldBeMoreOpaque] = useState(false);
  const router = useRouter();

  /*
   * Better header handling for browser not supporting backdrop-filter
   * Yes, looking at you, Safari.
   */
  useEffect(() => {
    const handleScroll = () => {
      const NAVBAR_HEIGHT = 75;
      const shouldBeMoreOpaque = window.scrollY > NAVBAR_HEIGHT;
      setShouldBeMoreOpaque(shouldBeMoreOpaque);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const glassyHeaderClass = css`
    --bg-opacity: ${shouldBeMoreOpaque ? 0.95 : 0};
    --saturate-power: ${shouldBeMoreOpaque ? '120%' : '100%'};
    --contrast-power: ${shouldBeMoreOpaque ? '105%' : '100%'};
    --blur-size: ${shouldBeMoreOpaque ? '8px' : '0px'};

    background: hsla(${getHslString('bg')} / var(--bg-opacity));
    backdrop-filter: contrast(var(--contrast-power))
      saturate(var(--saturate-power)) blur(var(--blur-size));
    z-index: 3;
    height: var(--navbar-height);
    transition: background var(--transition-default);

    @supports (backdrop-filter: blur(8px)) {
      --bg-opacity: ${shouldBeMoreOpaque ? 0.4 : 0};
      --shadow-color: ${getHslaColor('bg', shouldBeMoreOpaque ? 0.4 : 0, {
        h: 5,
        s: -10,
        l: 0,
      })};
      box-shadow: 0 6px 6px 0px var(--shadow-color);
    }

    @media (max-width: 640px) {
      --bg-opacity: ${shouldBeMoreOpaque ? 0.95 : 0.4};
      --saturate-power: 120%;
      --contrast-power: 105%;
      --blur-size: 8px;

      @supports (backdrop-filter: blur(8px)) {
        --bg-opacity: 0.2;
      }
    }
  `;

  return (
    <header
      className={clsx('py-4', 'sticky', 'top-0', 'w-full', glassyHeaderClass)}
    >
      <Flipper flipKey={router.pathname}>
        <SectionContainer>
          <nav className={clsx('flex', 'justify-between', 'items-center')}>
            <div className="flex space-x-2">
              {navLinks.map((navLink) => (
                <NavLink key={navLink.href} {...navLink} />
              ))}

              <PwaInstallButton />
            </div>
            <div className="text-base leading-5 flex items-center space-x-2">
              <CommandBarToggle />
              <ThemePicker />
            </div>
          </nav>
        </SectionContainer>
      </Flipper>
    </header>
  );
}
