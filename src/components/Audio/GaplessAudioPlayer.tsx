import { useEffect, useRef, useState } from 'react';

import { ControlsContainer } from './ControlsContainer';
import { PlayerContainer } from './PlayerContainer';
import { PlayerTitle } from './PlayerTitle';
import { PlayPauseButton } from './PlayPauseButton';
import { TimeInformation } from './TimeInformation';
import { Track } from './Track';

export interface Props {
  src: string;
  title: string;
}

export const GaplessAudioPlayer = ({ src, title }: Props) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioLoadTimeRef = useRef(0);

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

    if (!audioLoadTimeRef.current) {
      audioLoadTimeRef.current = Math.round(audioContext.currentTime);
    }

    const interval = setInterval(() => {
      setCurrentTime(
        Math.floor(
          (audioContext.currentTime - audioLoadTimeRef.current) % duration,
        ),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, audioContext, duration]);

  return (
    <PlayerContainer>
      <PlayerTitle
        title={title}
        subtitle={isLoading ? '(loading audio file...)' : undefined}
      />
      <ControlsContainer>
        <PlayPauseButton
          isPlaying={isPlaying}
          isDisabled={isLoading}
          onPause={() => {
            audioContext?.suspend();
            setIsPlaying((prev) => !prev);
          }}
          onPlay={() => {
            if (isLoading) return;

            if (audioContext) {
              audioContext?.resume();
            } else {
              initializeAudioContext();
            }

            setIsPlaying((prev) => !prev);
          }}
        />
        <Track
          currentTime={currentTime}
          duration={duration}
          isLoading={isLoading}
        />
        <TimeInformation currentTime={currentTime} duration={duration} />
      </ControlsContainer>
    </PlayerContainer>
  );
};
