import clsx from 'clsx';
import { css } from 'goober';
import { MutableRefObject, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

import { getMonthDifference, TODAY } from '@/lib/datetime';

import { isInViewport } from '@/utils/dom/isInViewport';

import { useTimelineContext } from './hooks';

export type BaseEvent = {
  from: Date;
  to: Date;
  title: string;
  description: string;
  variant:
    | 'amber'
    | 'green'
    | 'blue'
    | 'slate'
    | 'violet'
    | 'red'
    | 'fuchsia'
    | 'sky'
    | 'teal';
};

export type Props = BaseEvent & {
  id: string;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
  onScrollTrigger?: () => void;
};

export const TimelineEvent = ({
  id,
  index,
  isActive = false,
  from,
  to,
  title,
  description,
  variant,
  onClick,
  onScrollTrigger,
}: Props) => {
  const {
    containerRef,
    totalMonths: totalTimelineMonths,
    activeEventIndex,
    isScrollTriggerEnabled,
  } = useTimelineContext();
  const ref = useRef<HTMLLIElement>(null);
  const startingPosition = getMonthDifference(to, TODAY);
  const totalMonths = getMonthDifference(from, to) + 1;
  const prevScrollYProgress = useRef(0);

  const shouldBeActiveAt = startingPosition / totalTimelineMonths;
  const { scrollYProgress } = useScroll({
    container: containerRef as MutableRefObject<HTMLDivElement>,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (
      isScrollTriggerEnabled &&
      latest >= shouldBeActiveAt &&
      typeof onScrollTrigger === 'function'
    ) {
      const scrollDirection =
        latest > prevScrollYProgress.current ? 'down' : 'up';

      if (
        (scrollDirection === 'down' && index > Number(activeEventIndex)) ||
        (scrollDirection === 'up' && index < Number(activeEventIndex))
      ) {
        if (isInViewport(ref.current as HTMLElement)) {
          onScrollTrigger();
        }
      }
    }

    prevScrollYProgress.current = latest;
  });

  const handleClick = () => {
    if (ref.current && containerRef?.current) {
      const container = containerRef.current as HTMLElement;
      const listItem = ref.current as HTMLElement;
      const listItemTop = listItem.offsetTop;

      // Scroll the container to show the list item
      container.scrollTo({ top: listItemTop - 56, behavior: 'smooth' });
    }

    onClick?.();
  };

  return (
    <li
      ref={ref}
      className={clsx(
        'relative mt-px flex',
        css`
          scroll-margin-top: 3.5rem;
          scroll-padding-top: 3.5rem;
          filter: var(--filter-brightness);
        `,
      )}
      style={{ gridRow: `${startingPosition + 1} / span ${totalMonths}` }}
    >
      <button
        id={id}
        onClick={handleClick}
        className={clsx(
          'absolute flex justify-start items-start text-left inset-1 rounded-lg p-2',
          'text-xs leading-5 bg-opacity-90',
          css`
            transition: background-color 0.2s ease-in-out,
              left 0.2s ease-in 0.25s;
          `,
          {
            'bg-slate-50 hover:bg-slate-100': !isActive && variant === 'slate',
            'bg-violet-50 hover:bg-violet-100':
              !isActive && variant === 'violet',
            'bg-red-50 hover:bg-red-100': !isActive && variant === 'red',
            'bg-blue-50 hover:bg-blue-100': !isActive && variant === 'blue',
            'bg-green-50 hover:bg-green-100': !isActive && variant === 'green',
            'bg-amber-50 hover:bg-amber-100': !isActive && variant === 'amber',
            'bg-fuchsia-50 hover:bg-fuchsia-100':
              !isActive && variant === 'fuchsia',
            'bg-sky-50 hover:bg-sky-100': !isActive && variant === 'sky',
            'bg-teal-50 hover:bg-teal-100': !isActive && variant === 'teal',
          },
          {
            'left-4': isActive,
            'bg-slate-100': isActive && variant === 'slate',
            'bg-violet-100': isActive && variant === 'violet',
            'bg-red-100': isActive && variant === 'red',
            'bg-blue-100': isActive && variant === 'blue',
            'bg-green-100': isActive && variant === 'green',
            'bg-amber-100': isActive && variant === 'amber',
            'bg-fuchsia-100': isActive && variant === 'fuchsia',
            'bg-sky-100': isActive && variant === 'sky',
            'bg-teal-100': isActive && variant === 'teal',
          },
        )}
      >
        <motion.div
          className={clsx('sticky top-4 group flex flex-col', 'block', {
            'text-slate-700': variant === 'slate',
            'text-violet-700': variant === 'violet',
            'text-red-700': variant === 'red',
            'text-blue-700': variant === 'blue',
            'text-green-700': variant === 'green',
            'text-amber-700': variant === 'amber',
            'text-fuchsia-700': variant === 'fuchsia',
            'text-sky-700': variant === 'sky',
            'text-teal-700': variant === 'teal',
          })}
        >
          <span className={clsx('font-semibold block')}>{title}</span>
          <span className={clsx('block')}>{description}</span>
        </motion.div>
      </button>
    </li>
  );
};
