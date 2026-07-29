import { Text } from '@/components/common/Text';

import { cn } from '@/utils/styles/classNames';

import { EFFECT_UTILITIES, LAYOUT_UTILITIES } from '../constants';
import { Block, CopyChip, Section, Snippet } from '../Scaffold';

export function PatternsSection() {
  return (
    <Section
      id="patterns"
      eyebrow="Patterns"
      title={
        <>
          Layout and <em>conventions</em>
        </>
      }
      intro="The rules that are not components: where padding comes from, when a border is allowed, and the handful of CSS utilities that exist because three or more places needed the same rule set."
    >
      <Block
        title="Page padding"
        description="Every page picks one of these rather than writing its own padding. They all share the same 20 → 52px horizontal rhythm; what differs is the column width and the vertical space."
      >
        <div className="rounded-xl border border-(--color-border) bg-(--color-bg-panel) divide-y divide-(--color-border)">
          {LAYOUT_UTILITIES.map((u) => (
            <div
              key={u.name}
              className="px-4 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
            >
              <div className="sm:w-[130px] shrink-0">
                <CopyChip value={u.name} className="-ml-[6px]" />
              </div>
              <div className="min-w-0">
                <Text variant="caption" color="ink-2">
                  {u.usage}
                </Text>
                <Text variant="caption-sm" className="font-mono">
                  {u.spec}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Effects"
        description="Cross-component CSS in globals.css. The bar for adding one is three or more components sharing the same rule set — below that it stays a Tailwind string at the call site."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {EFFECT_UTILITIES.map((u) => (
            <div
              key={u.name}
              className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-3"
            >
              <CopyChip value={u.name} className="-ml-[6px]" />
              <Text variant="caption" className="px-[6px] mt-[2px]">
                {u.usage}
              </Text>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Blueprint grid"
        description="The content area's background. Two line layers at different scales, offset from the origin so the grid does not line up with the content edge — which is what stops it reading as a table."
      >
        <div className="blueprint-bg h-32 rounded-xl border border-(--color-border)" />
      </Block>

      <Block
        title="Borders and dividers"
        description="Because that grid is already drawing horizontal lines, a border-b inside the content area competes with it. The rule: separate sections with space, and keep borders for surfaces that have their own solid background."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-4">
            <Text
              variant="caption"
              color="ink-2"
              className="font-semibold mb-1"
            >
              Borders belong here
            </Text>
            <Text variant="caption">
              Panels and cards, the sidebar, and interactive controls — anywhere
              the border marks an element boundary against a solid fill.
            </Text>
          </div>
          <div className="rounded-lg border border-dashed border-(--color-border) px-4 py-4">
            <Text
              variant="caption"
              color="ink-2"
              className="font-semibold mb-1"
            >
              Not here
            </Text>
            <Text variant="caption">
              Section dividers in the content area. Use gap, py or my instead —
              the grid behind is already doing that job.
            </Text>
          </div>
        </div>
      </Block>

      <Block
        title="Focus and selection"
        description="Both are set once, globally. Focus rings are never removed per component — where a control needs a different ring, it overrides the colour, not the visibility."
      >
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className={cn(
              'px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer',
              'border border-(--color-border-hi) bg-(--color-bg-panel) text-(--color-ink-2)',
            )}
          >
            Tab to me
          </button>
          <Text variant="caption">
            Then try selecting <span className="font-semibold">this text</span>.
          </Text>
        </div>
        <Snippet
          lang="css"
          className="mt-4"
          code={`*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

::selection {
  background-color: var(--color-selection-bg);
  color: var(--color-selection-text);
}`}
        />
      </Block>

      <Block
        title="Styling hierarchy"
        description="In priority order. Each step down needs a reason the step above could not carry."
      >
        <ol className="list-none p-0 m-0 space-y-2">
          {[
            [
              'Tailwind utilities',
              'First choice for all layout, spacing, type and colour. Use the v4 shorthand: text-(--color-ink), not text-[var(--color-ink)].',
            ],
            [
              'globals.css utility class',
              'When three or more components share a rule set that Tailwind cannot express cleanly.',
            ],
            [
              'goober css``',
              'Only where pseudo-selectors or complex selectors are genuinely required.',
            ],
            [
              'Inline style',
              'Motion values, and runtime values with no Tailwind equivalent. Never for static colour, spacing or type.',
            ],
          ].map(([title, body], i) => (
            <li
              key={title}
              className="flex gap-3 rounded-lg border border-(--color-border) bg-(--color-bg-panel) px-4 py-3"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-(--color-bg-active) text-(--color-accent-text) text-[11px] font-semibold flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Text variant="caption" color="ink-2" className="font-semibold">
                  {title}
                </Text>
                <Text variant="caption">{body}</Text>
              </div>
            </li>
          ))}
        </ol>
      </Block>
    </Section>
  );
}
