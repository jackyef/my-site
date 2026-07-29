import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BlocksIcon,
  PaletteIcon,
  RulerIcon,
  TypeIcon,
  ContrastIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { SectionTabs, type Tab } from '@/components/layout/SectionTabs';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { ColorSection } from '@/components/design-system/sections/ColorSection';
import { ComponentsSection } from '@/components/design-system/sections/ComponentsSection';
import { ContrastSection } from '@/components/design-system/sections/ContrastSection';
import { PatternsSection } from '@/components/design-system/sections/PatternsSection';
import { SurfaceSection } from '@/components/design-system/sections/SurfaceSection';
import { TypographySection } from '@/components/design-system/sections/TypographySection';
import { COLOR_GROUPS } from '@/components/design-system/constants';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const TABS: Tab[] = [
  { id: 'color', label: 'Colour', icon: <PaletteIcon size={14} /> },
  { id: 'contrast', label: 'Contrast', icon: <ContrastIcon size={14} /> },
  { id: 'surfaces', label: 'Surfaces', icon: <RulerIcon size={14} /> },
  { id: 'typography', label: 'Type', icon: <TypeIcon size={14} /> },
  { id: 'components', label: 'Components', icon: <BlocksIcon size={14} /> },
  { id: 'patterns', label: 'Patterns', icon: <RulerIcon size={14} /> },
];

const TAB_IDS = TABS.map((t) => t.id);

const TOKEN_COUNT = COLOR_GROUPS.reduce((n, g) => n + g.tokens.length, 0);

const STATS = [
  { value: `${TOKEN_COUNT}`, label: 'Colour tokens' },
  { value: '3', label: 'Themes' },
  { value: '6', label: 'Type pairings' },
  { value: '16', label: 'Primitives' },
];

const title = 'Design system';
const description =
  'The tokens, type and components this site is built from — measured live, in every theme.';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState(TAB_IDS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const handleTabClick = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    isScrollingRef.current = true;
    setActiveTab(id);
    section.scrollIntoView({ behavior: 'smooth' });

    // Hand control back to the scroll listener once the smooth scroll settles.
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  // The scroll container is ContentArea's <main>, not this page's wrapper.
  useEffect(() => {
    const inner = scrollRef.current;
    if (!inner) return;
    const container = inner.closest('main') ?? inner;

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
      <PageMetaTags
        title={`${title} | Jacky Efendi`}
        description={description}
        image={createOgImageUrl({ title, description })}
      />

      <div className="flex flex-col flex-1">
        <SectionTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabClick}
        />

        <div ref={scrollRef} className="page-pad flex-1 isolate">
          <PageHeader
            eyebrow="Design system"
            title={
              <>
                What this site is <em>made of</em>
              </>
            }
            titleSpacing="mb-4"
          />

          <Text variant="lead" color="ink-3" className="max-w-[62ch] mb-7">
            One accent, four inks, three themes and sixteen primitives. Every
            value on this page is read out of the live stylesheet rather than
            copied into it, so this is a measurement of the system rather than a
            description of it.
          </Text>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-3 py-[10px]"
              >
                <dt className="text-[11px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-4)">
                  {stat.label}
                </dt>
                <dd className="text-2xl font-bold font-serif text-(--color-ink) tabular-nums leading-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <Text variant="caption" color="ink-4" className="mb-2">
            Tokens live in{' '}
            <code className="font-mono">src/styles/globals.css</code>;
            primitives in{' '}
            <code className="font-mono">src/components/common/</code>. The
            conventions behind both are written up in{' '}
            <code className="font-mono">docs/frontend-conventions.md</code>.
          </Text>

          <div className="space-y-4 pb-16">
            <ColorSection />
            <ContrastSection />
            <SurfaceSection />
            <TypographySection />
            <ComponentsSection />
            <PatternsSection />
          </div>
        </div>
      </div>
    </>
  );
}
