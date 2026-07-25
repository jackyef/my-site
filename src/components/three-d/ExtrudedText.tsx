import React from 'react';

import { useTilt3DContext } from '@/components/three-d/Tilt3D';

import { cn } from '@/utils/styles/classNames';

/* ─────────────────────────────────────────────────────────────
   ExtrudedText — gives glyphs a solid body.

   Stacks copies of the same content at descending translateZ so
   the type reads as a machined block rather than flat fill. Needs
   a perspective ancestor (a <Tilt3D>, typically) to be visible;
   without one it collapses back to plain text at zero cost.
   ───────────────────────────────────────────────────────────── */

export interface ExtrudedTextProps {
  children: React.ReactNode;
  /** Total depth of the body, in px. */
  depth?: number;
  /**
   * Copies used to fake the body. Steps need to stay under ~2px or the
   * stack separates into visible bands when viewed off-axis.
   */
  layers?: number;
  /** Colour of the extruded sides. */
  sideColor?: string;
  className?: string;
}

export function ExtrudedText({
  children,
  depth = 30,
  layers = 16,
  sideColor = 'var(--extrude-side)',
  className,
}: ExtrudedTextProps) {
  const tilt = useTilt3DContext();

  // Inside a Tilt3D that has opted out (touch, reduced motion) there is no
  // perspective to render into, so skip the stack entirely.
  const flattened = tilt !== null && !tilt.enabled;
  const step = depth / layers;

  return (
    <span className={cn('preserve-3d relative inline-block', className)}>
      {!flattened &&
        Array.from({ length: layers }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="absolute inset-0 whitespace-pre"
            style={{
              color: sideColor,
              transform: `translateZ(${-(index + 1) * step}px)`,
            }}
          >
            {children}
          </span>
        ))}

      <span className="relative">{children}</span>
    </span>
  );
}
