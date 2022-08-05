import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import { css } from 'goober';

import { SectionContainer } from '@/components/SectionContainer';
import { getHslString } from '@/lib/styles/colors';

import { usePwaInstall } from '@/hooks/usePwaInstall';

import { sendEventTracker } from '@/utils/analytics/tracker';

import { InternalLink } from '../Typography/InternalLink';
import { useCommandPaletteContext } from '../CommandPalette/hooks/useCommandPaletteContext';
import { ThemePicker } from '../Theme/ThemePicker';

import PwaInstallIcon from './assets/icon-plus.svg';

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        className="h-5 inline-block"
        width="20"
        height="20"
        src="/android-icon-96x96.png"
        alt="logo"
      />
      <strong className="hidden ml-2 text-lg text sm:inline">
        jackyef.com
      </strong>
    </div>
  );
}

export default function Header() {
  const { isReady, trigger } = usePwaInstall();
  const { setIsOpen } = useCommandPaletteContext();
  const [shouldBeMoreOpaque, setShouldBeMoreOpaque] = useState(false);

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
    <>
      <header
        className={clsx('py-4', 'sticky', 'top-0', 'w-full', glassyHeaderClass)}
      >
        <SectionContainer>
          <nav className={clsx('flex', 'justify-between', 'items-center')}>
            <div className="flex space-x-2">
              <Link href="/">
                <a
                  aria-label="Jacky Efendi's personal site"
                  className="rounded-md p-2"
                  onClick={() => {
                    sendEventTracker({
                      name: 'click',
                      category: 'header nav',
                      label: 'logo',
                    });
                  }}
                >
                  <Logo />
                </a>
              </Link>
              <button
                style={{
                  opacity: isReady ? 1 : 0,
                  transform: isReady
                    ? 'translateX(0) rotate(0deg)'
                    : 'translateX(-1rem) rotate(-270deg)',
                  cursor: isReady ? 'auto' : 'none',
                  transition:
                    'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
                }}
                tabIndex={isReady ? 0 : -1}
                className="self-center w-7 h-7 p-1 rounded-full"
                onClick={() => trigger()}
              >
                <Image
                  className="monochrome-img"
                  src={PwaInstallIcon}
                  alt="Add to home screen"
                  loading="lazy"
                />
              </button>
            </div>
            <div className="text-base leading-5 flex items-center space-x-2">
              <InternalLink
                href="/blog"
                className="font-medium text-theme-text hover:text-theme-text rounded-md p-2"
                onClick={() => {
                  sendEventTracker({
                    name: 'click',
                    category: 'header nav',
                    label: 'blog',
                  });
                }}
                isNotFancy
              >
                Blog
              </InternalLink>
              <button
                className="font-medium text-theme-text hover:text-theme-text rounded-md p-2"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                }}
              >
                <code>/cmd</code>
              </button>

              <ThemePicker />
            </div>
          </nav>
        </SectionContainer>
      </header>
    </>
  );
}
