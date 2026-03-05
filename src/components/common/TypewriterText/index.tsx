import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/styles/classNames';

interface TypewriterTextProps {
  text: string;
  charSpeed?: number;
  startDelay?: number;
  className?: string;
  /** When provided, bypasses IntersectionObserver — typing starts when `active` becomes true. */
  active?: boolean;
  /** Called when all characters have been typed. */
  onDone?: () => void;
  /** Hide the cursor after typing finishes. Default: false (cursor blinks after done). */
  hideCursorOnDone?: boolean;
}

export function TypewriterText({
  text,
  charSpeed = 45,
  startDelay = 600,
  className,
  active,
  onDone,
  hideCursorOnDone = false,
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneCalledRef = useRef(false);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const externalControl = active !== undefined;

  // External control: start when `active` becomes true
  useEffect(() => {
    if (!externalControl) return;
    if (active) setStarted(true);
  }, [active, externalControl]);

  // Self-managed: IntersectionObserver + startDelay
  useEffect(() => {
    if (externalControl) return;

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      setStarted(true);
      return;
    }

    let delayTimer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          delayTimer = setTimeout(() => setStarted(true), startDelay);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
    };
  }, [startDelay, text.length, externalControl]);

  useEffect(() => {
    if (!started || count >= text.length) return;

    const timer = setTimeout(() => setCount((c) => c + 1), charSpeed);
    return () => clearTimeout(timer);
  }, [started, count, text.length, charSpeed]);

  const done = count >= text.length;

  useEffect(() => {
    if (done && onDone && !onDoneCalledRef.current) {
      onDoneCalledRef.current = true;
      onDone();
    }
  }, [done, onDone]);

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      <span
        className={cn(
          'inline-block w-[1.5px] h-[1em] bg-current align-middle ml-px -translate-y-0.5',
          !started || (done && hideCursorOnDone)
            ? 'opacity-0'
            : done
              ? 'animate-cursor-blink'
              : '',
        )}
        aria-hidden="true"
      />
    </span>
  );
}
