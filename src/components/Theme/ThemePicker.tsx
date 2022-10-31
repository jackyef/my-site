import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import XIcon from '@heroicons/react/solid/XIcon';
import clsx from 'clsx';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { sendEventTracker } from '@/utils/analytics/tracker';

import { SectionTitle } from '../Typography/SectionTitle';

import { ThemeContext, THEMES, Theme } from './ThemeProvider';

const ThemeColors = ({ theme }: { theme: Theme }) => {
  return (
    <div className="flex -space-x-2" data-theme={theme}>
      <div
        className={clsx(
          'rounded-full border-2 border-slate-800/50 w-8 h-8',
          css`
            background: ${getHslaColor('primary')};
          `,
        )}
      />
      <div
        className={clsx(
          'rounded-full border-2 border-slate-800/50 w-8 h-8',
          css`
            background: ${getHslaColor('secondary')};
          `,
        )}
      />
      <div
        className={clsx(
          'rounded-full border-2 border-slate-800/50 w-8 h-8',
          css`
            background: ${getHslaColor('tertiary')};
          `,
        )}
      />
      <div
        className={clsx(
          'rounded-full border-2 border-slate-800/50 w-8 h-8',
          css`
            background: ${getHslaColor('bg')};
          `,
        )}
      />
      <div
        className={clsx(
          'rounded-full border-2 border-slate-800/50 w-8 h-8',
          css`
            background: ${getHslaColor('text')};
          `,
        )}
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
              'overflow-y-auto',
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
                      'py-8 px-4',
                      'flex-1 flex flex-col items-center justify-center space-y-4',
                      'rounded-lg',
                      'transform hover:scale-105 focus:scale:105 transition-transform duration-100',
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
                    <span className="first-letter:capitalize">
                      {t.replace(/-/g, ' ')}
                    </span>

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
