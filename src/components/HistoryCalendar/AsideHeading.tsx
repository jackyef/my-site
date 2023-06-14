import { ArrowLeftIcon, ArrowRightIcon, CalendarRangeIcon } from 'lucide-react';
import clsx from 'clsx';

import { formatMonth, TODAY } from '@/lib/datetime';

import { JobHistoryEvent, TIMELINE_START } from './constants';

type Props = {
  event: JobHistoryEvent;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const AsideHeading = ({
  event,
  hasNext,
  hasPrev,
  onNextClick,
  onPrevClick,
}: Props) => {
  const from =
    event.from === TIMELINE_START ? '2013' : formatMonth(event.from, true);
  const to = event.to === TODAY ? 'Present' : formatMonth(event.to, true);

  const headingText = from === to ? from : `${from} – ${to}`;

  return (
    <h2
      className={clsx(
        'flex items-center space-between',
        'sticky top-0 px-8 pt-6 bg-surface-4 pb-4 border-b-2',
        'border-surface-0 text-md font-semibold leading-6 mb-4',
      )}
    >
      <div className="w-6">
        {hasPrev && (
          <button type="button" onClick={onPrevClick}>
            <ArrowLeftIcon className="inline-block w-6 h-6 mr-2 -mt-1" />
          </button>
        )}
      </div>
      <div className="flex-1 flex justify-center">{headingText}</div>

      <div className="w-6">
        {hasNext && (
          <button type="button" onClick={onNextClick}>
            <ArrowRightIcon className="inline-block w-6 h-6 mr-2 -mt-1" />
          </button>
        )}
      </div>
    </h2>
  );
};
