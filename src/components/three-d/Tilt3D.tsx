import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'motion/react';

import { useFinePointer } from '@/hooks/useFinePointer';
import { useReduceMotion } from '@/hooks/useReduceMotion';

import { cn } from '@/utils/styles/classNames';

/* ─────────────────────────────────────────────────────────────
   Tilt3D — a surface that rotates in real 3D under the pointer.

   The rotated element is a single node, so it can be a grid/flex
   item directly: perspective is baked into its own transform via
   `transformPerspective` rather than requiring a wrapper.

   Everything inside sits on a `preserve-3d` plane, so <Depth> can
   push content toward the viewer and pick up genuine parallax.
   ───────────────────────────────────────────────────────────── */

type Tilt3DContextValue = {
  /** Pointer position over the surface, normalised 0–1 on each axis. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Springs 0 → 1 while the pointer is over the surface. */
  hover: MotionValue<number>;
  /** False when 3D is suppressed (touch input or reduced motion). */
  enabled: boolean;
};

const Tilt3DContext = createContext<Tilt3DContextValue | null>(null);

/** Motion values for the nearest enclosing <Tilt3D>, or null outside one. */
export function useTilt3DContext() {
  return useContext(Tilt3DContext);
}

const TILT_SPRING: SpringOptions = { stiffness: 210, damping: 24, mass: 0.7 };
const HOVER_SPRING: SpringOptions = { stiffness: 220, damping: 30 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Peak rotation on each axis, in degrees. */
  max?: number;
  /** Viewing distance in px — smaller exaggerates the perspective. */
  perspective?: number;
  /** How far the surface rises toward the viewer on hover, in px. */
  lift?: number;
}

export function Tilt3D({
  children,
  className,
  max = 6,
  perspective = 1200,
  lift = 14,
}: Tilt3DProps) {
  const reduceMotion = useReduceMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduceMotion;

  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const hoverTarget = useMotionValue(0);
  const hover = useSpring(hoverTarget, HOVER_SPRING);

  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const rotateX = useSpring(rotateXTarget, TILT_SPRING);
  const rotateY = useSpring(rotateYTarget, TILT_SPRING);
  const z = useTransform(hover, (value) => value * lift);

  /* Layout is read once per frame inside rAF rather than on every pointermove,
     so a fast drag across a grid of cards can't thrash style recalculation. */
  const readPointer = useCallback(() => {
    frameRef.current = 0;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = clamp01((pointerRef.current.x - rect.left) / rect.width);
    const ny = clamp01((pointerRef.current.y - rect.top) / rect.height);

    pointerX.set(nx);
    pointerY.set(ny);

    // Positive rotateY pushes the right edge away, positive rotateX pushes the
    // top edge away — together they read as the surface dipping under the
    // cursor, like pressing a card into the page.
    rotateYTarget.set((nx - 0.5) * 2 * max);
    rotateXTarget.set((0.5 - ny) * 2 * max);
  }, [max, pointerX, pointerY, rotateXTarget, rotateYTarget]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(readPointer);
    },
    [readPointer],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      handlePointerMove(event);
      hoverTarget.set(1);
      setActive(true);
    },
    [handlePointerMove, hoverTarget],
  );

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }

    hoverTarget.set(0);
    rotateXTarget.set(0);
    rotateYTarget.set(0);
    pointerX.set(0.5);
    pointerY.set(0.5);
    setActive(false);
  }, [hoverTarget, pointerX, pointerY, rotateXTarget, rotateYTarget]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* If the pointer capability disappears mid-session (mouse unplugged, or the
     user turns on Reduce Motion), park the surface flat instead of stranding
     it mid-tilt. */
  useEffect(() => {
    if (!enabled) handlePointerLeave();
  }, [enabled, handlePointerLeave]);

  const context = useMemo<Tilt3DContextValue>(
    () => ({ pointerX, pointerY, hover, enabled }),
    [pointerX, pointerY, hover, enabled],
  );

  return (
    <Tilt3DContext.Provider value={context}>
      <motion.div
        ref={ref}
        className={cn('preserve-3d', className)}
        onPointerMove={enabled ? handlePointerMove : undefined}
        onPointerEnter={enabled ? handlePointerEnter : undefined}
        onPointerLeave={enabled ? handlePointerLeave : undefined}
        style={
          enabled
            ? {
                transformPerspective: perspective,
                rotateX,
                rotateY,
                z,
                // Only promote to its own layer while the surface is in play,
                // so a page full of cards doesn't hold compositor memory idle.
                willChange: active ? 'transform' : undefined,
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    </Tilt3DContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────
   Depth — lifts content off the tilted surface for parallax.
   ───────────────────────────────────────────────────────────── */

export interface DepthProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Distance toward the viewer, in px. */
  z?: number;
  children: React.ReactNode;
}

export function Depth({ z = 18, className, children, ...rest }: DepthProps) {
  const context = useTilt3DContext();

  return (
    <div
      className={cn('preserve-3d', className)}
      style={
        context?.enabled
          ? { transform: `translate3d(0, 0, ${z}px)` }
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tilt3DSheen — pointer-tracked specular highlight.

   Renders as a child of the element whose radius it should match
   (border-radius: inherit), so it never has to know about it.
   ───────────────────────────────────────────────────────────── */

export function Tilt3DSheen({ className }: { className?: string }) {
  const context = useTilt3DContext();

  // Stand-ins so the hooks below stay unconditional when rendered outside a
  // <Tilt3D>; the component bails out before they reach the DOM.
  const idleX = useMotionValue(0.5);
  const idleY = useMotionValue(0.5);

  const x = useTransform(
    context?.pointerX ?? idleX,
    (value) => `${value * 100}%`,
  );
  const y = useTransform(
    context?.pointerY ?? idleY,
    (value) => `${value * 100}%`,
  );
  // Kept tight on purpose: a wide gradient washes the whole surface and reads
  // as grime rather than as a highlight.
  const background = useMotionTemplate`radial-gradient(38% 62% at ${x} ${y}, var(--tilt-sheen), transparent 74%)`;

  if (!context?.enabled) return null;

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className,
      )}
      style={{ background, opacity: context.hover }}
    />
  );
}
