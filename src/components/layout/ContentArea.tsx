import { type ReactNode } from 'react';

interface ContentAreaProps {
  children: ReactNode;
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <main
      className="blueprint-bg content-area pb-16 md:pb-0 scroll-smooth"
      style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </main>
  );
}
