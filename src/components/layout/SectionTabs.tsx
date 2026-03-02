import React from 'react';

import { cn } from '@/utils/styles/classNames';

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SectionTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function SectionTabs({
  tabs,
  activeTab,
  onTabChange,
}: SectionTabsProps) {
  return (
    <div className="px-5 md:px-13 overflow-y-hidden flex items-center gap-[2px] border-b border-[var(--color-border)] bg-[var(--color-bg)] overflow-x-auto shrink-0 sticky top-0 z-10 transition-[background-color,border-color] duration-[220ms] ease-out">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-[5px] px-3 pt-[13px] pb-[11px] -mb-px text-[13px] whitespace-nowrap relative cursor-pointer bg-transparent border-x-0 border-t-0 border-b-2 font-[inherit] transition-[border-color,color] duration-150',
              isActive
                ? 'font-semibold text-[var(--color-accent-text)] border-b-[var(--color-accent)]'
                : 'font-medium text-[var(--color-ink-3)] border-b-transparent hover:text-[var(--color-ink)]',
            )}
          >
            <span className="shrink-0 flex items-center">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
