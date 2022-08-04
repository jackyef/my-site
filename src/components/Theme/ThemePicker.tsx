import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import XIcon from '@heroicons/react/solid/XIcon';
import clsx from 'clsx';
import { css } from 'goober';

import {
  constructHslString,
  getHslaColor,
  HSLObject,
} from '@/lib/styles/colors';

import { sendEventTracker } from '@/utils/analytics/tracker';

import { SectionTitle } from '../Typography/SectionTitle';

import { ThemeContext, THEMES, Theme } from './ThemeProvider';

const ThemeColors = ({ theme }: { theme: Theme }) => {
  const [colors, setColors] = React.useState<{
    primary: string;
    secondary: string;
    tertiary: string;
    bg: string;
    text: string;
  }>();

  React.useEffect(() => {
    const dummyDiv = document.createElement('div');
    dummyDiv.setAttribute('data-theme', theme);
    document.body.appendChild(dummyDiv);

    const primary = {
      h: getComputedStyle(dummyDiv).getPropertyValue('--h-primary'),
      s: getComputedStyle(dummyDiv).getPropertyValue('--s-primary'),
      l: getComputedStyle(dummyDiv).getPropertyValue('--l-primary'),
    } as HSLObject;
    const secondary = {
      h: getComputedStyle(dummyDiv).getPropertyValue('--h-secondary'),
      s: getComputedStyle(dummyDiv).getPropertyValue('--s-secondary'),
      l: getComputedStyle(dummyDiv).getPropertyValue('--l-secondary'),
    } as HSLObject;
    const tertiary = {
      h: getComputedStyle(dummyDiv).getPropertyValue('--h-tertiary'),
      s: getComputedStyle(dummyDiv).getPropertyValue('--s-tertiary'),
      l: getComputedStyle(dummyDiv).getPropertyValue('--l-tertiary'),
    } as HSLObject;
    const bg = {
      h: getComputedStyle(dummyDiv).getPropertyValue('--h-bg'),
      s: getComputedStyle(dummyDiv).getPropertyValue('--s-bg'),
      l: getComputedStyle(dummyDiv).getPropertyValue('--l-bg'),
    } as HSLObject;
    const text = {
      h: getComputedStyle(dummyDiv).getPropertyValue('--h-text'),
      s: getComputedStyle(dummyDiv).getPropertyValue('--s-text'),
      l: getComputedStyle(dummyDiv).getPropertyValue('--l-text'),
    } as HSLObject;

    setColors({
      primary: `hsl(${constructHslString(primary)})`,
      secondary: `hsl(${constructHslString(secondary)})`,
      tertiary: `hsl(${constructHslString(tertiary)})`,
      bg: `hsl(${constructHslString(bg)})`,
      text: `hsl(${constructHslString(text)})`,
    });

    return () => {
      document.body.removeChild(dummyDiv);
    };
  }, [theme]);

  return (
    <div className="flex -space-x-2">
      <div
        className="rounded-full border-2 border-surface-5 w-8 h-8"
        style={{ background: colors?.primary }}
      />
      <div
        className="rounded-full border-2 border-surface-5 w-8 h-8"
        style={{ background: colors?.secondary }}
      />
      <div
        className="rounded-full border-2 border-surface-5 w-8 h-8"
        style={{ background: colors?.tertiary }}
      />
      <div
        className="rounded-full border-2 border-surface-5 w-8 h-8"
        style={{ background: colors?.bg }}
      />
      <div
        className="rounded-full border-2 border-surface-5 w-8 h-8"
        style={{ background: colors?.text }}
      />
    </div>
  );
};

export const ThemePicker = () => {
  const [theme, setTheme] = React.useContext(ThemeContext);

  const activeTheme = css`
    border: 1px solid ${getHslaColor('primary')};
    background: ${getHslaColor('primary', 0.2)};
  `;

  const inactiveTheme = css`
    border: 1px solid ${getHslaColor('bg', 1, { l: 12 })};
  `;

  return (
    <Dialog.Root modal>
      <Dialog.Trigger asChild>
        <button aria-label="Pick theme" className="inline-block p-2 rounded-md">
          🎨
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <div className="backdrop-blur fixed inset-0 bg-black bg-opacity-30 animate-fadeIn" />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <div
            className={clsx(
              'p-8',
              'bg-surface-1',
              'text-theme-text',
              'rounded-lg',
              'top-[10%]',
              'xs:top-[20%]',
              'md:top-[30%]',
              'animate-fadeIn',
              'transition-colors',
              'duration-500',
              'border-dark-only',
              'max-h-[70%]',
              'overflow-y-scroll',
            )}
            style={{
              position: 'fixed',
              left: '50%',
              transform: 'translate(-50%)',
              width: '90vw',
              maxWidth: '52rem',
            }}
          >
            <div className="flex justify-end mb-2">
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="absolute top-8 right-4 p-2 rounded-lg"
                >
                  <XIcon width={32} height={32} />
                </button>
              </Dialog.Close>
            </div>
            <SectionTitle>Pick a theme</SectionTitle>
            <div
              className={clsx(
                'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4',
                'mt-4',
              )}
            >
              {THEMES.map((t) => {
                return (
                  <button
                    key={t}
                    className={clsx(
                      'p-8',
                      'flex-1 flex flex-col items-center justify-center space-y-4',
                      'rounded-lg',
                      {
                        [activeTheme]: t === theme,
                        [inactiveTheme]: t !== theme,
                      },
                    )}
                    onClick={() => {
                      setTheme(t);
                      sendEventTracker({
                        name: 'click',
                        category: `header nav`,
                        label: `set theme to ${t}`,
                      });
                    }}
                  >
                    <span>{t}</span>

                    <ThemeColors theme={t} />
                  </button>
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
