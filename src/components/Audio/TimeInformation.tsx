import { secondsToMMSS } from './helpers';

interface Props {
  currentTime: number;
  duration: number;
}

export const TimeInformation = ({ currentTime, duration }: Props) => {
  return (
    <div className="w-24 text-right text-(--color-ink-3)">
      {secondsToMMSS(currentTime)} / {secondsToMMSS(duration)}
    </div>
  );
};
