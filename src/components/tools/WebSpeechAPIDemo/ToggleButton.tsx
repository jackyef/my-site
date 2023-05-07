import { useRef, useState } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { Button } from './Button';

const MAX_RIPPLE_SCALE = 2;
const MIN_RIPPLE_SCALE = 0.85;

const getRippleScale = (percentage: number) => {
  return (1 - percentage) * MIN_RIPPLE_SCALE + percentage * MAX_RIPPLE_SCALE;
};

type Params = {
  isEnabled: boolean;
  onToggle: () => void;
};

export const ToggleButton = ({ isEnabled, onToggle }: Params) => {
  const [volume, setVolume] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recorderRef = useRef<MediaRecorder | null>();

  const analyze = (stream: MediaStream) => {
    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    const source = context.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    source.connect(analyzer);

    const report = () => {
      analyzer.getByteFrequencyData(dataArray);

      const VOLUME = Math.floor((Math.max(...dataArray) / 255) * 100);

      setVolume(VOLUME);

      if (recorderRef.current) {
        requestAnimationFrame(report);
      } else {
        context.close();
        setVolume(0);
      }
    };

    report();
  };

  const record = () => {
    const toggleRecording = async () => {
      let recorder = recorderRef.current;

      if (!recorder) {
        const audioNode = audioRef.current;

        if (!audioNode) return;
        // Reset the audio tag
        audioNode.removeAttribute('src');
        const blobChunks: BlobPart[] = [];
        const mediaStream = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        recorderRef.current = new MediaRecorder(mediaStream);

        recorder = recorderRef.current;
        recorder.ondataavailable = (event) => {
          // Create the blob and show an audio element
          blobChunks.push(event.data);
          const audioBlob = new Blob(blobChunks, { type: 'audio/mp3' });
          audioNode.setAttribute('src', window.URL.createObjectURL(audioBlob));
          // Tear down after recording.
          recorder?.stream.getTracks().forEach((t) => t.stop());
          recorderRef.current = null;
        };
        recorderRef.current?.start();
        analyze(recorderRef.current.stream);
      } else {
        recorderRef.current?.stop();
      }
    };
    toggleRecording();
  };

  return (
    <>
      <audio ref={audioRef} />
      <Button
        isEnabled={isEnabled}
        aria-label={isEnabled ? 'Stop' : 'Start'}
        onClick={() => {
          onToggle();
          record();
        }}
      >
        {isEnabled ? <StopIcon height="72px" /> : <PlayIcon height="72px" />}

        {/* Ripple effect as the microphone pick up sounds */}
        {isEnabled && (
          <span
            className={css`
              display: block;
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 2px solid;
              border-color: ${getHslaColor('secondary', 0.6)};
              transform: scale(${getRippleScale(volume / 100)});
              transition: transform 50ms;
            `}
          />
        )}
      </Button>
    </>
  );
};
