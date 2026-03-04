import { useRef, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/router';

interface ContentAreaProps {
  children: ReactNode;
}

export function ContentArea({ children }: ContentAreaProps) {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();
  const isPop = useRef(false);

  useEffect(() => {
    router.beforePopState(() => {
      isPop.current = true;
      return true;
    });
  }, [router]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (isPop.current) {
        isPop.current = false;
        return;
      }
      ref.current?.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  return (
    <main
      id="main-content"
      ref={ref}
      className="blueprint-bg content-area pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 scroll-smooth"
      style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </main>
  );
}
