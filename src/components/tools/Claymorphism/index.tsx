import { css } from 'goober';
import { useState } from 'react';
import copy from 'clipboard-copy';

import { highlight } from '@/components/common/CodeHighlight';
import { toast } from '@/lib/toast';

import { cn } from '@/utils/styles/classNames';

import { useClayCss } from './useClayCss';

const radianToDegree = (radian: number) => radian * (180 / Math.PI);
const hexToRgb = (hex: `#${string}`) => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  return { red, green, blue };
};

export const ClaymorphismTools = () => {
  const [lightAngle, setLightAngle] = useState((1 * Math.PI) / 3);
  const [elevation, setElevation] = useState(0.5);
  const [baseShadowColors, setBaseShadowColors] = useState({
    red: 0,
    green: 0,
    blue: 0,
  });

  const containerClass = css`
    margin: 0 auto;
    width: clamp(150px, 80vw, 400px);
  `;

  const { boxShadowCss } = useClayCss({
    lightAngle,
    elevation,
    baseShadowColors,
  });

  const clayClass = css`
    ${boxShadowCss}
    border-radius: 30px;
    transform: scale(var(--scale));
    transition: 0.2s;
  `;

  const handleCodeCopy = () => {
    copy(boxShadowCss);
    toast({ text: 'Copied to clipboard!' });
  };

  return (
    <div
      className="py-16"
      style={
        {
          '--elevation': elevation,

          '--scale': 'calc(1 + var(--elevation) * 0.05)',
        } as any
      }
    >
      <div
        className={cn(
          clayClass,
          containerClass,
          'bg-(--color-bg-panel)',
          'p-8',
          'flex',
          'flex-col',
          'space-y-4',
        )}
      >
        <div className={cn('flex', 'flex-col', 'space-y-1')}>
          <label htmlFor="shadowColor">Base shadow color</label>
          <input
            id="shadowColor"
            name="shadowColor"
            type="color"
            value={`#${baseShadowColors.red.toString(
              16,
            )}${baseShadowColors.green.toString(
              16,
            )}${baseShadowColors.blue.toString(16)}`}
            onChange={(e) =>
              setBaseShadowColors(hexToRgb(e.target.value as `#${string}`))
            }
          />
        </div>

        <div className={cn('flex', 'flex-col', 'space-y-1')}>
          <label htmlFor="lightSource">
            Light source ({Math.round(radianToDegree(lightAngle))} degree)
          </label>

          <input
            id="lightSource"
            type="range"
            min={0}
            max={2 * Math.PI}
            step={0.02}
            value={lightAngle}
            onChange={(e) => setLightAngle(Number(e.target.value) || 0)}
          />
        </div>

        <div className={cn('flex', 'flex-col', 'space-y-1')}>
          <label htmlFor="elevation">Elevation ({elevation})</label>
          <input
            id="elevation"
            name="elevation"
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={elevation}
            onChange={(e) => setElevation(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div
        className={cn(
          clayClass,
          'p-8',
          'mt-16',
          'mx-4',
          'flex',
          'flex-col',
          'space-y-4',
          // Was a hardcoded bg-gray-800. The code inside is now coloured by the
          // --code-* palette, so the surface under it has to move with the
          // theme too or light-theme ink lands on a dark box.
          'bg-(--code-bg)',
          'overflow-hidden',
        )}
      >
        <pre
          className="language-css rounded-md py-3 px-4 overflow-x-auto"
          tabIndex={0}
          role="button"
          aria-label="Copy CSS code to clipboard"
          onClick={handleCodeCopy}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCodeCopy();
            }
          }}
        >
          <code className="language-css text-(--code-base)">
            {highlight(boxShadowCss, 'css')}
          </code>
        </pre>
      </div>
    </div>
  );
};
