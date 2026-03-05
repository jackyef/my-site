import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue } from 'motion/react';
import Link from 'next/link';

import { cn } from '@/utils/styles/classNames';

import { PageMetaTags } from '../Seo/PageMetaTags';

// ── Rubber Duck SVG ──────────────────────────────────────────────
function DuckSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* body */}
      <ellipse cx="32" cy="42" rx="22" ry="16" fill="#FFD54F" />
      {/* head */}
      <circle cx="32" cy="22" r="14" fill="#FFD54F" />
      {/* beak */}
      <ellipse cx="44" cy="24" rx="8" ry="4" fill="#FF9800" />
      {/* eye */}
      <circle cx="36" cy="18" r="2.5" fill="#333" />
      {/* eye shine */}
      <circle cx="37" cy="17" r="0.8" fill="#fff" />
      {/* wing */}
      <ellipse
        cx="20"
        cy="40"
        rx="8"
        ry="10"
        fill="#FFC107"
        transform="rotate(-15 20 40)"
      />
      {/* cheek blush */}
      <circle cx="28" cy="26" r="3" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}

// ── Bouncing Duck ────────────────────────────────────────────────
function BouncingDuck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const duckSize = 56;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const vxRef = useRef(90); // px per second
  const vyRef = useRef(72); // px per second
  const rotateRef = useRef(0);
  const rotate = useMotionValue(0);
  const [squeaking, setSqueaking] = useState(false);
  const [ready, setReady] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    // Start at a random position
    x.set(Math.random() * (bounds.width - duckSize));
    y.set(Math.random() * (bounds.height - duckSize));
    setReady(true);

    let lastTime = -1;

    function tick(now: number) {
      if (lastTime < 0) {
        lastTime = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const delta = Math.min(now - lastTime, 50) / 1000; // seconds, capped
      lastTime = now;

      const b = container!.getBoundingClientRect();
      const maxX = b.width - duckSize;
      const maxY = b.height - duckSize;

      let nx = x.get() + vxRef.current * delta;
      let ny = y.get() + vyRef.current * delta;

      if (nx <= 0 || nx >= maxX) {
        vxRef.current *= -1;
        nx = Math.max(0, Math.min(nx, maxX));
      }
      if (ny <= 0 || ny >= maxY) {
        vyRef.current *= -1;
        ny = Math.max(0, Math.min(ny, maxY));
      }

      rotateRef.current += vxRef.current * 0.5 * delta;
      rotate.set(rotateRef.current);
      x.set(nx);
      y.set(ny);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [x, y, rotate]);

  const squeakTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (squeakTimeoutRef.current) clearTimeout(squeakTimeoutRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    // "Squeak" — reverse direction + speed boost
    vxRef.current *= -1.3;
    vyRef.current *= -1.3;
    // Clamp speed so it doesn't go crazy
    const maxSpeed = 240;
    vxRef.current = Math.max(-maxSpeed, Math.min(maxSpeed, vxRef.current));
    vyRef.current = Math.max(-maxSpeed, Math.min(maxSpeed, vyRef.current));

    if (squeakTimeoutRef.current) {
      clearTimeout(squeakTimeoutRef.current);
    }

    setSqueaking(true);
    squeakTimeoutRef.current = setTimeout(() => setSqueaking(false), 300);
  }, []);

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", !ready && "invisible")}>
      <motion.div
        className="pointer-events-auto absolute cursor-pointer select-none"
        style={{ x, y, rotate, width: duckSize, height: duckSize }}
        onClick={handleClick}
        whileTap={{ scale: 1.3 }}
        title="Squeak!"
      >
        <motion.div
          animate={squeaking ? { scale: [1, 1.4, 0.8, 1.1, 1] } : {}}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <DuckSvg className="w-full h-full drop-shadow-md" />
          {squeaking && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-(--color-accent-text) select-none">
              quack!
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Draggable Digit ──────────────────────────────────────────────
function DraggableDigit({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.span
      className="inline-block cursor-grab select-none active:cursor-grabbing"
      initial={{ y: -80, opacity: 0, scale: 0.5 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 12,
          mass: 1.2,
          delay,
        },
      }}
      whileHover={{ scale: 1.1, rotate: Math.random() > 0.5 ? 5 : -5 }}
      whileTap={{ scale: 0.9 }}
      drag
      dragSnapToOrigin
      dragElastic={1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 15 }}
    >
      {children}
    </motion.span>
  );
}

// ── Main 404 View ────────────────────────────────────────────────
export const Error404View = () => {
  return (
    <>
      <PageMetaTags title="404: Not found" />
      <main className="relative flex flex-col items-center justify-center min-h-[70vh] page-pad overflow-hidden">
        {/* Bouncing duck in the background */}
        <BouncingDuck />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Draggable 404 */}
          <div
            className={cn(
              'flex items-baseline gap-2 md:gap-4 mb-6',
              'font-[family-name:var(--font-fraunces)] font-bold',
              'text-[clamp(5rem,15vw,10rem)] leading-none',
              'text-(--color-accent)',
            )}
          >
            <DraggableDigit delay={0}>4</DraggableDigit>
            <DraggableDigit delay={0.1}>0</DraggableDigit>
            <DraggableDigit delay={0.2}>4</DraggableDigit>
          </div>

          {/* Copy */}
          <motion.p
            className="text-lg md:text-xl text-(--color-ink-2) mb-2 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            This page wasn&rsquo;t in the blueprints.
          </motion.p>

          <motion.p
            className="text-sm text-(--color-ink-3) mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Even the rubber duck cannot debug this, let&apos;s head back home.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg',
                'bg-(--color-accent) text-white font-medium',
                'hover:opacity-90 transition-opacity',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)',
              )}
            >
              &larr; Take me home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};
