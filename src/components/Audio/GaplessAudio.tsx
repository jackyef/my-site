import { useEffect, useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import { secondsToMMSS } from './helpers';

interface Props {
  src: string;
  title: string;
}

export const GaplessAudio = ({ src, title }: Props) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const initializeAudioContext = async () => {
    setIsLoading(true);

    const audioCtx = new window.AudioContext();

    try {
      const source = audioCtx.createBufferSource();

      const arrayBuffer = await fetch(src).then((res) => res.arrayBuffer());
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const gainNode = audioCtx.createGain();

      source.buffer = audioBuffer;
      source.loop = true;

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      source.start();

      setAudioContext(audioCtx);
      setDuration(Math.floor(audioBuffer.duration));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Close audioContext if it changed
    return () => {
      audioContext?.close?.();
    };
  }, [audioContext]);

  useEffect(() => {
    if (!audioContext || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(Math.floor(audioContext.currentTime % duration));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, audioContext, duration]);

  return (
    <div className="bg-theme-backgroundOffset rounded-md px-4 py-2">
      <h5 className="mb-2 font-semibold">
        {title}
        <span className="italic text-sm font-light">
          {isLoading ? ' (loading audio file...)' : ''}
        </span>
      </h5>
      <div className="flex space-x-4 px-2">
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
          onClick={() => {
            if (isPlaying) {
              audioContext?.suspend();
            } else {
              if (audioContext) {
                audioContext?.resume();
              } else {
                initializeAudioContext();
              }
            }
            setIsPlaying((prev) => !prev);
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className="flex flex-1 items-center">
          <ProgressBar value={(currentTime / duration) * 100} />
        </div>
        <div>
          {secondsToMMSS(currentTime)} / {secondsToMMSS(duration)}
        </div>
      </div>
    </div>
  );
};
