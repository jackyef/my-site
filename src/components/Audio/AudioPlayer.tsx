import React, { useEffect, useRef, useState } from 'react';

import { ControlsContainer } from './ControlsContainer';
import { PlayerContainer } from './PlayerContainer';
import { PlayerTitle } from './PlayerTitle';
import { PlayPauseButton } from './PlayPauseButton';
import { TimeInformation } from './TimeInformation';
import { Track } from './Track';

export type Props = Omit<React.HTMLProps<HTMLAudioElement>, 'controls'> & {
  title: string;
};

/**
 * A wrapper for the native <audio> element with our own UI controls implementation
 */
export const AudioPlayer = ({ title, ...props }: Props) => {
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
      <PlayerContainer>
        <PlayerTitle title={title} />
        <ControlsContainer>
          <PlayPauseButton
            isPlaying={isPlaying}
            onPause={() => audioRef.current?.pause()}
            onPlay={() => audioRef.current?.play()}
          />
          <Track currentTime={currentTime} duration={duration} />
          <TimeInformation currentTime={currentTime} duration={duration} />
        </ControlsContainer>
      </PlayerContainer>
    </>
  );
};
