import { secondsToMMSS } from './helpers';

interface Props {
  currentTime: number;
  duration: number;
}

export const TimeInformation = ({ currentTime, duration }: Props) => {
  return (
    <div className="w-24 text-right">
      {secondsToMMSS(currentTime)} / {secondsToMMSS(duration)}
    </div>
  );
};
