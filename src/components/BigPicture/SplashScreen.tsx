import { useCallback, useEffect, useRef, useState } from 'react';

import type { SplashPhase } from './types';

const PHASE_DURATIONS: Record<Exclude<SplashPhase, 'done'>, number> = {
  boot: 900,
  loading: 1600,
  scanline: 550,
};

const TITLE = 'BIG PICTURE';
const SUBTITLE = 'jackyef.com';

interface Props {
  onDone: () => void;
  prefersReducedMotion: boolean;
  playStartupSound: () => void;
}

export const SplashScreen = ({
  onDone,
  prefersReducedMotion,
  playStartupSound,
}: Props) => {
  const [phase, setPhase] = useState<SplashPhase>('boot');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const loadingStartRef = useRef<number | null>(null);

  const advance = useCallback((nextPhase: SplashPhase) => {
    timerRef.current = setTimeout(() => setPhase(nextPhase), 0);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      onDone();
      return;
    }

    if (phase === 'boot') {
      playStartupSound();
      timerRef.current = setTimeout(
        () => setPhase('loading'),
        PHASE_DURATIONS.boot,
      );
    } else if (phase === 'loading') {
      loadingStartRef.current = performance.now();
      const duration = PHASE_DURATIONS.loading;

      const tick = (now: number) => {
        const elapsed = now - (loadingStartRef.current ?? now);
        setLoadingProgress(Math.min(elapsed / duration, 1));
        if (elapsed < duration) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);

      timerRef.current = setTimeout(
        () => setPhase('scanline'),
        PHASE_DURATIONS.loading,
      );
    } else if (phase === 'scanline') {
      timerRef.current = setTimeout(() => {
        setPhase('done');
        onDone();
      }, PHASE_DURATIONS.scanline);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, onDone, prefersReducedMotion, playStartupSound, advance]);

  if (phase === 'done') return null;

  const showTitle = phase !== 'boot';
  const showLoading = phase === 'loading' || phase === 'scanline';
  const isExiting = phase === 'scanline';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: '#050510',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Clip-path wipe: splash folds up as content reveals below
        clipPath: isExiting ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)',
        transition: isExiting
          ? `clip-path ${PHASE_DURATIONS.scanline}ms cubic-bezier(0.4, 0, 0.2, 1)`
          : 'none',
      }}
    >
      {/* CRT scanline texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content stack */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Glow orb behind icon */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)',
              opacity: phase === 'boot' ? 1 : 0.6,
              transform: phase === 'boot' ? 'scale(1)' : 'scale(1.3)',
              transition: 'opacity 1.2s ease, transform 1.2s ease',
            }}
          />
          {/* Controller icon */}
          <div
            style={{
              fontSize: '5rem',
              filter:
                'drop-shadow(0 0 20px rgba(99,102,241,0.9)) drop-shadow(0 0 40px rgba(99,102,241,0.4))',
              opacity: phase === 'boot' ? 1 : 0.9,
              transform: phase === 'boot' ? 'scale(1)' : 'scale(0.85)',
              transition: 'transform 1s ease, opacity 1s ease',
              lineHeight: 1,
            }}
          >
            🎮
          </div>
        </div>

        {/* Title — letter-by-letter reveal */}
        <div
          style={{
            display: 'flex',
            gap: '0.08em',
            overflow: 'hidden',
          }}
        >
          {TITLE.split('').map((char, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: '#ffffff',
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                fontFamily: 'system-ui, sans-serif',
                opacity: showTitle ? 1 : 0,
                transform: showTitle ? 'translateY(0)' : 'translateY(12px)',
                transition: showTitle
                  ? `opacity 0.3s ease ${i * 0.04}s, transform 0.3s ease ${
                      i * 0.04
                    }s`
                  : 'none',
                width: char === ' ' ? '0.6em' : undefined,
                textShadow: '0 0 24px rgba(99,102,241,0.6)',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: '-1rem',
            opacity: showTitle ? 0.45 : 0,
            transition: 'opacity 0.6s ease 0.5s',
            color: '#e2e8f0',
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {SUBTITLE}
        </div>

        {/* Loading bar */}
        <div
          style={{
            width: '280px',
            height: '2px',
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            opacity: showLoading ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadingProgress * 100}%`,
              background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(99,102,241,0.6)',
            }}
          />
        </div>

        {/* Loading dots */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            opacity: showLoading ? 1 : 0,
            transition: 'opacity 0.3s ease 0.2s',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.4)',
                animation: `bp-dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Dot pulse keyframe */}
      <style>{`
        @keyframes bp-dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};
