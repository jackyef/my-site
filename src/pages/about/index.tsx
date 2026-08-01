import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CalendarDaysIcon,
  MessageCircleIcon,
  PenLineIcon,
  RocketIcon,
} from 'lucide-react';
import type { GetStaticProps } from 'next/types';

import type { WritingItem } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { getFeaturedWritings } from '@/blog/featured';
import { mergeWritings } from '@/blog/writings';
import { BioView } from '@/components/about/BioView';
import { CareerView } from '@/components/about/CareerView';
import { ProjectsView } from '@/components/about/ProjectsView';
import { WritingView } from '@/components/about/WritingView';
import { SectionTabs, Tab } from '@/components/layout/SectionTabs';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

const TABS: Tab[] = [
  {
    id: 'bio',
    label: 'Bio',
    icon: <MessageCircleIcon size={14} aria-hidden="true" />,
  },
  {
    id: 'career',
    label: 'Career',
    icon: <CalendarDaysIcon size={14} aria-hidden="true" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <RocketIcon size={14} aria-hidden="true" />,
  },
  {
    id: 'writings',
    label: 'Writing',
    icon: <PenLineIcon size={14} aria-hidden="true" />,
  },
];

type Props = {
  featuredWritings: WritingItem[];
};

export default function About({ featuredWritings }: Props) {
  const [activeTab, setActiveTab] = useState('bio');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const handleTabClick = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    isScrollingRef.current = true;
    setActiveTab(id);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    section.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Following one of these links should land you *in* the section, the way
    // a real anchor would — otherwise the next Tab press resumes from the nav
    // and walks back through everything above it.
    section.focus({ preventScroll: true });

    // Allow the scroll spy to take over again after the scroll settles
    setTimeout(
      () => {
        isScrollingRef.current = false;
      },
      prefersReducedMotion ? 0 : 800,
    );
  }, []);

  // Track which section is in view on scroll
  // The actual scroll container is ContentArea (<main>), not our inner div
  useEffect(() => {
    const inner = scrollRef.current;
    if (!inner) return;
    const container = inner.closest('main') ?? inner;

    const TAB_IDS = TABS.map((t) => t.id);

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + containerRect.height * 0.25;
      let current = TAB_IDS[0];

      for (const id of TAB_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }

      setActiveTab(current);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PageMetaTags title="About" />

      <div className="flex flex-col flex-1">
        <SectionTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabClick}
        />

        {/* Plain sections, not tabpanels. All four are on screen at once and
            scrolled between, so they are landmarks on one page — `tabIndex={-1}`
            only exists so focus can be parked on the one you jumped to. */}
        <div ref={scrollRef} className="flex-1 isolate">
          <section
            id="bio"
            aria-label="Bio"
            tabIndex={-1}
            className="scroll-mt-24 focus:outline-none"
          >
            <BioView />
          </section>
          <section
            id="career"
            aria-label="Career"
            tabIndex={-1}
            className="scroll-mt-12 focus:outline-none"
          >
            <CareerView />
          </section>
          <section
            id="projects"
            aria-label="Projects"
            tabIndex={-1}
            className="scroll-mt-12 focus:outline-none"
          >
            <ProjectsView />
          </section>
          <section
            id="writings"
            aria-label="Writing"
            tabIndex={-1}
            className="scroll-mt-12 focus:outline-none"
          >
            <WritingView featuredWritings={featuredWritings} />
          </section>
        </div>
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
