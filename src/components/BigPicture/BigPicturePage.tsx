import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import { BigPictureProvider } from './BigPictureProvider';
import { BigPictureShell } from './BigPictureShell';
import { SplashScreen } from './SplashScreen';
import { useBigPictureSound } from './hooks/useBigPictureSound';

export const BigPicturePage = () => {
  const [splashDone, setSplashDone] = useState(false);
  const prefersReducedMotion = useReduceMotion();
  const router = useRouter();
  const { play } = useBigPictureSound();

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  const handleExit = useCallback(() => {
    router.push('/absurd-ui');
  }, [router]);

  return (
    <div
      // Only dark theme is supported within Big Picture.
      data-theme="dark"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0f',
        overflow: 'hidden',
      }}
    >
      {!splashDone && (
        <SplashScreen
          onDone={handleSplashDone}
          prefersReducedMotion={prefersReducedMotion}
          playStartupSound={() => play('startup')}
        />
      )}

      {/*
       * Provider + Shell are always mounted so React Query stays ready.
       * Shell renders visually only after splash completes.
       */}
      <BigPictureProvider onExit={handleExit}>
        {splashDone && (
          <BigPictureShell
            onNavigate={() => play('navigate')}
            onSelect={() => play('select')}
            onBack={() => play('back')}
          />
        )}
      </BigPictureProvider>
    </div>
  );
};
