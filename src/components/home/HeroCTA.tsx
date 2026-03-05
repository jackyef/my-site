import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { motion, useAnimate } from 'motion/react';

import { TypewriterText } from '@/components/common/TypewriterText';

import { useTheme } from '@/hooks/useTheme';

const R = 12;
const STROKE = 1.2;
const CTA_TEXT = 'More about me';
const EASE = [0.22, 1, 0.36, 1] as const;
const BORDER_DRAW_DUR = 850; // mask pathLength duration in ms

const SHADOW_NONE = '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)';

const SHADOWS = {
  light: {
    peak: '0 6px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05)',
    rest: '0 1px 4px rgba(0,0,0,0.06), 0 0.5px 2px rgba(0,0,0,0.03)',
    hover: '0 2px 10px rgba(44,100,100,0.12), 0 1px 3px rgba(44,100,100,0.06)',
  },
  dim: {
    peak: '0 0 32px rgba(74,150,150,0.28), 0 0 10px rgba(74,150,150,0.15)',
    rest: '0 0 6px rgba(74,150,150,0.12), 0 0 2px rgba(74,150,150,0.08)',
    hover: '0 0 18px rgba(74,150,150,0.2), 0 0 5px rgba(74,150,150,0.12)',
  },
  dark: {
    peak: '0 0 36px rgba(74,150,150,0.32), 0 0 12px rgba(74,150,150,0.18)',
    rest: '0 0 8px rgba(74,150,150,0.14), 0 0 3px rgba(74,150,150,0.08)',
    hover: '0 0 22px rgba(74,150,150,0.24), 0 0 6px rgba(74,150,150,0.14)',
  },
} as const;

/**
 * Builds an SVG rounded-rect path. Both r=2 and r=12 share identical command
 * structure (M H A V A H A V A Z) so motion can interpolate between them.
 */
function rrect(w: number, h: number, r: number) {
  return [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');
}

// ────────────────────────────────────────────
// Phase timeline
//   0  dashed border drawing in (via SVG mask)
//   1  typewriter text entering (when border is at ~50%)
//   2  draw + text done (pause)
//   3  materialize  (raise, solidify, enlarge)
//   4  drop — spring settle + corners round on impact
//   5  done — interactive
// ────────────────────────────────────────────

export function HeroCTA() {
  const maskId = useId();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState(0);
  const { theme } = useTheme();
  const s = SHADOWS[theme ?? 'light'];

  /* ── measure ── */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      if (w > 0 && h > 0)
        setDims((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);

  const hasSize = dims.w > 0 && dims.h > 0;
  const flatPath = hasSize ? rrect(dims.w, dims.h, 2) : '';
  const roundPath = hasSize ? rrect(dims.w, dims.h, R) : '';

  /* ── choreography ── */
  useEffect(() => {
    if (!hasSize) return;

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });

    (async () => {
      // Phase 0: dashed border draws in (declarative pathLength on mask path)

      // Phase 1: at ~50 % of border, typewriter kicks in
      await wait(380);
      if (cancelled) return;
      setPhase(1);

      // Wait for draw to finish (remaining time + buffer for typewriter)
      await wait(BORDER_DRAW_DUR - 380 + 100);
      if (cancelled) return;

      // Phase 2: draw + text done, brief pause
      setPhase(2);
      await wait(800);
      if (cancelled) return;

      // Phase 3: materialize — raise from paper + solidify + enlarge
      setPhase(3);
      const el = scope.current;
      if (!el || cancelled) return;

      // Start the slow raise (1.5s total)
      await animate(
        el,
        { scale: 1.08 },
        { duration: 1.5, ease: [0.4, 0, 0.4, 1] },
      );
      if (cancelled) return;

      // Brief pause at peak elevation
      await wait(200);
      if (cancelled) return;

      // Phase 4: drop — spring settle + corners round on impact
      setPhase(4);
      if (!scope.current || cancelled) return;
      await animate(
        scope.current,
        { scale: 1 },
        { type: 'spring', stiffness: 500, damping: 10, mass: 0.7 },
      );
      if (cancelled) return;

      setPhase(5);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [hasSize, animate, scope]);

  const raised = phase >= 3;
  const dropped = phase >= 4;
  const done = phase >= 5;

  return (
    <div
      ref={scope}
      className="group relative inline-block"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ willChange: phase < 6 ? 'transform' : undefined }}
    >
      {/* ── elevation shadow ── */}
      <motion.span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          borderRadius: dropped ? R : 2,
          boxShadow: hovered && done
            ? s.hover
            : dropped
              ? s.rest
              : raised
                ? s.peak
                : SHADOW_NONE,
        }}
        transition={{
          borderRadius: dropped
            ? { type: 'spring', stiffness: 500, damping: 10, mass: 0.7 }
            : { duration: 0 },
          boxShadow: dropped
            ? { type: 'spring', stiffness: 500, damping: 10, mass: 0.7 }
            : { duration: done ? 0.2 : 2, ease: EASE },
        }}
      />

      {/* ── surface — rises above the blueprint grid ── */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-(--color-bg) pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          borderRadius: dropped ? R : 2,
          opacity: raised ? 1 : 0,
        }}
        transition={{
          borderRadius: dropped
            ? { type: 'spring', stiffness: 500, damping: 10, mass: 0.7 }
            : { duration: 0 },
          opacity: { duration: 1.5, ease: EASE },
        }}
      />

      {/* ── SVG borders ── */}
      {hasSize && (
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={dims.w}
          height={dims.h}
        >
          <defs>
            {/* Mask: solid white stroke draws in via pathLength → reveals dashed path.
                No custom dasharray on this path, so pathLength works cleanly. */}
            <mask id={maskId}>
              <motion.path
                d={flatPath}
                fill="none"
                stroke="white"
                strokeWidth={STROKE + 8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: BORDER_DRAW_DUR / 1000,
                  ease: 'easeOut',
                }}
              />
            </mask>
          </defs>

          {/* 1. Dashed draw-in — revealed progressively by mask */}
          <motion.path
            d={flatPath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={STROKE}
            strokeDasharray="6 4"
            mask={`url(#${maskId})`}
            animate={{ opacity: raised ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* 2. Solid border — materializes, then morphs on drop */}
          <motion.path
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={STROKE}
            initial={{ d: flatPath, opacity: 0 }}
            animate={{
              d: dropped ? roundPath : flatPath,
              opacity: raised ? 1 : 0,
            }}
            transition={{
              d: dropped
                ? { type: 'spring', stiffness: 500, damping: 10, mass: 0.7 }
                : { duration: 0 },
              opacity: { duration: 0.5 },
            }}
          />
        </svg>
      )}

      {/* ── impact ring ── */}
      <motion.span
        aria-hidden
        className="absolute -inset-1.5 pointer-events-none border-[1.5px] border-(--color-accent)"
        style={{ borderRadius: R + 4 }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: phase === 4 ? [0, 0.5, 0.3, 0] : 0,
          scale: phase === 4 ? [0.97, 1.1, 1.04, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
          delay: phase === 4 ? 0.05 : 0,
        }}
      />

      {/* ── hover tint ── */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-(--color-accent) pointer-events-none"
        style={{ borderRadius: R }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered && done ? 0.06 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* ── link content ── */}
      <Link
        href="/about"
        className="relative z-1 inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-(--color-accent-text) no-underline cursor-pointer"
      >
        {/* invisible spacer — reserves full width so the button never resizes */}
        <span className="invisible" aria-hidden>
          {CTA_TEXT}
        </span>

        {/* typewriter overlaid on top of the spacer */}
        <span className="absolute left-6 top-3">
          <TypewriterText
            text={CTA_TEXT}
            active={phase >= 1}
            charSpeed={40}
            startDelay={0}
            hideCursorOnDone
            className="text-[14px] font-medium text-(--color-accent-text)"
          />
        </span>

        {/* arrow — appears after typewriter finishes */}
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            x: phase >= 2 ? (hovered && done ? 4 : 0) : -4,
          }}
          transition={{
            opacity: { duration: 0.08, delay: phase >= 2 && !done ? 0.1 : 0 },
            x:
              phase < 2
                ? { duration: 0 }
                : done
                ? { type: 'spring', stiffness: 300, damping: 20 }
                : { duration: 0.12, delay: 0.08, ease: 'easeOut' },
          }}
        >
          &rarr;
        </motion.span>
      </Link>
    </div>
  );
}
