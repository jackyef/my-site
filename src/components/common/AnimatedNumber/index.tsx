import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';

import { cn } from '@/utils/styles/classNames';

type EasingCurve = [number, number, number, number];

interface AnimatedNumberProps {
  /** Target value. Pass undefined/null to show scramble loading state. */
  value: number | undefined | null;
  /** Animation duration in seconds. @default 1.2 */
  duration?: number;
  /** Cubic-bezier easing curve. @default [0.16, 1, 0.3, 1] (expo ease-out) */
  ease?: EasingCurve;
  /** Milliseconds between scramble ticks while loading. @default 80 */
  scrambleInterval?: number;
  /** [min, max] range for scramble random values. @default [500, 2500] */
  scrambleRange?: [number, number];
  /** Text shown before first value. @default '—' */
  placeholder?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  ease = [0.16, 1, 0.3, 1],
  scrambleInterval = 80,
  scrambleRange = [500, 2500],
  placeholder = '—',
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const configRef = useRef({ ease, scrambleInterval, scrambleRange, duration });
  configRef.current = { ease, scrambleInterval, scrambleRange, duration };

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const config = configRef.current;

    if (value == null) {
      // Loading: scramble random digits
      const [min, max] = config.scrambleRange;
      const interval = setInterval(() => {
        node.textContent = String(
          Math.floor(Math.random() * (max - min)) + min,
        );
      }, config.scrambleInterval);
      return () => clearInterval(interval);
    }

    // Animate from 0 to target value
    const controls = animate(0, value, {
      duration: config.duration,
      ease: config.ease,
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {placeholder}
    </span>
  );
}
