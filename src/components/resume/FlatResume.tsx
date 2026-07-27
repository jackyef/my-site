import type { WritingItem } from '@/blog/types';
import { Heading } from '@/components/common/Heading';
import { SectionLabel } from '@/components/common/SectionLabel';

import type { SectionId } from './CozyRoom/hotspots';
import { ResumeSectionContent, SECTION_TITLES } from './sections';

const SECTION_ORDER: SectionId[] = [
  'about',
  'career',
  'projects',
  'writing',
  'contact',
];

/**
 * The plain, readable version of the resume — used as the no-WebGL
 * fallback and as an always-available alternative to the 3D room.
 */
export function FlatResume({ writings }: { writings: WritingItem[] }) {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      {SECTION_ORDER.map((section, i) => (
        <section key={section} aria-labelledby={`resume-${section}`}>
          <SectionLabel className="mb-1">
            {String(i + 1).padStart(2, '0')}
          </SectionLabel>
          <Heading level={2} id={`resume-${section}`} className="mb-4">
            {SECTION_TITLES[section]}
          </Heading>
          <ResumeSectionContent section={section} writings={writings} />
        </section>
      ))}
    </div>
  );
}
