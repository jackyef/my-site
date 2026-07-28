import { useCallback, useEffect, useState } from 'react';
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
import { ResumeOverlay } from '@/components/resume/ResumeOverlay';
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

type Props = {
  featuredWritings: WritingItem[];
};

export default function Resume({ featuredWritings }: Props) {
  const [view, setView] = useState<ViewId>('overview');
  const [flatMode, setFlatMode] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
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

  const closeSection = useCallback(() => setView('overview'), []);

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
        <div className="page-pad">
          <PageHeader
            eyebrow="Resume"
            title={
              <>
                A <em>cozy</em> little resume
              </>
            }
            titleSpacing="mb-4"
          />
          <div className="mb-8 flex items-center gap-3">
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
          <div className="page-pad pb-0">
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
            <Text variant="body-sm" className="md:hidden">
              This room is my resume — tap things to explore, two fingers to
              look around.
            </Text>
            <Text variant="body-sm" className="hidden max-w-xl md:block">
              Welcome to my corner of the internet — literally. This room is my
              resume: drag to look around, right-drag to pan, scroll to zoom —
              and click on things to explore. The monitors, the corkboard, the
              bookshelf… and that little guy wandering about is me — say hi.
            </Text>
          </div>

          {/* Full-bleed so the room gets all the space it deserves */}
          <div className="relative mt-2 h-[76vh] min-h-[500px] w-full md:mt-4 md:h-[80vh]">
            {webglOk && (
              <CozyRoomScene
                view={view}
                theme={theme}
                reduceMotion={reduceMotion}
                desktop={isDesktop}
                writings={featuredWritings}
                resetSignal={resetSignal}
                onSelect={setView}
                onClose={closeSection}
                onCycleTheme={cycleTheme}
              />
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

          <div className="page-pad pt-4">
            {/* pr clears the floating mobile nav button */}
            <div className="flex flex-wrap items-center gap-2 pr-16 md:pr-0">
              {HOTSPOT_BUTTONS.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() =>
                    setView(view === button.id ? 'overview' : button.id)
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
