import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { formatDate, TODAY } from '@/lib/datetime';

import { cn } from '@/utils/styles/classNames';
import { debounce } from '@/utils/debounce';

import { Timeline, TimelineEvent } from '../Timeline';
import { SkipSSR } from '../SkipSSR';

import { timelineEvents } from './constants';
import { AsideEmptyState } from './AsideEmptyState';
import { AsideHeading } from './AsideHeading';
import { AsideContainer } from './AsideContainer';
import { Alert } from './components/Alert';

export const HistoryCalendar = () => {
  const prevActiveIndex = useRef<number | null>(null);
  const detailsContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollTriggerEnabled, setIsScrollTriggerEnabled] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const activeEvent = timelineEvents[activeEventIndex];
  const uniqueId = `jobHistoryCalendar`;

  const changeDirection =
    (prevActiveIndex?.current ?? 0) > activeEventIndex ? 'left' : 'right';

  prevActiveIndex.current = activeEventIndex;

  const handleActiveIndexChange = useMemo(
    () =>
      debounce((index: number) => {
        setActiveEventIndex(index);
      }, 50),
    [],
  );

  const handleEventClick = (index: number) => {
    (
      document.querySelector(`#${uniqueId}-${index}`) as HTMLButtonElement
    )?.click();
  };

  useEffect(() => {
    if (detailsContainerRef.current) {
      detailsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [activeEventIndex]);

  return (
    <section className="flex h-[80vh] md:h-[560px] flex-col">
      <header className="flex flex-none items-center justify-between border-b border-(--color-border) px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-6 text-(--color-ink)">
            Professional history
          </h1>
          <p className="mt-1 text-sm text-(--color-ink-3)">
            Today is{' '}
            <time dateTime={TODAY.toDateString()}>
              <SkipSSR>{formatDate(TODAY)}</SkipSSR>
            </time>
          </p>
        </div>
      </header>

      <div className="isolate flex flex-auto flex-col md:flex-row overflow-hidden bg-(--color-bg-panel) shadow-(--shadow-lg) rounded-2xl">
        <Timeline
          // Start our story from 2017
          timelineBeginning={new Date('2017-01-01')}
          activeEventIndex={activeEventIndex}
          isScrollTriggerEnabled={isScrollTriggerEnabled}
        >
          {timelineEvents.map((event, index) => {
            return (
              <TimelineEvent
                key={event.title}
                id={`${uniqueId}-${index}`}
                index={index}
                title={event.title}
                description={event.description}
                from={event.from}
                to={event.to}
                variant={event.variant}
                onScrollTrigger={() => {
                  handleActiveIndexChange(index);
                }}
                onClick={() => {
                  // Stop scroll triggered event once user
                  // started navigating manually
                  setIsScrollTriggerEnabled(false);
                  setActiveEventIndex(index);
                }}
                isActive={activeEvent === event}
              />
            );
          })}
        </Timeline>

        {/* Expanded */}
        <div
          ref={detailsContainerRef}
          className={cn(
            'block w-full flex-1 border-l border-(--color-border) md:block',
            'overflow-x-hidden overflow-y-scroll',
          )}
        >
          <AsideContainer>
            {!activeEvent ? (
              <AsideEmptyState />
            ) : (
              <>
                <AsideHeading
                  event={activeEvent}
                  // Prev and Next is actually a bit confusing here,
                  // as we are moving from present to past
                  // We want to keep the concept as follow:
                  // - Next means going to the present
                  // - Prev means going to the past
                  onNextClick={() => {
                    // Stop scroll triggered event once user
                    // started navigating manually
                    setIsScrollTriggerEnabled(false);
                    handleEventClick(activeEventIndex - 1);
                  }}
                  onPrevClick={() => {
                    setIsScrollTriggerEnabled(false);
                    handleEventClick(activeEventIndex + 1);
                  }}
                  hasPrev={activeEventIndex < timelineEvents.length - 1}
                  hasNext={activeEventIndex > 0 && timelineEvents.length > 1}
                />

                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeEventIndex}
                    initial={{
                      opacity: 0,
                      x: changeDirection === 'right' ? '-5%' : '5%',
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: changeDirection === 'right' ? '5%' : '-5%',
                    }}
                    transition={{
                      x: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                    }}
                    className="px-8 text-sm space-y-2"
                  >
                    <div className="mb-4">
                      <Alert
                        variant={activeEvent.variant}
                        title={activeEvent.title}
                        description={activeEvent.description}
                      />
                    </div>
                    {activeEvent?.details || (
                      <p>Not much too say yet, stay tuned! 👀</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </AsideContainer>
        </div>
      </div>
    </section>
  );
};
