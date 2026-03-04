import React, { useEffect, useState } from 'react';

import { MobileNav } from './MobileNav';
import { ContentArea } from './ContentArea';
import { PwaInstallButton } from './PwaInstallButton';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-(--color-bg-panel) focus:border focus:border-(--color-border) focus:text-(--color-accent-text) focus:text-sm focus:font-medium focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Sidebar — hidden on mobile (<768px) */}
      <div className="hidden md:flex" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Content area */}
      <ContentArea>{children}</ContentArea>

      {/* Mobile FAB nav — mobile only */}
      <div className="md:hidden">
        {mounted && (
          <>
            <PwaInstallButton variant="mobile" />
            <MobileNav />
          </>
        )}
      </div>
    </div>
  );
}
