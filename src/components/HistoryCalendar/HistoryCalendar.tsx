import { useState } from 'react';

import { formatDate, TODAY } from '@/lib/datetime';

import { Timeline, TimelineEvent } from '../Timeline';

import { timelineEvents } from './constants';
import { AsideEmptyState } from './AsideEmptyState';
import { AsideHeading } from './AsideHeading';
import { AsideContainer } from './AsideContainer';

export const HistoryCalendar = () => {
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const activeEvent = timelineEvents[activeEventIndex];
  const uniqueId = `jobHistoryCalendar`;

  const handleEventClick = (index: number) => {
    (
      document.querySelector(`#${uniqueId}-${index}`) as HTMLButtonElement
    )?.click();
  };

  return (
    <section className="flex h-[560px] flex-col">
      <header className="flex flex-none items-center justify-between border-b border-surface-3 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-6 text-theme-heading">
            Professional history
          </h1>
          <p className="mt-1 text-sm text-theme-subtitle">
            Today is {formatDate(TODAY)}
          </p>
        </div>
      </header>

      <div className="isolate flex flex-auto overflow-hidden bg-surface-5 shadow-surface-5 rounded-2xl">
        <Timeline
          // Start our story from 2017
          timelineBeginning={new Date('2017-01-01')}
        >
          {timelineEvents.map((event, index) => {
            return (
              <TimelineEvent
                key={event.title}
                id={`${uniqueId}-${index}`}
                title={event.title}
                description={event.description}
                from={event.from}
                to={event.to}
                variant={event.variant}
                onClick={() => setActiveEventIndex(index)}
                isActive={activeEvent === event}
              />
            );
          })}
        </Timeline>

        {/* Expanded */}
        <div className="hidden w-1/2 max-w-md flex-none border-l border-surface-1  md:block overflow-y-scroll">
          <AsideContainer>
            {!activeEvent ? (
              <AsideEmptyState />
            ) : (
              <>
                <AsideHeading
                  event={activeEvent}
                  onNextClick={() => {
                    handleEventClick(activeEventIndex + 1);
                  }}
                  onPrevClick={() => {
                    handleEventClick(activeEventIndex - 1);
                  }}
                  hasNext={activeEventIndex < timelineEvents.length - 1}
                  hasPrev={activeEventIndex > 0 && timelineEvents.length > 1}
                />

                <div className="px-8 text-sm space-y-2">
                  {activeEvent.details || (
                    <p>This event has no details in it 😢</p>
                  )}
                </div>
              </>
            )}
          </AsideContainer>
        </div>
      </div>
    </section>
  );
};
