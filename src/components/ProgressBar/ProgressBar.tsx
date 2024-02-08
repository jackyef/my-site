import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

const INDETERMINATE_BAR_WIDTH = 30;

interface Props {
  value?: number;
  indeterminate?: boolean;
}

type ProgressBarAriaProps = {
  'aria-valuemax': number;
  'aria-valuemin': number;
  'aria-valuenow'?: number;
};

export const ProgressBar = ({ value = 0, indeterminate = false }: Props) => {
  const ariaProps: ProgressBarAriaProps = {
    'aria-valuemax': 100,
    'aria-valuemin': 0,
  };

  if (!indeterminate) {
    ariaProps['aria-valuenow'] = value || 0;
  }

  return (
    <div
      className="overflow-hidden h-2 text-xs flex w-full rounded bg-surface-1"
      role="progressbar"
      style={{
        // We are not transforming this element,
        // but omitting this will cause overflow: hidden to not work properly in safari
        willChange: 'transform',
      }}
      {...ariaProps}
    >
      <div
        style={{
          width: !indeterminate
            ? `${value || 0}%`
            : `${INDETERMINATE_BAR_WIDTH}%`,
          willChange: 'width, transform',
        }}
        className={cn(
          `progressBar shadow-none flex flex-col`,
          `text-center whitespace-nowrap text-white`,
          `justify-center`,
          indeterminate,
          css`
            background: ${getHslaColor('primary')};
          `,
        )}
      />
      <style jsx>{`
        @keyframes shuffling {
          0% {
            transform: translateX(0);
          }
          50% {
            /**
              * %-value in transforms refers to the element's own width/height,
              * instead of the parent element's like top/left does.
              *
              * Since we define the bar's width ourselves, we can calculate
              * how much we need to translate it to reach the end of the bar container.
              */
            transform: translateX(
              ${(100 / INDETERMINATE_BAR_WIDTH - 1) * 100}%
            );
          }
          100% {
            transform: translateX(0);
          }
        }

        .progressBar.indeterminate {
          animation: shuffling infinite 3s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};
