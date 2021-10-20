import React, { useEffect, useRef, useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import { secondsToMMSS } from './helpers';

type Props = Omit<React.HTMLProps<HTMLAudioElement>, 'controls'> & {
  title: string;
};

/**
 * A wrapper for the native <audio> element with our own UI controls implementation
 */
export const Audio = ({ title, ...props }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    setDuration(Math.floor(audioElement.duration));

    const playHandler = () => {
      setIsPlaying(true);
    };
    const pauseHandler = () => {
      setIsPlaying(false);
    };
    const timeUpdateHandler = () => {
      setCurrentTime(Math.floor(audioElement.currentTime));
    };
    const durationChangeHandler = () => {
      setDuration(Math.floor(audioElement.duration));
    };
    audioElement.addEventListener('play', playHandler);
    audioElement.addEventListener('pause', pauseHandler);
    audioElement.addEventListener('timeupdate', timeUpdateHandler);
    audioElement.addEventListener('durationchange', durationChangeHandler);

    return () => {
      audioElement.removeEventListener('play', playHandler);
      audioElement.removeEventListener('pause', pauseHandler);
      audioElement.removeEventListener('timeupdate', timeUpdateHandler);
      audioElement.removeEventListener('durationchange', durationChangeHandler);
    };
  }, [props.src]);

  return (
    <>
      <audio ref={audioRef} {...props} />
      <div className="bg-theme-backgroundOffset rounded-md px-4 py-2">
        <h5 className="mb-2 font-semibold">{title}</h5>
        <div className="flex space-x-4 px-2">
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={() => {
              if (isPlaying) {
                audioRef.current?.pause();
              } else {
                audioRef.current?.play();
              }
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
    </>
  );
};
