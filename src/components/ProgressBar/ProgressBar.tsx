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
      className="overflow-hidden h-2 text-xs flex w-full rounded bg-(--color-bg-hover)"
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
          'shadow-none flex flex-col',
          'text-center whitespace-nowrap text-white',
          'justify-center',
          'bg-(--color-accent)',
          indeterminate && 'animate-[progress-shuffle_3s_both_infinite]',
        )}
      />
    </div>
  );
};
