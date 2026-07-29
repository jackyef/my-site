import { useMemo } from 'react';

import { Text } from '@/components/common/Text';

import { cn } from '@/utils/styles/classNames';

import { COLOR_GROUPS, THEMES, type TokenSpec } from '../constants';
import { toHex } from '../color';
import { useResolvedTokens } from '../useResolvedTokens';
import { Block, CopyChip, Section } from '../Scaffold';

const ALL_COLOR_TOKENS = COLOR_GROUPS.flatMap((g) =>
  g.tokens.map((t) => t.token),
);

function SwatchCell({
  value,
  theme,
}: {
  value: string | undefined;
  theme: string;
}) {
  return (
    <div className="flex flex-col items-stretch gap-[5px] min-w-0">
      {/* The swatch sits inside its own theme scope so the chequerboard behind
          a translucent token, and the hairline around a near-white one, both
          come from the theme being shown rather than the one in the tab. */}
      <div
        data-theme={theme}
        className="h-11 rounded-md border border-(--color-border) bg-(--color-bg) p-[3px]"
      >
        <div
          className="w-full h-full rounded-[3px]"
          style={{ background: value ?? 'transparent' }}
        />
      </div>
      <span className="font-mono text-[10px] leading-none text-(--color-ink-4) tabular-nums truncate">
        {/* The column headers are desktop-only, so each swatch names its own
            theme once the grid stacks. */}
        <span className="md:hidden uppercase tracking-[0.06em] mr-[6px]">
          {theme}
        </span>
        {value ? toHex(value) : '—'}
      </span>
    </div>
  );
}

function TokenRow({
  spec,
  values,
}: {
  spec: TokenSpec;
  values: Record<string, Record<string, string>>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(72px,110px))] gap-x-4 gap-y-2 items-start py-3 border-b border-(--color-border) last:border-0">
      <div className="min-w-0">
        <CopyChip value={spec.token} className="-ml-[6px]" />
        <Text variant="caption" color="ink-4" className="px-[6px] mt-[1px]">
          {spec.usage}
        </Text>
      </div>
      {THEMES.map((theme) => (
        <SwatchCell
          key={theme}
          theme={theme}
          value={values[theme]?.[spec.token]}
        />
      ))}
    </div>
  );
}

export function ColorSection() {
  const resolved = useResolvedTokens(ALL_COLOR_TOKENS);
  const groups = useMemo(() => COLOR_GROUPS, []);

  return (
    <Section
      id="color"
      eyebrow="Foundations"
      title={
        <>
          Colour, in <em>every theme at once</em>
        </>
      }
      intro="Each token is resolved live out of the DOM in all three themes, so what you see is what globals.css currently says — not a copy of it. Click any name to copy it."
    >
      {groups.map((group) => (
        <Block
          key={group.id}
          title={group.title}
          description={group.description}
        >
          <div className="rounded-xl border border-(--color-border) bg-(--color-bg-panel) px-4 py-1">
            {/* Column headers, desktop only — on mobile each swatch is wide
                enough to read without one. */}
            <div className="hidden md:grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(72px,110px))] gap-x-4 pt-3 pb-1">
              <span />
              {THEMES.map((theme) => (
                <span
                  key={theme}
                  className="text-[10px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-4)"
                >
                  {theme}
                </span>
              ))}
            </div>
            {group.tokens.map((spec) => (
              <TokenRow key={spec.token} spec={spec} values={resolved} />
            ))}
          </div>
        </Block>
      ))}

      <Block
        title="Using them"
        description="Tailwind v4's parenthesis shorthand takes a custom property directly. There is no colour scale in the Tailwind config to go through — the tokens are the scale."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['bg-(--color-bg-panel)', 'Backgrounds'],
            ['text-(--color-ink-2)', 'Text'],
            ['border-(--color-border)', 'Borders'],
            ['shadow-(--shadow-md)', 'Shadows'],
          ].map(([cls, label]) => (
            <div
              key={cls}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-[10px]',
                'border border-(--color-border) bg-(--color-bg-panel)',
              )}
            >
              <code className="font-mono text-[12px] text-(--color-accent-text)">
                {cls}
              </code>
              <span className="text-[11px] text-(--color-ink-4) shrink-0">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Block>
    </Section>
  );
}
