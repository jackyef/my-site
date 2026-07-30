import { CheckIcon } from 'lucide-react';

import { Heading } from '@/components/common/Heading';
import { SectionLabel } from '@/components/common/SectionLabel';
import { Text } from '@/components/common/Text';

import { useFontPairing } from '@/hooks/useFontPairing';

import { FONT_PAIRINGS } from '@/utils/fonts';
import { cn } from '@/utils/styles/classNames';

import { Block, Section, Snippet } from '../Scaffold';

const SPECIMEN = 'Handgloves — 0123456789';

/**
 * The display ladder gets the short form. "Handgloves" is the traditional
 * specimen word — it exercises ascenders, descenders, round and diagonal forms
 * in ten characters — and at 64px the long form needs about 740px, which is
 * more than the column has.
 */
const DISPLAY_SPECIMEN = 'Handgloves';

const DISPLAY_SCALE = [
  {
    level: 'hero' as const,
    spec: 'Fraunces · clamp(40px, 5vw, 64px) · 700 · -0.03em · 1.1',
    note: 'Homepage hero only',
  },
  {
    level: 'page' as const,
    spec: 'Fraunces · clamp(32px, 4vw, 50px) · 700 · -0.025em · 1.15',
    note: 'Every page title, via PageHeader',
  },
  {
    level: 1 as const,
    spec: 'Fraunces · 1.875rem → 3rem · 700',
    note: 'In-content h1',
  },
  {
    level: 2 as const,
    spec: 'Fraunces · 1.5rem → 1.875rem · 700',
    note: 'Section headings',
  },
  {
    level: 3 as const,
    spec: 'Fraunces · 1.25rem → 1.5rem · 700',
    note: 'Sub-sections',
  },
  {
    level: 4 as const,
    spec: 'Fraunces · 1.125rem → 1.25rem · 700',
    note: 'Block headings',
  },
];

const TEXT_SCALE = [
  { variant: 'lead' as const, spec: '1.125rem → 1.25rem · relaxed' },
  { variant: 'body' as const, spec: '1rem · relaxed' },
  { variant: 'body-sm' as const, spec: '0.875rem · relaxed' },
  { variant: 'caption' as const, spec: '13px · normal' },
  { variant: 'caption-sm' as const, spec: '11px · normal' },
];

export function TypographySection() {
  const { pairing, setPairing } = useFontPairing();

  return (
    <Section
      id="typography"
      eyebrow="Foundations"
      title={
        <>
          Type, on <em>six switchable faces</em>
        </>
      }
      intro="Fraunces carries every heading and never changes. What the visitor can change is the face that carries the reading — and the mono that goes with it. Because the display face is fixed, the headings below look the same whichever pairing is active; only the body copy moves."
    >
      <Block
        title="Display scale"
        description="Rendered by the Heading primitive. hero and page map to .hero-h1 / .page-title in globals.css; the numbered levels are Tailwind utilities."
      >
        {/* Specimen under its own spec rather than beside it. Side by side, the
            largest steps only got a fraction of the column and clipped after a
            few letters — which is the one thing a type ladder must not do. */}
        <div className="rounded-xl border border-(--color-border) bg-(--color-bg-panel) divide-y divide-(--color-border)">
          {DISPLAY_SCALE.map((item) => (
            <div key={String(item.level)} className="px-4 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-[6px]">
                <code className="font-mono text-[11px] text-(--color-ink-3)">
                  {`level={${
                    typeof item.level === 'string'
                      ? `'${item.level}'`
                      : item.level
                  }}`}
                </code>
                <Text variant="caption-sm" as="span">
                  {item.spec}
                </Text>
                <Text variant="caption-sm" color="ink-3" as="span">
                  {item.note}
                </Text>
              </div>
              <Heading level={item.level} as="p">
                {DISPLAY_SPECIMEN}
              </Heading>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Text scale"
        description="The Text primitive. Each variant carries a default ink colour matching the hierarchy, overridable with the color prop."
      >
        <div className="rounded-xl border border-(--color-border) bg-(--color-bg-panel) divide-y divide-(--color-border)">
          {TEXT_SCALE.map((item) => (
            <div key={item.variant} className="px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-[2px]">
                <code className="font-mono text-[11px] text-(--color-ink-3)">
                  {`variant="${item.variant}"`}
                </code>
                <Text variant="caption-sm" as="span">
                  {item.spec}
                </Text>
              </div>
              {/* Full width, so the sample shows the measure and leading a
                  paragraph actually gets rather than a clipped fragment. */}
              <Text variant={item.variant}>
                The quick brown fox jumps over the lazy dog
              </Text>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Labels"
        description="Two small-caps treatments. The eyebrow is accent-coloured and sits above page titles; SectionLabel is the muted one, used inside panels and nav groups."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-4">
            <p className="eyebrow mb-2">Eyebrow — 11px / 600 / 0.12em</p>
            <code className="font-mono text-[11px] text-(--color-ink-3)">
              .eyebrow
            </code>
          </div>
          <div className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-4">
            <SectionLabel className="mb-2">
              SectionLabel — 11px / 600 / 0.08em
            </SectionLabel>
            <code className="font-mono text-[11px] text-(--color-ink-3)">
              &lt;SectionLabel&gt;
            </code>
          </div>
        </div>
      </Block>

      <Block
        title="Pairings"
        description="Picking one here changes the whole site immediately — this is the same store the sidebar's font picker writes to, not a preview. The reading size is one value shared by every face; only the leading is nudged per face, because x-heights differ enough to change how tight a paragraph feels at the same size."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {FONT_PAIRINGS.map((option) => {
            const isActive = pairing === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPairing(option.id)}
                aria-pressed={isActive}
                className={cn(
                  'text-left rounded-xl border px-4 py-[14px] cursor-pointer',
                  'transition-[background,border-color] duration-[180ms]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)',
                  isActive
                    ? 'border-(--color-accent-l) bg-(--color-bg-active)'
                    : 'border-(--color-border) bg-(--color-bg-panel) hover:border-(--color-border-hi)',
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-[6px]">
                  <span
                    className="text-[15px] font-semibold text-(--color-ink)"
                    style={{ fontFamily: `var(${option.cssVar})` }}
                  >
                    {option.label}
                  </span>
                  {isActive && (
                    <CheckIcon
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-(--color-accent-text)"
                    />
                  )}
                </div>
                <p
                  className="text-[13px] leading-[1.55] text-(--color-ink-3) m-0"
                  style={{ fontFamily: `var(${option.cssVar})` }}
                >
                  {SPECIMEN} — {option.description.toLowerCase()}.
                </p>
              </button>
            );
          })}
        </div>
      </Block>

      <Block
        title="Code"
        description="The mono face comes from the active pairing too. Syntax colours are the --code-* tokens, which is why a code block re-tints with the theme instead of staying dark on a light page."
      >
        <Snippet
          lang="css"
          code={`/* The three faces, resolved from the active pairing */
--font-sans:  var(--font-text-face), system-ui, sans-serif;
--font-serif: var(--font-display-face), Georgia, serif;
--font-mono:  var(--font-mono-face), ui-monospace, monospace;`}
        />
      </Block>
    </Section>
  );
}
