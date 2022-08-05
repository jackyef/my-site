import clsx from 'clsx';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';
import { colors, HSLColor } from '@/lib/styles/tokens';

export const Surfaces = () => {
  return (
    <div className={clsx('flex', 'gap-4', 'flex-wrap')}>
      {[0, 1, 2, 3, 4, 5].map((level) => {
        return (
          <div
            key={level}
            className={clsx(
              'w-24 h-24',
              'flex',
              'items-center',
              'justify-center',
              'rounded-lg',
              `bg-surface-${level} shadow-surface-${level}`,
            )}
          >
            surface-{level}
          </div>
        );
      })}
    </div>
  );
};

export const Colors = () => {
  return (
    <div className={clsx('flex', 'gap-4', 'flex-wrap')}>
      {Object.keys(colors).map((colorName) => {
        return (
          <div key={colorName} className="flex flex-col items-center">
            <div
              className={clsx(
                'w-24 h-24',
                'flex',
                'items-center',
                'justify-center',
                'rounded-lg',
                'shadow-surface-0',
                css`
                  background: ${getHslaColor(colorName as HSLColor)};
                `,
              )}
            />
            {colorName}
          </div>
        );
      })}
    </div>
  );
};
