import { type ReactNode } from 'react';

import { cn } from '@/utils/styles/classNames';

export interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

interface SectionTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /**
   * Extra classes for the sticky root — responsive visibility belongs here
   * rather than on a wrapper. A sticky element cannot travel outside its
   * parent's box, so wrapping this in a plain `<div>` collapses that box to the
   * height of the tabs and the bar scrolls away on the first flick.
   */
  className?: string;
}

/**
 * Reads as tabs, behaves as a table of contents.
 *
 * These carried `role="tablist"` / `role="tab"` / `aria-selected` for a while,
 * which promised something the page cannot keep: all four sections render and
 * stay visible at once, so a screen reader announced "tab 2 of 4, selected"
 * about a panel that was never hidden, and the arrow-key navigation the tab
 * role requires was never implemented. They are links to anchors on one long
 * page, so that is what they say now — with `aria-current="location"` marking
 * whichever section you have scrolled to.
 */
export function SectionTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SectionTabsProps) {
  return (
    <div
      className={cn(
        'bg-(--color-bg) shrink-0 sticky top-0 z-(--z-sticky) transition-[background-color] duration-[220ms] ease-out',
        className,
      )}
    >
      <nav
        aria-label="Sections"
        className="max-w-[880px] mx-auto px-5 md:px-13 overflow-y-hidden overflow-x-auto flex items-center gap-[2px]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              id={`tab-${tab.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(event) => {
                // Leave modified clicks alone — open-in-new-tab still works.
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }

                event.preventDefault();
                onTabChange(tab.id);
              }}
              className={cn(
                // Colour and the 2px underline already carry the active state.
                // Swapping font-weight on top of them nudged every label to
                // its right by a fraction of a pixel on each click — small,
                // but measurable, and it reads as a shimmer along the row.
                'flex items-center gap-[5px] px-3 pt-[13px] pb-[11px] -mb-px text-[13px] font-medium whitespace-nowrap relative cursor-pointer no-underline border-x-0 border-t-0 border-b-2 transition-[border-color,color] duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-accent) focus-visible:rounded-t-sm',
                isActive
                  ? 'text-(--color-accent-text) border-b-(--color-accent)'
                  : 'text-(--color-ink-3) border-b-transparent hover:text-(--color-ink)',
              )}
            >
              <span className="shrink-0 flex items-center">{tab.icon}</span>
              {tab.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
