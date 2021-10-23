import { secondsToMMSS } from './helpers';

interface Props {
  currentTime: number;
  duration: number;
}

export const TimeInformation = ({ currentTime, duration }: Props) => {
  return (
    <div>
      {secondsToMMSS(currentTime)} / {secondsToMMSS(duration)}
    </div>
  );
};
