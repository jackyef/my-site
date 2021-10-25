interface Props {
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  isDisabled?: boolean;
}

export const PlayPauseButton = ({
  isPlaying,
  onPause,
  onPlay,
  isDisabled = false,
}: Props) => {
  return (
    <button
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className="px-2"
      disabled={isDisabled}
      onClick={() => {
        if (isPlaying) {
          onPause();
        } else {
          onPlay();
        }
      }}
    >
      {isPlaying ? '⏸️' : '▶️'}
    </button>
  );
};
