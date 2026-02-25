import { CSSProperties, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import { cn } from '@/utils/styles/classNames';

import { AmbientGlow } from './components/AmbientGlow';
import { ButtonHints } from './components/ButtonHints';
import { AboutScreen } from './screens/AboutScreen';
import { BlogScreen } from './screens/BlogScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PostReaderScreen } from './screens/PostReaderScreen';
import { useBigPictureContext } from './hooks/useBigPictureContext';
import { useControllerNavigation } from './hooks/useControllerNavigation';
import type { BPScreen } from './types';

const ScreenComponent = ({ screen }: { screen: BPScreen }) => {
  switch (screen.id) {
    case 'blog':
      return <BlogScreen />;
    case 'post':
      return <PostReaderScreen slug={screen.slug} />;
    case 'about':
      return <AboutScreen />;
    default:
      return <HomeScreen />;
  }
};

const TopBar = () => {
  const { screenStack, pop } = useBigPictureContext();
  const canGoBack = screenStack.length > 1;

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'px-6 py-4',
        'border-b border-white/10',
        'shrink-0',
      )}
    >
      <div className="w-24">
        {canGoBack ? (
          <button
            onClick={pop}
            className={cn(
              'bp-focusable',
              'flex items-center gap-1.5',
              'text-white/60 hover:text-white',
              'text-sm font-medium',
              'transition-colors',
              'outline-none focus:text-white',
              'rounded px-2 py-1 focus:bg-white/10',
            )}
            data-bp-row="topbar"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white/80 text-base font-semibold tracking-wide">
          jackyef.com
        </span>
        <span className="text-white/20 text-sm">Big Picture</span>
      </div>

      <div className="w-24 flex justify-end">
        {/* "Exit" at the root level — calls pop() which triggers onExit */}
        <button
          onClick={pop}
          className={cn(
            'bp-focusable',
            'flex items-center gap-1.5',
            'text-white/60 hover:text-white',
            'text-sm font-medium',
            'transition-colors',
            'outline-none focus:text-white',
            'rounded px-2 py-1 focus:bg-white/10',
          )}
          data-bp-row="topbar"
        >
          <span>✕</span>
          <span>{screenStack.length > 1 ? 'Close' : 'Exit'}</span>
        </button>
      </div>
    </div>
  );
};

interface Props {
  onNavigate: () => void;
  onSelect: () => void;
  onBack: () => void;
}

export const BigPictureShell = ({ onNavigate, onSelect, onBack }: Props) => {
  const { currentScreen } = useBigPictureContext();
  const prefersReducedMotion = useReduceMotion();

  useControllerNavigation({ onNavigate, onBack });

  // Single source of truth for click sounds — covers mouse, keyboard Enter,
  // and gamepad A (which calls .click() on the focused element).
  // TopBar buttons have data-bp-row="topbar" → back sound; all others → select.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const focusable = target.closest<HTMLElement>('.bp-focusable');
      if (!focusable) return;
      if (focusable.dataset.bpRow === 'topbar') {
        onBack();
      } else {
        onSelect();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onSelect, onBack]);

  // Focus first focusable element when screen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const first = document.querySelector<HTMLElement>('.bp-focusable');
      first?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  const screenKey =
    currentScreen.id === 'post'
      ? `post-${(currentScreen as { id: 'post'; slug: string }).slug}`
      : currentScreen.id;

  return (
    // Not position:fixed — fills the parent fixed container from BigPicturePage
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AmbientGlow
        currentScreen={currentScreen}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <TopBar />

        <div
          data-theme="dark"
          style={
            {
              '--color-bg':
                'hsla(var(--h-bg) var(--s-bg) var(--l-bg) / var(--bg-opacity))',
              '--color-heading':
                'hsla(var(--h-heading) var(--s-heading) var(--l-heading) / var(--bg-opacity))',
              '--color-text':
                'hsla(var(--h-text) var(--s-text) var(--l-text) / var(--bg-opacity))',
              '--color-subtitle':
                'hsla(var(--h-subtitle) var(--s-subtitle) var(--l-subtitle) / var(--bg-opacity))',
            } as CSSProperties
          }
          className="flex-1 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screenKey}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ScreenComponent screen={currentScreen} />
            </motion.div>
          </AnimatePresence>
        </div>

        <ButtonHints />
      </div>
    </div>
  );
};
