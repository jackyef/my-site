import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/styles/classNames';

interface TypewriterTextProps {
  text: string;
  charSpeed?: number;
  startDelay?: number;
  className?: string;
}

export function TypewriterText({
  text,
  charSpeed = 45,
  startDelay = 600,
  className,
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const delay = setTimeout(() => setStarted(true), startDelay);
          return () => clearTimeout(delay);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startDelay, text.length]);

  useEffect(() => {
    if (!started || count >= text.length) return;

    const timer = setTimeout(() => setCount((c) => c + 1), charSpeed);
    return () => clearTimeout(timer);
  }, [started, count, text.length, charSpeed]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      <span
        className={cn(
          'inline-block w-[1.5px] h-[1em] bg-current align-middle ml-px translate-y-px',
          done || !started ? 'animate-cursor-blink' : '',
        )}
        aria-hidden="true"
      />
    </span>
  );
}
