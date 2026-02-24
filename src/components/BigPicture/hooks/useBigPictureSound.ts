import { useCallback, useRef } from 'react';

type SoundType = 'navigate' | 'select' | 'back' | 'startup';

const createAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  } catch {
    return null;
  }
};

const playTone = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainVal = 0.08,
  type: OscillatorType = 'sine',
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const useBigPictureSound = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current) ctxRef.current = createAudioContext();
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const playNavigate = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 440, t, 0.07, 0.06, 'sine');
    playTone(ctx, 520, t, 0.05, 0.03, 'sine');
  }, [getCtx]);

  const playSelect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 523.25, t, 0.12, 0.08, 'triangle');
    playTone(ctx, 783.99, t + 0.06, 0.14, 0.07, 'triangle');
  }, [getCtx]);

  const playBack = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(220, t + 0.1);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.12);
  }, [getCtx]);

  const playStartup = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    // C major arpeggio: C4 E4 G4 C5, then a final sustaining chord
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.18;
      playTone(ctx, freq, t, 0.5, 0.1, 'sine');
      // Add subtle second harmonic for richness
      playTone(ctx, freq * 2, t, 0.3, 0.03, 'sine');
    });
    // Final chord at the end — all notes together
    const finalT = ctx.currentTime + notes.length * 0.18;
    notes.forEach((freq) => {
      playTone(ctx, freq, finalT, 0.8, 0.06, 'sine');
    });
  }, [getCtx]);

  const play = useCallback(
    (type: SoundType) => {
      switch (type) {
        case 'navigate':
          playNavigate();
          break;
        case 'select':
          playSelect();
          break;
        case 'back':
          playBack();
          break;
        case 'startup':
          playStartup();
          break;
      }
    },
    [playNavigate, playSelect, playBack, playStartup],
  );

  return { play };
};
