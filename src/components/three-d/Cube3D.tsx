import React from 'react';

import { cn } from '@/utils/styles/classNames';

/* ─────────────────────────────────────────────────────────────
   Cube3D — six real faces on a preserve-3d plane.

   Each face is pushed out half the cube's size along its own
   normal, so the solid stays centred on its parent's origin and
   can be rotated freely by whatever wraps it.
   ───────────────────────────────────────────────────────────── */

export type CubeFace = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

const FACE_ORDER: CubeFace[] = [
  'front',
  'back',
  'right',
  'left',
  'top',
  'bottom',
];

const FACE_ROTATION: Record<CubeFace, string> = {
  front: 'rotateY(0deg)',
  back: 'rotateY(180deg)',
  right: 'rotateY(90deg)',
  left: 'rotateY(-90deg)',
  top: 'rotateX(90deg)',
  bottom: 'rotateX(-90deg)',
};

export interface Cube3DProps {
  /** Edge length in px. */
  size: number;
  className?: string;
  /** Applied to every face. */
  faceClassName?: string;
  /** Per-face overrides, merged after `faceClassName`. */
  faceClassNames?: Partial<Record<CubeFace, string>>;
  /** Content rendered inside a given face. */
  faces?: Partial<Record<CubeFace, React.ReactNode>>;
  style?: React.CSSProperties;
}

export function Cube3D({
  size,
  className,
  faceClassName,
  faceClassNames,
  faces,
  style,
}: Cube3DProps) {
  const half = size / 2;

  return (
    <div
      className={cn('preserve-3d relative', className)}
      style={{ width: size, height: size, ...style }}
    >
      {FACE_ORDER.map((face) => (
        <div
          key={face}
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            faceClassName,
            faceClassNames?.[face],
          )}
          style={{
            transform: `${FACE_ROTATION[face]} translateZ(${half}px)`,
          }}
        >
          {faces?.[face]}
        </div>
      ))}
    </div>
  );
}
