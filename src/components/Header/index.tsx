import { css } from 'goober';
import { Flipper } from 'react-flip-toolkit';
import { useRouter } from 'next/router';

import { SectionContainer } from '@/components/SectionContainer';

import { cn } from '@/utils/styles/classNames';

import { ThemePicker } from '../Theme/ThemePicker';

import { navLinks } from './constants';
import { NavLink } from './NavLink';
import { PwaInstallButton } from './PwaInstallButton';
import { CommandBarToggle } from './CommandBarToggle';

export default function Header() {
  const router = useRouter();

  const backdropClass = css`
    position: absolute;
    inset: 0;
    --extended-by: 100px;
    bottom: calc(-1 * var(--extended-by));
    --cutoff: calc(100% - var(--extended-by));
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 0,
      black var(--cutoff),
      transparent var(--cutoff)
    );
    --blur: 15px;
    backdrop-filter: blur(var(--blur));
    -webkit-backdrop-filter: blur(var(--blur));
    pointer-events: none;
    z-index: -1;
  `;

  return (
    <header
      className={cn('py-4', 'sticky', 'top-0', 'w-full', 'isolate', 'z-10')}
    >
      <div className={backdropClass} />
      <Flipper flipKey={router.pathname}>
        <SectionContainer>
          <nav className={cn('flex', 'justify-between', 'items-center')}>
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
