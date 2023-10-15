import { css, keyframes } from 'goober';

import { cn } from '@/lib/classNames';

type Props = {
  children?: React.ReactNode;
  scrollTimelineName?: string;
  index: number;
  totalItems: number;
};
export const CarouselCardItem = ({
  children,
  scrollTimelineName,
  totalItems,
  index,
}: Props) => {
  const isFirst = index === 0;
  const factor = totalItems - index;
  const stepBackAnimation = keyframes`
    from {
      transform: scale(1);
      filter: brightness(100%);
    }
    
    to {
      transform: scale(${1 - (factor / totalItems) * 0.3});
      filter: brightness(calc(100% - calc(${factor - 1} * 5%)));
    }
  `;

  const stickyCardStackCss = scrollTimelineName
    ? css`
        position: sticky;
        left: ${index * 10}px;
        transform-origin: 0% 75%;
        animation-timeline: --${scrollTimelineName};
        animation-name: ${stepBackAnimation};
        animation-duration: 1ms; /* Firefox requires this to apply the animation */
        animation-direction: normal;
      `
    : undefined;

  return (
    <div
      className={cn(
        stickyCardStackCss,
        'inline-block rounded-md mx-2 mt-4 mb-0 shadow-surface-2',
        'whitespace-normal align-top last:mr-0 md:inline-flex md:flex-col md:self-start md:content-start',
        'max-w-sm scroll-snap-align-start zoom-on-hover-container',
      )}
      style={{
        width: `calc(100% - 1rem * 2)`,
        scrollMargin: isFirst ? `0px 1rem` : undefined,
      }}
    >
      {children}
    </div>
  );
};
