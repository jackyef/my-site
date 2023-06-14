import { createContext, useContext } from 'react';

type TimelineContextAPI = {
  containerRef: React.MutableRefObject<HTMLDivElement | null> | null;
};

export const TimelineContext = createContext<TimelineContextAPI>({
  containerRef: null,
});

export const useTimelineContext = () => useContext(TimelineContext);
