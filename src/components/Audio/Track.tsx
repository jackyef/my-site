import { ProgressBar } from '../ProgressBar';

interface Props {
  currentTime: number;
  duration: number;
  isLoading?: boolean;
}

export const Track = ({ currentTime, duration, isLoading = false }: Props) => {
  return (
    <div className="flex flex-1 items-center">
      <ProgressBar
        value={(currentTime / duration) * 100}
        indeterminate={isLoading}
      />
    </div>
  );
};
