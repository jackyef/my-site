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
