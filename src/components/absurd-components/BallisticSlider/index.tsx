import { VolumeIcon, Volume1Icon, Volume2Icon } from 'lucide-react';
import { css } from 'goober';
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAnimate, motion } from 'framer-motion';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';
import { clamp } from '@/utils/math';

import { Debugger } from './Debugger';
import { TrackDebugger } from './TrackDebugger';
import { calculateProjectilePath } from './helpers';

type Props = {
  label?: string;
  height?: number;
  debug?: boolean;
  onValueChange?: (value: number) => void;
};

type SliderState = 'idle' | 'dragging' | 'firing';
type Coordinate = { x: number; y: number };

const PROJECTILE_SIZE = 12;

export const BallisticSlider = ({
  label = 'Adjust value',
  height = 100,
  debug = false,
  onValueChange,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const projectilePathRef = useRef<SVGPathElement>(null);
  const valueRef = useRef<number>(0);
  const maxDistanceRef = useRef<number>(0);
  const pathRef = useRef<Coordinate[]>([]);

  const [state, setState] = useState<SliderState>('idle');
  const [value, setValue] = useState(0);
  const [scope, animate] = useAnimate();

  const handleValueChange = async (newValue: number) => {
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
    setValue(newValue);
    onValueChange?.(newValue);
  };

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

      const yOffset = PROJECTILE_SIZE / 2;
      const xOffset = PROJECTILE_SIZE / 2;
      const distance = (value / 100) * maxDistanceRef.current;

      // Set a straight path to starting position
      scope.current.style['offset-path'] = `path("${[
        `M ${xOffset},${yOffset}`,
        `${xOffset + distance},${yOffset}`,
      ].join(' ')}")`;

      // You read that right. We intentionally ask framer-motion to animate to
      // -0%; Using 0%, it won't work for some reason. 🤷‍♂️
      animate(scope.current, { offsetDistance: '-0%' }, { ease: 'easeInOut' });
    }
  };

  const handlePointerMove = useCallback(
    (x: number, y: number) => {
      if (state !== 'dragging') return;

      const c = containerRef.current;
      const b = buttonRef.current;
      const p = projectilePathRef.current;

      if (!c || !b || !p) return;

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
      // the angle isn't exactly 45 degrees, to improve usability
      const initialVelocity = Math.sqrt(1.02 * g * maxDistance);

      // Next, we can calculate the firing angle based on mouse position and the button position
      const buttonOriginX = b.offsetLeft + b.offsetWidth / 2;
      const buttonOriginY = height / 2;
      const angleDegree =
        Math.atan2(y - buttonOriginY, x - buttonOriginX) * -(180 / Math.PI);
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
      c.style.setProperty('--mouse-x', `${x}px`);
      c.style.setProperty('--mouse-y', `${y}px`);
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
      pathRef.current = paths;

      p.setAttribute(
        'd',
        [
          `M 0 ${height / 2}`,
          paths.map((p) => `L ${p.x} ${height / 2 - p.y}`).join(' '),
          `${projectedDistance} ${height / 2}`,
        ].join(' '),
      );
    },
    [height, state],
  );

  const handleMouseMove: MouseEventHandler = (e) => {
    if (state !== 'dragging') return;

    const c = containerRef.current;

    if (!c) return;

    const containerRect = c.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    handlePointerMove(mouseX, mouseY);
  };

  // Touch events have to be handled differently.
  // We need to prevent touchmove causing scrolling by doing e.preventDefault().
  // This requires the eventListener to be non-passive.
  // React automatically sets passive to true, when passing onTouchMove prop,
  // so we have to bypass it and addEventListener to the DOM node directly.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    if (state !== 'dragging') return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      const containerRect = c.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];

      const mouseX = touch.pageX - containerRect.left;
      const mouseY = touch.pageY - containerRect.top;

      handlePointerMove(mouseX, mouseY);
    };

    c.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      c.removeEventListener('touchmove', handleTouchMove);
    };
  }, [state, handlePointerMove]);

  const showDebugger = debug && state !== 'idle';

  return (
    <div
      ref={containerRef}
      onMouseUpCapture={startFiring}
      onTouchEndCapture={startFiring}
      onMouseMove={handleMouseMove}
      className={cn(
        css`
          height: ${height}px;
        `,
        'flex items-center justify-start',
        'relative overflow-y-visible',
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
        onTouchStart={startDragging}
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

      <div className={cn('ml-1 w-full flex-1 flex h-full relative')}>
        <div
          className={cn(
            'pointer-events-none w-[100%] h-[2px] rounded-full',
            'absolute top-[50%] left-0 z-[-2] translate-y-[-1px]',
            css`
              background-color: ${getHslaColor('primary', 0.3)};
            `,
          )}
        />
        <div
          ref={scope}
          className={cn(
            'absolute rounded-full',
            'self-center',
            css`
              width: ${PROJECTILE_SIZE}px;
              height: ${PROJECTILE_SIZE}px;
              background-color: ${getHslaColor('primary')};
              left: 0;
            `,
          )}
        />

        {state !== 'idle' && (
          <svg className="w-full h-full overflow-visible">
            <path
              ref={projectilePathRef}
              strokeWidth={2}
              strokeDasharray={4}
              stroke={getHslaColor('secondary', 0.7)}
              fill="transparent"
            />
          </svg>
        )}
        {showDebugger && <TrackDebugger />}
      </div>

      {showDebugger && <Debugger />}
    </div>
  );
};
