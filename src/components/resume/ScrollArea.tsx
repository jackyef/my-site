import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/styles/classNames';

type ScrollAreaProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * A scroll container that fades its bottom edge while there is more to
 * read. Without it a long section — the writing list, mostly — simply
 * stops mid-sentence at the panel's edge, which reads as clipped rather
 * than as an invitation to keep scrolling.
 */
export function ScrollArea({ className, children }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  const sync = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    setMore(
      element.scrollHeight - element.scrollTop - element.clientHeight > 8,
    );
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        onScroll={sync}
        className={cn('min-h-0 flex-1 overflow-y-auto', className)}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-(--color-bg-panel) to-transparent transition-opacity duration-200',
          more ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
