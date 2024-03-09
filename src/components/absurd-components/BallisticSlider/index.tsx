import { VolumeIcon, Volume1Icon, Volume2Icon } from 'lucide-react';
import { css } from 'goober';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useAnimate, motion } from 'framer-motion';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';
import { clamp } from '@/utils/math';

import { Debugger } from './Debugger';
import { TrackDebugger } from './TrackDebugger';

const calculateProjectilePath = (
  initialVelocity: number,
  angleDegree: number,
  g: number,
  totalTime: number,
) => {
  const intervals = totalTime / (totalTime / 32); // Ensure we have at least 32 points
  const thetaRad = (angleDegree * Math.PI) / 180; // Convert angle to radians
  const v0x = initialVelocity * Math.cos(thetaRad);
  const v0y = initialVelocity * Math.sin(thetaRad);
  const dt = totalTime / intervals;
  const path = [];

  for (let t = 0; t <= totalTime; t += dt) {
    const x = v0x * t;
    const y = v0y * t - 0.5 * g * t ** 2;
    if (y < 0) break; // Stop if projectile has "landed"
    path.push({ x, y });
  }

  // Add the final point
  path.push({ x: v0x * totalTime, y: 0 });

  return path;
};

type Props = {
  label?: string;
  initialValue?: number;
  height?: number;
  debug?: boolean;
};

type SliderState = 'idle' | 'dragging' | 'firing';
type Node = { x: number; y: number };

const PROJECTILE_SIZE = 12;

export const BallisticSlider = ({
  label = 'Adjust value',
  height = 100,
  debug = false,
  initialValue = 0,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const projectilePathRef = useRef<SVGPathElement>(null);
  const degreeRef = useRef<number>(0);
  const valueRef = useRef<number>(0);
  const maxDistanceRef = useRef<number>(0);
  const pathRef = useRef<Node[]>([]);
  const [state, setState] = useState<SliderState>('idle');
  const [value, setValue] = useState(initialValue);
  const [scope, animate] = useAnimate();

  const handleValueChange = async (newValue: number) => {
    setValue(newValue);
    const paths = pathRef.current;

    if (!paths) return;

    const distance = (newValue / 100) * maxDistanceRef.current;
    const yOffset = PROJECTILE_SIZE / 2;
    const xOffset = PROJECTILE_SIZE / 2;

    scope.current.style['offset-path'] = `path("${[
      `M ${xOffset},${yOffset}`,
      paths.map((p) => `${xOffset + p.x},${yOffset - p.y}`).join(' '),
      `${xOffset + distance},${yOffset}`,
    ].join(' ')}")`;

    await animate(
      scope.current,
      {
        offsetDistance: '50%',
      },
      {
        ease: 'circOut',
        duration: 1,
      },
    );
    await animate(
      scope.current,
      {
        offsetDistance: '100%',
      },
      {
        ease: 'easeIn',
        duration: 0.5,
      },
    );

    setState('idle');
  };

  useEffect(() => {
    // Animate the projectile back to the button when dragging.
    // This illustrates the loading of the "catapult"
    if (state === 'dragging') {
      const yOffset = PROJECTILE_SIZE / 2;
      const xOffset = PROJECTILE_SIZE / 2;
      const distance = (value / 100) * maxDistanceRef.current;

      // Set a straight path to starting position
      scope.current.style['offset-path'] = `path("${[
        `M ${xOffset},${yOffset}`,
        `${xOffset + distance},${yOffset}`,
      ].join(' ')}")`;

      animate(scope.current, { offsetDistance: '0%' }, { ease: 'easeInOut' });
    }
  }, [state, animate, scope, value]);

  const Icon = (() => {
    if (state !== 'idle') return VolumeIcon;
    if (value > 66) return Volume2Icon;
    if (value > 33) return Volume1Icon;
    return VolumeIcon;
  })();

  const startFiring = () => {
    if (state === 'dragging') {
      setState('firing');
      handleValueChange(valueRef.current);
    }
  };

  const startDragging = () => {
    if (state === 'idle') {
      setState('dragging');
    }
  };

  const handleMouseMove: MouseEventHandler = (e) => {
    if (state !== 'dragging') return;

    const c = containerRef.current;
    const b = buttonRef.current;
    const t = trackRef.current;
    const p = projectilePathRef.current;

    if (!c || !b || !t || !p) return;

    const containerRect = c.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    // Assume the container has a height of y and width of x
    // The max distance for the projectile will be x
    // minus some margins
    const maxDistance = c.clientWidth - 32;

    // We use the following formula as the premise.
    // v = sqrt(2 * g * x)
    // Assume g = 4, doesn't really matter since we are not simulating earth gravity;
    // just a random number to simulate gravity acceleration (or rather, deceleration in this case)
    const g = 4;
    // We add a factor of 1.02, so the max distance can be reached even if
    // the angle isn't exactly 45 degrees
    const initialVelocity = Math.sqrt(1.02 * g * maxDistance);

    // Next, we can calculate the firing angle based on mouse position and the button position
    const buttonOriginX = b.offsetLeft + b.offsetWidth / 2;
    const buttonOriginY = height / 2;
    const angleDegree =
      Math.atan2(mouseY - buttonOriginY, mouseX - buttonOriginX) *
      -(180 / Math.PI);
    const vy = initialVelocity * Math.sin(angleDegree * (Math.PI / 180));
    const timeInAir = angleDegree < 0 ? 0 : (2 * vy) / 4;

    const projectedDistance = clamp(
      0,
      initialVelocity * Math.cos(angleDegree * (Math.PI / 180)) * timeInAir,
      maxDistance,
    );

    const sliderValue = (projectedDistance / maxDistance) * 100;

    // These are for the debugger UIs
    c.style.setProperty('--button-x', `${buttonOriginX}px`);
    c.style.setProperty('--button-y', `${buttonOriginY}px`);
    c.style.setProperty('--mouse-x', `${mouseX}px`);
    c.style.setProperty('--mouse-y', `${mouseY}px`);
    c.style.setProperty('--angle-degree', `'${angleDegree.toFixed(0)}°'`);
    c.style.setProperty('--projected-distance', `${projectedDistance}px`);
    c.style.setProperty('--slider-value', `'${sliderValue.toFixed(0)}%'`);

    const paths = calculateProjectilePath(
      initialVelocity,
      angleDegree,
      g,
      timeInAir,
    );

    valueRef.current = Math.round(sliderValue);
    maxDistanceRef.current = Math.round(maxDistance);
    degreeRef.current = angleDegree;
    pathRef.current = paths;

    p.setAttribute(
      'd',
      [
        `M 0 ${height / 2}`,
        paths.map((p) => `L ${p.x} ${height / 2 - p.y}`).join(' '),
        `${projectedDistance} ${height / 2}`,
      ].join(' '),
    );
  };

  const showDebugger = debug && state !== 'idle';

  return (
    <div
      ref={containerRef}
      onMouseUpCapture={startFiring}
      onMouseMove={handleMouseMove}
      className={cn(
        css`
          height: ${height}px;
        `,
        'flex items-center justify-start',
        'relative',
      )}
    >
      <button
        className="relative isolate flex outline-none focus:outline-none"
        aria-label={label}
        aria-valuemin={0}
        aria-valuenow={value}
        aria-valuemax={100}
        draggable={false}
        ref={buttonRef}
        onMouseDown={startDragging}
      >
        <motion.div
          initial="idle"
          animate={state}
          variants={{
            idle: { rotateZ: 0, origin: 0.5, x: 0 },
            dragging: { rotateZ: -45, x: 16, y: 2 },
            firing: { rotateZ: -45, x: 16, y: 2 },
          }}
        >
          <Icon z={1} />
        </motion.div>
      </button>

      <div
        ref={trackRef}
        className={cn('ml-1 w-full flex-1 flex h-full relative')}
      >
        <div
          className={cn(
            'pointer-events-none w-[100%] h-[2px]',
            'absolute top-[50%] left-0 z-[-2] translate-y-[-1px]',
            css`
              background-color: ${getHslaColor('primary', 0.3)};
            `,
          )}
        />
        <div
          ref={scope}
          className={cn(
            'absolute rounded-full z-[-1]',
            'self-center',
            css`
              width: ${PROJECTILE_SIZE}px;
              height: ${PROJECTILE_SIZE}px;
              background-color: ${getHslaColor('primary')};
              left: 0;
            `,
          )}
        />

        {showDebugger && (
          <>
            <svg className="w-full h-full">
              <path
                ref={projectilePathRef}
                strokeWidth={2}
                strokeDasharray={4}
                stroke={getHslaColor('secondary', 0.7)}
                fill="transparent"
              />
            </svg>
            <TrackDebugger />
          </>
        )}
      </div>

      {showDebugger && <Debugger />}
    </div>
  );
};
