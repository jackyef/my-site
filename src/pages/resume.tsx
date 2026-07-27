import { useCallback, useEffect, useState } from 'react';
import {
  CalendarDaysIcon,
  CatIcon,
  LibraryIcon,
  MailIcon,
  MonitorIcon,
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
  { id: 'about', icon: <CatIcon size={14} aria-hidden="true" /> },
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
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();

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

        {showFlat ? (
          <>
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
          </>
        ) : (
          <>
            <Text variant="body-sm" className="mb-6 max-w-xl">
              Welcome to my corner of the internet — literally. This room is my
              resume: drag to look around, and click on things to explore. The
              monitor, the corkboard, the bookshelf, the envelopes… and yes, the
              cat.
            </Text>

            <div className="relative h-[62vh] min-h-[420px] md:h-[68vh]">
              {webglOk && (
                <CozyRoomScene
                  view={view}
                  theme={theme}
                  reduceMotion={reduceMotion}
                  panelOffset={isDesktop}
                  onSelect={setView}
                  onClose={closeSection}
                />
              )}
              <ResumeOverlay
                section={activeSection}
                writings={featuredWritings}
                onClose={closeSection}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {HOTSPOT_BUTTONS.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() =>
                    setView(view === button.id ? 'overview' : button.id)
                  }
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-[6px] text-[13px] font-medium transition-colors',
                    view === button.id
                      ? 'border-(--color-accent-l) bg-(--color-accent-xl) text-(--color-accent-text)'
                      : 'border-(--color-border-hi) text-(--color-ink-2) hover:border-(--color-accent) hover:text-(--color-accent-text)',
                  )}
                >
                  {button.icon}
                  {SECTION_TITLES[button.id]}
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
          </>
        )}
      </div>
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
