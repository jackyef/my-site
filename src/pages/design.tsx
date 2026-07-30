import { useRef } from 'react';
import {
  BlocksIcon,
  PaletteIcon,
  RulerIcon,
  TypeIcon,
  ContrastIcon,
  LayersIcon,
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
import { PageNav } from '@/components/design-system/PageNav';
import { usePageOutline } from '@/components/design-system/usePageOutline';
import {
  COLOR_GROUPS,
  SECTIONS,
  type SectionId,
} from '@/components/design-system/constants';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

// Keyed by SectionId rather than string, so adding a section without an icon
// (or misspelling one) fails to compile instead of silently rendering nothing.
const SECTION_ICONS: Record<SectionId, React.ReactNode> = {
  color: <PaletteIcon size={14} aria-hidden="true" />,
  contrast: <ContrastIcon size={14} aria-hidden="true" />,
  surfaces: <LayersIcon size={14} aria-hidden="true" />,
  typography: <TypeIcon size={14} aria-hidden="true" />,
  components: <BlocksIcon size={14} aria-hidden="true" />,
  patterns: <RulerIcon size={14} aria-hidden="true" />,
};

const TABS: Tab[] = SECTIONS.map((section) => ({
  id: section.id,
  label: section.label,
  icon: SECTION_ICONS[section.id],
}));

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
  const scopeRef = useRef<HTMLDivElement>(null);
  const { outline, activeId, scrollTo } = usePageOutline(scopeRef);

  // The rail tracks individual components; the tab strip only knows sections,
  // so map a component anchor back to the section containing it.
  const activeSection =
    outline.find(
      (entry) =>
        entry.id === activeId ||
        entry.children.some((child) => child.id === activeId),
    )?.id ?? SECTIONS[0].id;

  return (
    <>
      <PageMetaTags
        title={`${title} | Jacky Efendi`}
        description={description}
        image={createOgImageUrl({ title, description })}
      />

      <div className="flex flex-col flex-1">
        {/* Below the rail's breakpoint the strip is the only navigation. The
            hiding goes on SectionTabs itself: a wrapper would become the sticky
            bar's containing block and pin it to its own height, which is to say
            not pin it at all. */}
        <SectionTabs
          tabs={TABS}
          activeTab={activeSection}
          onTabChange={scrollTo}
          className="min-[1200px]:hidden"
        />

        {/* 880px column + 224px rail = 1104px, the same arrangement the blog
            uses. Under 1200px the rail drops out and the column re-centres. */}
        <div className="flex items-start justify-center w-[1104px] max-w-full min-w-0 mx-auto flex-1">
          <div ref={scopeRef} className="page-pad min-w-0 flex-1 isolate">
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
              copied into it, so this is a measurement of the system rather than
              a description of it.
            </Text>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-3 py-[10px]"
                >
                  <dt className="text-[11px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-3)">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-bold font-serif text-(--color-ink) tabular-nums leading-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Text variant="caption" color="ink-3" className="mb-2">
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

          <aside className="hidden min-[1200px]:block w-56 shrink-0 pt-10 pb-10 pl-4 sticky top-0 max-h-dvh overflow-y-auto">
            <PageNav
              outline={outline}
              activeId={activeId}
              onNavigate={scrollTo}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
