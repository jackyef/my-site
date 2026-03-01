import React from 'react';

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
    <div
      className="px-5 md:px-[52px]"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        overflowX: 'auto',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        transition: 'background-color 0.22s ease, border-color 0.22s ease',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={
              {
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '13px 12px 11px',
                // Use outline to fake the bottom border so we can also set border:none
                // This avoids the duplicate property issue
                borderBottom: `2px solid ${
                  isActive ? 'var(--color-accent)' : 'transparent'
                }`,
                marginBottom: -1,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? 'var(--color-accent-text)'
                  : 'var(--color-ink-3)',
                transition: 'border-color 0.15s, color 0.15s',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                position: 'relative',
              } as React.CSSProperties
            }
            className={!isActive ? 'hover:text-[var(--color-ink)]' : ''}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
