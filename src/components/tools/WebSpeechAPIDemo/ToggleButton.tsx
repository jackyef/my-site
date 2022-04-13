import { useRef, useState } from 'react';
import StopIcon from '@heroicons/react/solid/StopIcon';
import PlayIcon from '@heroicons/react/solid/PlayIcon';

import { Button } from './Button';
import { css } from 'goober';

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

  const ANALYSE = (stream: MediaStream) => {
    const CONTEXT = new AudioContext();
    const ANALYSER = CONTEXT.createAnalyser();
    const SOURCE = CONTEXT.createMediaStreamSource(stream);
    const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount);
    SOURCE.connect(ANALYSER);
    const REPORT = () => {
      ANALYSER.getByteFrequencyData(DATA_ARR);
      const VOLUME = Math.floor((Math.max(...DATA_ARR) / 255) * 100);
      setVolume(VOLUME);
      if (recorderRef.current) requestAnimationFrame(REPORT);
      else {
        CONTEXT.close();
        setVolume(0);
      }
    };
    REPORT();
  };

  const RECORD = () => {
    const toggleRecording = async () => {
      let recorder = recorderRef.current;

      if (!recorder) {
        const audioNode = audioRef.current;

        if (!audioNode) return;
        // Reset the audio tag
        audioNode.removeAttribute('src');
        const CHUNKS: BlobPart[] = [];
        const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        recorderRef.current = new MediaRecorder(MEDIA_STREAM);

        recorder = recorderRef.current;
        recorder.ondataavailable = (event) => {
          // Update the UI
          // TOGGLE.innerText = 'Start Recording';
          // Create the blob and show an audio element
          CHUNKS.push(event.data);
          const AUDIO_BLOB = new Blob(CHUNKS, { type: 'audio/mp3' });
          audioNode.setAttribute('src', window.URL.createObjectURL(AUDIO_BLOB));
          // Tear down after recording.
          recorder?.stream.getTracks().forEach((t) => t.stop());
          recorderRef.current = null;
        };
        // TOGGLE.innerText = 'Stop Recording';
        recorderRef.current?.start();
        ANALYSE(recorderRef.current.stream);
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
          RECORD();
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
              border-color: rgba(var(--rgb-secondary), 0.6);
              transform: scale(${getRippleScale(volume / 100)});
              transition: transform 50ms;
            `}
          />
        )}
      </Button>
    </>
  );
};
