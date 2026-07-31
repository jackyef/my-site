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
import { ResumeJsonLd } from '@/components/resume/ResumeJsonLd';
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
  // Reads as a lamp warming up rather than a spinner
  loading: () => (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <span
        aria-hidden="true"
        className="h-9 w-9 animate-pulse rounded-full bg-(--color-accent-xl) shadow-[0_0_36px_12px_var(--color-accent-xl)] motion-reduce:animate-none"
      />
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

// How far the room is allowed to spill past its slot, top and bottom, so
// zooming or panning runs off the page rather than into a hard crop. Phones
// have far less page to spill onto, so they get less of it.
const SCENE_BLEED = { desktop: 112, mobile: 48 };

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
  const sceneHitRef = useRef<HTMLDivElement>(null);
  const sceneOverlayRef = useRef<HTMLDivElement>(null);
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
  const sceneBleed = isDesktop ? SCENE_BLEED.desktop : SCENE_BLEED.mobile;
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
      <ResumeJsonLd />

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
              Welcome to my corner of the internet; drag, scroll, WASD, and
              click around to explore!
            </Text>
          </div>

          {/* Full-bleed so the room gets all the space it deserves, and
              stacked above the copy either side of it so a room that has been
              zoomed or panned spills over the page instead of being cropped.
              Focusable so keyboard users can step into the room and move
              with the arrow keys. */}
          <div
            ref={sceneRef}
            tabIndex={webglOk ? 0 : -1}
            role="group"
            aria-label="Interactive 3D room. Use W A S D or the arrow keys to move the camera."
            onFocus={() => setSceneFocused(true)}
            onBlur={() => setSceneFocused(false)}
            className="print-hide relative z-10 mt-2 h-[76vh] min-h-[min(500px,88vh)] w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring) md:mt-4 md:h-[80vh]"
          >
            {/* The room's hit area. It stops at the slot even though the canvas
                does not, which is what keeps the copy underneath the overhang
                selectable. Declared before the canvas so its ref is attached by
                the time the scene wires itself up; the canvas is inert, so
                painting over it costs nothing.
                touch-action is forced because OrbitControls otherwise writes
                `none` here on connect, which would eat one-finger scrolling. */}
            {webglOk && (
              <div
                ref={sceneHitRef}
                onPointerDown={() => sceneRef.current?.focus()}
                className={cn(
                  'absolute inset-0',
                  isDesktop ? '[touch-action:none]!' : '[touch-action:pan-y]!',
                )}
              />
            )}
            {/* Where the scene's HTML overlays mount. It tracks the canvas box
                rather than the slot, because drei positions them in canvas
                pixels — mount them on the slot and every hotspot label sits a
                full bleed below the object it points at. Inert itself; the
                overlays switch pointer events back on for their own content. */}
            {webglOk && (
              <div
                ref={sceneOverlayRef}
                className="pointer-events-none absolute inset-x-0 z-10"
                style={{ top: -sceneBleed, bottom: -sceneBleed }}
              />
            )}
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
                  bleed={sceneBleed}
                  eventSource={sceneHitRef}
                  htmlPortal={sceneOverlayRef}
                />
              </SceneErrorBoundary>
            )}
            {webglOk && view === 'overview' && (
              <button
                type="button"
                onClick={() => setResetSignal((signal) => signal + 1)}
                className="absolute top-3 right-3 z-20 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border-hi) bg-(--color-bg-panel) px-3 py-[7px] pointer-coarse:py-[15px] text-[12px] leading-none font-medium text-(--color-ink-2) shadow-(--shadow-md) transition-[color,border-color,transform] duration-150 hover:-translate-y-px hover:border-(--color-accent) hover:text-(--color-accent-text) active:scale-[0.96]"
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
            {/* On a phone these wrapped onto three or four rows, which was
              enough to push the room itself past the fold — so they run in
              one scrolling line instead, and only wrap once there is room.
              The trailing padding clears the floating mobile nav button. */}
            {/* `overflow-x: auto` forces the block axis to clip too, which
                sheared the top off the pills' 1px hover lift — the inset
                padding gives it somewhere to go, and the negative margin
                keeps the row's own spacing unchanged. */}
            {/* The scrollbar is hidden by design, which left nothing at all to
                say the row continues — "Say hello" sat off the right edge of a
                390px screen with no hint it existed. This is a painted overlay
                rather than a `mask-image` on the row: Blink hit-tests through
                mask alpha, so fading the right edge that way made the last
                chip genuinely unclickable. `pointer-events-none` keeps this
                one purely cosmetic. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--color-bg) to-transparent md:hidden"
              />
              <div className="-my-2 flex items-center gap-2 overflow-x-auto py-2 pr-16 [scrollbar-width:none] md:flex-wrap md:overflow-x-visible md:pr-0 [&::-webkit-scrollbar]:hidden">
                {HOTSPOT_BUTTONS.map((button) => (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() =>
                      goToView(view === button.id ? 'overview' : button.id)
                    }
                    className={cn(
                      // py-[7px] is a 30px pill — fine under a cursor, short of
                      // a thumb. The touch bump is scoped to coarse pointers.
                      'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-[7px] pointer-coarse:py-[14px] text-[13px] leading-none font-medium whitespace-nowrap transition-[color,border-color,background-color,transform] duration-150 hover:-translate-y-px active:scale-[0.96]',
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
                  className="ml-auto shrink-0 cursor-pointer pl-2 py-1 pointer-coarse:py-3 text-[13px] font-medium whitespace-nowrap text-(--color-ink-3) hover:text-(--color-ink-2) hover:underline"
                >
                  Prefer plain text?
                </button>
              </div>
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
