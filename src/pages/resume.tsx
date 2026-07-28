import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CalendarDaysIcon,
  GlassesIcon,
  LibraryIcon,
  MailIcon,
  MonitorIcon,
  RotateCcwIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { GetStaticProps } from 'next/types';

import { getFeaturedWritings } from '@/blog/featured';
import { getPosts } from '@/blog/getPosts';
import type { WritingItem } from '@/blog/types';
import { mergeWritings } from '@/blog/writings';
import { Text } from '@/components/common/Text';
import { PageHeader } from '@/components/common/PageHeader';
import { FlatResume } from '@/components/resume/FlatResume';
import { PrintHeader } from '@/components/resume/PrintHeader';
import { ResumeOverlay } from '@/components/resume/ResumeOverlay';
import { SceneErrorBoundary } from '@/components/resume/SceneErrorBoundary';
import { SECTION_TITLES } from '@/components/resume/sections';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import type { SectionId, ViewId } from '@/components/resume/CozyRoom/hotspots';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { cn } from '@/utils/styles/classNames';

const CozyRoomScene = dynamic(() => import('@/components/resume/CozyRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Text variant="caption">Warming up the room…</Text>
    </div>
  ),
});

const HOTSPOT_BUTTONS: Array<{ id: SectionId; icon: React.ReactNode }> = [
  { id: 'about', icon: <GlassesIcon size={14} aria-hidden="true" /> },
  { id: 'career', icon: <CalendarDaysIcon size={14} aria-hidden="true" /> },
  { id: 'projects', icon: <MonitorIcon size={14} aria-hidden="true" /> },
  { id: 'writing', icon: <LibraryIcon size={14} aria-hidden="true" /> },
  { id: 'contact', icon: <MailIcon size={14} aria-hidden="true" /> },
];

const SECTION_IDS = HOTSPOT_BUTTONS.map((button) => button.id);

const viewFromHash = (): ViewId => {
  const hash = window.location.hash.replace('#', '');
  return (SECTION_IDS as string[]).includes(hash)
    ? (hash as ViewId)
    : 'overview';
};

type Props = {
  featuredWritings: WritingItem[];
};

export default function Resume({ featuredWritings }: Props) {
  const [view, setView] = useState<ViewId>('overview');
  const [flatMode, setFlatMode] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [sceneFocused, setSceneFocused] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(true);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReduceMotion();

  // Clicking the desk lamp in the room flips the room's (and site's) lights
  const cycleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dim' : theme === 'dim' ? 'dark' : 'light');
  }, [theme, setTheme]);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setWebglOk(
        Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')),
      );
    } catch {
      setWebglOk(false);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Sections are deep-linkable (/resume#career) and the back button
  // steps out of an open section
  const goToView = useCallback((next: ViewId) => {
    setView(next);
    const url = next === 'overview' ? window.location.pathname : `#${next}`;
    window.history.pushState(null, '', url);
  }, []);

  const closeSection = useCallback(() => goToView('overview'), [goToView]);

  useEffect(() => {
    const syncFromHash = () => setView(viewFromHash());
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  // Stop rendering once the room is scrolled off screen
  useEffect(() => {
    const element = sceneRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [webglOk, flatMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSection();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSection]);

  const showFlat = flatMode || webglOk === false;
  const activeSection = view === 'overview' ? null : view;

  return (
    <>
      <PageMetaTags
        title="Resume | Jacky Efendi"
        description="An interactive resume, set in a cozy little 3D room. Click around to explore my career, projects, and writing."
        image={createOgImageUrl({
          title: 'A cozy little resume',
          description: 'Step into the room and click around to explore.',
        })}
      />

      {showFlat ? (
        <div className="page-pad print-links">
          <PrintHeader />
          <div className="print-hide">
            <PageHeader
              eyebrow="Resume"
              title={
                <>
                  A <em>cozy</em> little resume
                </>
              }
              titleSpacing="mb-4"
            />
          </div>
          <div className="print-hide mb-8 flex items-center gap-3">
            <Text variant="body-sm">
              The quiet, readable version.
              {webglOk !== false && ' Prefer something warmer?'}
            </Text>
            {webglOk !== false && (
              <button
                type="button"
                onClick={() => setFlatMode(false)}
                className="cursor-pointer text-sm font-medium text-(--color-accent-text) hover:underline"
              >
                Step into the room →
              </button>
            )}
          </div>
          <FlatResume writings={featuredWritings} />
        </div>
      ) : (
        <>
          <div className="page-pad print-hide pb-0">
            <PageHeader
              eyebrow="Resume"
              title={
                <>
                  A <em>cozy</em> little resume
                </>
              }
              titleSpacing="mb-2 md:mb-4"
            />
            {/* Keep the scene the star on small screens — one short line */}
            <Text variant="body-sm" className="print-hide md:hidden">
              This room is my resume — tap things to explore, two fingers to
              look around.
            </Text>
            <Text
              variant="body-sm"
              className="print-hide hidden max-w-xl md:block"
            >
              Welcome to my corner of the internet — literally. This room is my
              resume: drag to look around, WASD or the arrow keys to move,
              scroll to zoom — and click on things to explore. The monitors, the
              corkboard, the bookshelf… and that little guy wandering about is
              me — say hi.
            </Text>
          </div>

          {/* Full-bleed so the room gets all the space it deserves.
              Focusable so keyboard users can step into the room and move
              with the arrow keys. */}
          <div
            ref={sceneRef}
            tabIndex={webglOk ? 0 : -1}
            role="group"
            aria-label="Interactive 3D room. Use W A S D or the arrow keys to move the camera."
            onFocus={() => setSceneFocused(true)}
            onBlur={() => setSceneFocused(false)}
            onPointerDown={(event) => {
              // Focus when the canvas itself is clicked, but let the
              // overlay buttons keep their own focus
              if ((event.target as HTMLElement).tagName === 'CANVAS') {
                event.currentTarget.focus();
              }
            }}
            className="print-hide relative mt-2 h-[76vh] min-h-[500px] w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent) md:mt-4 md:h-[80vh]"
          >
            {webglOk && (
              <SceneErrorBoundary onError={() => setWebglOk(false)}>
                <CozyRoomScene
                  view={view}
                  theme={theme}
                  reduceMotion={reduceMotion}
                  desktop={isDesktop}
                  writings={featuredWritings}
                  resetSignal={resetSignal}
                  keyboardFocus={sceneFocused}
                  onSelect={goToView}
                  onClose={closeSection}
                  onCycleTheme={cycleTheme}
                  onContextLost={() => setWebglOk(false)}
                  active={sceneVisible}
                />
              </SceneErrorBoundary>
            )}
            {webglOk && view === 'overview' && (
              <button
                type="button"
                onClick={() => setResetSignal((signal) => signal + 1)}
                className="absolute top-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-3 py-[7px] text-[12px] leading-none font-medium text-(--color-ink-2) shadow-(--shadow-md) transition-[color,border-color,transform] duration-150 hover:-translate-y-px hover:border-(--color-accent) hover:text-(--color-accent-text) active:scale-[0.96]"
              >
                <RotateCcwIcon size={13} aria-hidden="true" />
                Reset view
              </button>
            )}
            {!isDesktop && (
              <ResumeOverlay
                section={activeSection}
                writings={featuredWritings}
                onClose={closeSection}
              />
            )}
          </div>

          <div className="page-pad print-hide pt-4">
            {/* pr clears the floating mobile nav button */}
            <div className="flex flex-wrap items-center gap-2 pr-16 md:pr-0">
              {HOTSPOT_BUTTONS.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() =>
                    goToView(view === button.id ? 'overview' : button.id)
                  }
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-[7px] text-[13px] leading-none font-medium transition-[color,border-color,background-color,transform] duration-150 hover:-translate-y-px active:scale-[0.96]',
                    view === button.id
                      ? 'border-(--color-accent-l) bg-(--color-accent-xl) text-(--color-accent-text)'
                      : 'border-(--color-border-hi) text-(--color-ink-2) hover:border-(--color-accent) hover:text-(--color-accent-text)',
                  )}
                >
                  {button.icon}
                  <span className="leading-none">
                    {SECTION_TITLES[button.id]}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setFlatMode(true)}
                className="ml-auto cursor-pointer text-[13px] font-medium text-(--color-ink-3) hover:text-(--color-ink-2) hover:underline"
              >
                Prefer plain text?
              </button>
            </div>
          </div>

          {/* The whole resume as plain text. Hidden on screen, but it is
              what prints, and what a crawler reads — the 3D panels only
              exist once a section has been opened. */}
          <div className="page-pad print-links hidden print:block">
            <PrintHeader />
            <FlatResume writings={featuredWritings} />
          </div>
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = await getPosts({ onlyPreview: true });
  const allWritings = mergeWritings(allPosts);

  return {
    props: {
      featuredWritings: getFeaturedWritings(allWritings),
    },
  };
};
