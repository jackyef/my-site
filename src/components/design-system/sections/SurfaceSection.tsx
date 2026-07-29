import { useState } from 'react';

import { Surface } from '@/components/common/Surface';
import { Text } from '@/components/common/Text';

import { cn } from '@/utils/styles/classNames';

import {
  KEYFRAMES,
  MOTION_STEPS,
  RADIUS_STEPS,
  SHADOW_TOKENS,
} from '../constants';
import { Block, CopyChip, Section } from '../Scaffold';

function ShadowSample({ token, usage }: { token: string; usage: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-24 rounded-xl border border-(--color-border) bg-(--color-bg-panel)"
        style={{ boxShadow: `var(${token})` }}
      />
      <div>
        <CopyChip value={token} className="-ml-[6px]" />
        <Text variant="caption" color="ink-4" className="px-[6px]">
          {usage}
        </Text>
      </div>
    </div>
  );
}

export function SurfaceSection() {
  // Remounting the demo restarts the CSS animations from zero — the only way to
  // replay a keyframe without reaching for the Web Animations API.
  const [motionKey, setMotionKey] = useState(0);

  return (
    <Section
      id="surfaces"
      eyebrow="Foundations"
      title={
        <>
          Elevation, shape and <em>motion</em>
        </>
      }
      intro="Four shadows, five radii, and a small set of durations. The shadows are theme-aware — they get deeper and more opaque as the background darkens, because the same rgba would disappear against dark."
    >
      <Block
        title="Elevation"
        description="Rendered on a real Surface, on the page background, in the theme you are in. Surface takes these by name via its elevation prop."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHADOW_TOKENS.map((s) => (
            <ShadowSample key={s.token} token={s.token} usage={s.usage} />
          ))}
        </div>
      </Block>

      <Block
        title="Surface elevations"
        description="The same four steps as the Surface primitive exposes them."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(['none', 'sm', 'md', 'lg'] as const).map((elevation) => (
            <Surface
              key={elevation}
              elevation={elevation}
              rounded="xl"
              className="px-4 py-5 text-center"
            >
              <code className="font-mono text-[12px] text-(--color-ink-2)">
                elevation=&quot;{elevation}&quot;
              </code>
            </Surface>
          ))}
        </div>
      </Block>

      <Block
        title="Radius"
        description="Surface and Card expose sm through xl; full is for pills — buttons, chips and the status dot."
      >
        <div className="flex flex-wrap gap-5">
          {RADIUS_STEPS.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-20 h-20 border border-(--color-border-hi) bg-(--color-bg-active)',
                  r.className,
                )}
              />
              <div className="text-center">
                <code className="block font-mono text-[11px] text-(--color-ink-2)">
                  {r.className}
                </code>
                <span className="text-[10px] text-(--color-ink-4) tabular-nums">
                  {r.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Borders"
        description="Two weights, plus the rule about where they belong: the content area carries the blueprint grid, so section dividers inside it clash. Borders live on panels, on the sidebar, and on controls."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['--color-border', 'Default hairline'],
            ['--color-border-hi', 'Controls, higher contrast'],
          ].map(([token, label]) => (
            <div
              key={token}
              className="rounded-lg border-2 bg-(--color-bg-panel) px-4 py-5"
              style={{ borderColor: `var(${token})` }}
            >
              <CopyChip value={token} className="-ml-[6px]" />
              <Text variant="caption" color="ink-4" className="px-[6px]">
                {label}
              </Text>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Motion"
        description="Durations are literals in the components rather than custom properties. They are listed here so new code reaches for one of these speeds instead of inventing a sixth."
        aside={
          <button
            type="button"
            onClick={() => setMotionKey((k) => k + 1)}
            className={cn(
              'text-[12px] font-medium px-[10px] py-[5px] rounded-full cursor-pointer',
              'border border-(--color-border-hi) bg-transparent text-(--color-ink-2)',
              'transition-[border-color,color] duration-[180ms]',
              'hover:border-(--color-accent) hover:text-(--color-accent-text)',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)',
            )}
          >
            Replay
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {MOTION_STEPS.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-3 py-[10px]"
            >
              <code className="font-mono text-[12px] text-(--color-accent-text)">
                {m.label}
              </code>
              <Text variant="caption-sm" className="mt-[3px]">
                {m.usage}
              </Text>
            </div>
          ))}
        </div>

        <div key={motionKey} className="flex flex-wrap gap-4">
          {KEYFRAMES.map((k) => (
            <div
              key={k.name}
              className="flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-3"
            >
              <span
                className={cn(
                  'w-[9px] h-[9px] rounded-full bg-(--color-accent) shrink-0',
                  k.className,
                )}
                aria-hidden="true"
              />
              <div>
                <code className="block font-mono text-[11px] text-(--color-ink-2)">
                  {k.name}
                </code>
                <span className="text-[10px] text-(--color-ink-4)">
                  {k.usage}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Text variant="caption" color="ink-4" className="mt-4 max-w-[68ch]">
          All of it collapses to 0.01ms under{' '}
          <code className="font-mono">prefers-reduced-motion</code>, which is
          handled once in globals.css rather than per component.
        </Text>
      </Block>
    </Section>
  );
}
