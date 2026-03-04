import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, MessageCircle, PenLine, Rocket } from 'lucide-react';
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
    icon: <MessageCircle size={14} aria-hidden="true" />,
  },
  {
    id: 'career',
    label: 'Career',
    icon: <CalendarDays size={14} aria-hidden="true" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Rocket size={14} aria-hidden="true" />,
  },
  {
    id: 'writings',
    label: 'Writing',
    icon: <PenLine size={14} aria-hidden="true" />,
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
    section.scrollIntoView({ behavior: 'smooth' });

    // Allow IntersectionObserver to take over again after scroll settles
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
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

        <div ref={scrollRef} className="flex-1 isolate">
          <section
            id="bio"
            role="tabpanel"
            aria-labelledby="tab-bio"
            className="scroll-mt-24"
          >
            <BioView />
          </section>
          <section
            id="career"
            role="tabpanel"
            aria-labelledby="tab-career"
            className="scroll-mt-12"
          >
            <CareerView />
          </section>
          <section
            id="projects"
            role="tabpanel"
            aria-labelledby="tab-projects"
            className="scroll-mt-12"
          >
            <ProjectsView />
          </section>
          <section
            id="writings"
            role="tabpanel"
            aria-labelledby="tab-writings"
            className="scroll-mt-12"
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
