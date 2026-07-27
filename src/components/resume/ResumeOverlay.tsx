import { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import type { WritingItem } from '@/blog/types';
import { Heading } from '@/components/common/Heading';

import type { SectionId } from './CozyRoom/hotspots';
import { ResumeSectionContent, SECTION_TITLES } from './sections';

type ResumeOverlayProps = {
  section: SectionId | null;
  writings: WritingItem[];
  onClose: () => void;
};

/**
 * The panel that slides in when an object in the room is selected.
 * Positioned absolutely within the scene container: bottom sheet on
 * mobile, side panel on desktop.
 */
export function ResumeOverlay({
  section,
  writings,
  onClose,
}: ResumeOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (section) closeRef.current?.focus();
  }, [section]);

  return (
    <AnimatePresence>
      {section && (
        <motion.aside
          key={section}
          role="dialog"
          aria-label={SECTION_TITLES[section]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute inset-x-2 bottom-2 top-auto flex max-h-[46%] flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-panel) shadow-(--shadow-lg) md:inset-x-auto md:top-3 md:right-3 md:bottom-3 md:max-h-none md:w-[400px]"
        >
          <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-2">
            <Heading level={3} as="h2">
              {SECTION_TITLES[section]}
            </Heading>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close panel"
              onClick={onClose}
              className="cursor-pointer rounded-full p-1.5 text-(--color-ink-3) transition-colors hover:bg-(--color-bg-hover) hover:text-(--color-ink)"
            >
              <XIcon size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-1 pb-5">
            <ResumeSectionContent section={section} writings={writings} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
