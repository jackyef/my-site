import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { motion, useAnimate } from 'motion/react';

import { TypewriterText } from '@/components/common/TypewriterText';

const R = 12;
const STROKE = 1.2;
const CTA_TEXT = 'More about me';
const EASE = [0.22, 1, 0.36, 1] as const;
const BORDER_DRAW_DUR = 850; // mask pathLength duration in ms

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
//   4  round corners
//   5  pop — finalization
//   6  done — interactive
// ────────────────────────────────────────────

export function HeroCTA() {
  const maskId = useId();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState(0);

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
      await wait(500);
      if (cancelled) return;

      // Phase 3: materialize — raise from paper + solidify + enlarge
      setPhase(3);
      const el = scope.current;
      if (!el || cancelled) return;
      await animate(
        el,
        { scale: 1.05 },
        { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      );
      if (cancelled) return;

      // Phase 4: round the rough edges
      setPhase(4);
      await wait(800);
      if (cancelled) return;

      // Phase 5: pop!
      setPhase(5);
      if (!scope.current || cancelled) return;
      await animate(
        scope.current,
        { scale: [1.05, 1.1, 1] },
        { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      );
      if (cancelled) return;

      setPhase(6);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [hasSize, animate, scope]);

  const raised = phase >= 3;
  const rounded = phase >= 4;
  const done = phase >= 6;

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
          borderRadius: rounded ? R : 2,
          boxShadow: raised
            ? hovered && done
              ? '0 8px 28px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)'
              : '0 4px 20px rgba(0,0,0,0.09), 0 1px 5px rgba(0,0,0,0.05)'
            : '0 0 0 0 transparent',
        }}
        transition={{
          borderRadius: { duration: 0.4, ease: EASE },
          boxShadow: { duration: done ? 0.2 : 0.4 },
        }}
      />

      {/* ── surface — rises above the blueprint grid ── */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-(--color-bg) pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          borderRadius: rounded ? R : 2,
          opacity: raised ? 1 : 0,
        }}
        transition={{
          borderRadius: { duration: 0.4, ease: EASE },
          opacity: { duration: 0.35 },
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
            transition={{ duration: 0.2 }}
          />

          {/* 2. Solid border — materializes, then morphs to rounded */}
          <motion.path
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={STROKE}
            initial={{ d: flatPath, opacity: 0 }}
            animate={{
              d: rounded ? roundPath : flatPath,
              opacity: raised ? 1 : 0,
            }}
            transition={{
              d: { duration: 0.4, ease: EASE },
              opacity: { duration: 0.2 },
            }}
          />
        </svg>
      )}

      {/* ── pop ring ── */}
      <motion.span
        aria-hidden
        className="absolute -inset-1 pointer-events-none border-[1.5px] border-(--color-accent)"
        style={{ borderRadius: R + 2 }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: phase === 5 ? [0, 0.35, 0] : 0,
          scale: phase === 5 ? [1, 1.06] : 1,
        }}
        transition={{ duration: 0.45 }}
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
