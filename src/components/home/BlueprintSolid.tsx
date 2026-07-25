import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

import { Cube3D } from '@/components/three-d/Cube3D';

import { useFinePointer } from '@/hooks/useFinePointer';
import { useReduceMotion } from '@/hooks/useReduceMotion';

import { cn } from '@/utils/styles/classNames';

/* ─────────────────────────────────────────────────────────────
   BlueprintSolid — the hero's drafted volume.

   A translucent CSS-3D cube with grid-ruled faces, orbited by two
   dashed guide rings. It idles on its own and turns to follow the
   pointer anywhere on the page, so it reads as an object sitting
   on the blueprint rather than a decal printed on it.
   ───────────────────────────────────────────────────────────── */

const SIZE = 220;
const CUBE = 112;
const RING_OUTER = 188;
const RING_INNER = 142;

/**
 * Resting pitch. Negative tips the near edge toward the viewer, which is what
 * puts the top face in view.
 */
const BASE_PITCH = -14;
const MAX_YAW = 20;
const MAX_PITCH = 13;
/** Distance from the solid's centre over which the pointer still steers it. */
const INFLUENCE = 560;

const SPRING = { stiffness: 90, damping: 20, mass: 0.9 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const CORNER_POSITIONS = [
  'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  'right-0 top-0 translate-x-1/2 -translate-y-1/2',
  'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
  'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
];

/**
 * Drafting marks on a face: vertex squares plus a centre target.
 * Deliberately symmetric, so faces read the same from either side of the
 * translucent solid as it turns.
 */
function FaceMarks() {
  return (
    <>
      {CORNER_POSITIONS.map((position) => (
        <span
          key={position}
          className={cn('absolute w-[5px] h-[5px]', position)}
          style={{ background: 'var(--solid-edge)' }}
        />
      ))}

      <span
        className="absolute left-1/2 top-1/2 w-[18px] h-px -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'var(--solid-edge)' }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-px h-[18px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'var(--solid-edge)' }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-[15px] h-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: 'var(--solid-edge)' }}
      />
    </>
  );
}

export function BlueprintSolid({ className }: { className?: string }) {
  const reduceMotion = useReduceMotion();
  const finePointer = useFinePointer();
  const steerable = finePointer && !reduceMotion;

  const ref = useRef<HTMLDivElement>(null);

  const yawTarget = useMotionValue(0);
  const pitchTarget = useMotionValue(BASE_PITCH);
  const yaw = useSpring(yawTarget, SPRING);
  const pitch = useSpring(pitchTarget, SPRING);

  useEffect(() => {
    if (!steerable) {
      yawTarget.set(0);
      pitchTarget.set(BASE_PITCH);
      return;
    }

    let frame = 0;
    const pointer = { x: 0, y: 0 };

    const apply = () => {
      frame = 0;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;

      const dx = clamp(
        (pointer.x - (rect.left + rect.width / 2)) / INFLUENCE,
        -1,
        1,
      );
      const dy = clamp(
        (pointer.y - (rect.top + rect.height / 2)) / INFLUENCE,
        -1,
        1,
      );

      // Turn toward the cursor: the far side swings back, and the solid looks
      // down when the pointer drops below it.
      yawTarget.set(dx * MAX_YAW);
      pitchTarget.set(BASE_PITCH - dy * MAX_PITCH);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [steerable, yawTarget, pitchTarget]);

  const animation = (value: string) =>
    reduceMotion ? undefined : { animation: value };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative select-none', className)}
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Contact shadow — kept outside the 3D chain because `filter` would
          flatten it out of the scene. */}
      <div
        className="solid-shadow absolute left-1/2 bottom-[10px] -translate-x-1/2 w-[124px] h-[16px] rounded-[50%]"
        style={animation('solid-shadow-breathe 7s ease-in-out infinite')}
      />

      {/* Pointer parallax */}
      <motion.div
        className="preserve-3d absolute inset-0"
        style={{ transformPerspective: 620, rotateX: pitch, rotateY: yaw }}
      >
        {/* Idle float */}
        <div
          className="preserve-3d absolute inset-0"
          style={animation('solid-bob 7s ease-in-out infinite')}
        >
          {/* Outer guide ring */}
          <div
            className="preserve-3d absolute inset-0 grid place-items-center"
            style={animation('solid-spin 34s linear infinite')}
          >
            <div
              className="solid-ring"
              style={{
                width: RING_OUTER,
                height: RING_OUTER,
                transform: 'rotateX(70deg)',
              }}
            />
          </div>

          {/* Inner guide ring, counter-rotating */}
          <div
            className="preserve-3d absolute inset-0 grid place-items-center"
            style={animation('solid-spin 21s linear infinite reverse')}
          >
            <div
              className="solid-ring"
              style={{
                width: RING_INNER,
                height: RING_INNER,
                transform: 'rotateX(66deg) rotateY(24deg)',
              }}
            />
          </div>

          {/* The solid */}
          <div
            className="preserve-3d absolute inset-0 grid place-items-center"
            style={animation('solid-spin 26s linear infinite')}
          >
            <Cube3D
              size={CUBE}
              faceClassName="solid-face"
              faceClassNames={{
                front: 'solid-face-front',
                back: 'solid-face-front',
              }}
              faces={{
                front: <FaceMarks />,
                back: <FaceMarks />,
                right: <FaceMarks />,
                left: <FaceMarks />,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
