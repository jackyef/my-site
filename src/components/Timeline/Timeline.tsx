import { useRef } from 'react';
import clsx from 'clsx';
import { css } from 'goober';

import { formatMonth, getMonthDifference, TODAY } from '@/lib/datetime';

import { TimelineContext } from './hooks';

type Props = {
  timelineBeginning: Date;
  activeEventIndex?: number;
  sizePerBlock?: string;
  isScrollTriggerEnabled?: boolean;
  children: React.ReactNode;
};

export const Timeline = ({
  children,
  activeEventIndex,
  timelineBeginning,
  isScrollTriggerEnabled = false,
  sizePerBlock = '3.5rem',
}: Props) => {
  const totalMonths = getMonthDifference(timelineBeginning, TODAY);
  const dates = Array.from({ length: totalMonths }).map((_, index) => {
    const date = new Date(TODAY);
    date.setMonth(date.getMonth() - index);
    return date;
  });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <TimelineContext.Provider
      value={{
        containerRef: ref,
        activeEventIndex,
        totalMonths,
        isScrollTriggerEnabled,
      }}
    >
      <div
        ref={ref}
        className={clsx(
          'flex flex-1 flex-col overflow-auto relative',
          css`
            scroll-behavior: smooth;
          `,
        )}
      >
        <div className="flex w-full flex-auto">
          <div className="w-[80px] flex-none ring-1 ring-slate-500" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            {/* Horizontal lines */}
            <div
              className={clsx(
                'col-start-1 col-end-2 row-start-1 grid divide-y divide-slate-500',
                css`
                  grid-template-rows: repeat(
                    ${totalMonths},
                    minmax(${sizePerBlock}, 1fr)
                  );
                `,
              )}
            >
              <div className="row-end-1 h-7"></div>
              {dates.map((date, index) => {
                return (
                  <div key={index}>
                    <div
                      className={clsx(
                        'sticky left-0 w-[80px] -ml-[80px] px-2',
                        'text-right text-xs leading-5 text-theme-text',
                        'transform -translate-y-[50%]',
                      )}
                    >
                      {formatMonth(
                        date,
                        date.getMonth() === 6 || date.getMonth() === 0,
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Events */}
            <ol
              className={clsx(
                'col-start-1 col-end-2 row-start-1 grid grid-cols-1',
                css`
                  grid-template-rows:
                    calc(${sizePerBlock} / 2) repeat(
                      ${totalMonths},
                      minmax(${sizePerBlock}, 1fr)
                    )
                    auto;
                `,
              )}
            >
              {children}
            </ol>
          </div>
        </div>
      </div>
    </TimelineContext.Provider>
  );
};

Timeline.displayName = 'Timeline';
