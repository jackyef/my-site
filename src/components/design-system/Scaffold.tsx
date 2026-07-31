import copy from 'clipboard-copy';
import { CopyIcon } from 'lucide-react';

import { Heading } from '@/components/common/Heading';
import { SectionLabel } from '@/components/common/SectionLabel';
import { Text } from '@/components/common/Text';
import { highlight } from '@/components/common/CodeHighlight';
import { toast } from '@/lib/toast';
import type { SnippetLanguage } from '@/lib/prism';

import { cn } from '@/utils/styles/classNames';

/** A top-level band of the page. The `id` is what SectionTabs scroll-spies on. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 pt-10 first:pt-2">
      <SectionLabel className="mb-[10px] text-(--color-accent-text)">
        {eyebrow}
      </SectionLabel>
      <Heading level={2} className="mb-3">
        {title}
      </Heading>
      {intro && (
        <Text variant="body" color="ink-3" className="max-w-[62ch] mb-8">
          {intro}
        </Text>
      )}
      <div className="space-y-10">{children}</div>
    </section>
  );
}

/** A titled block inside a Section. */
export function Block({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
        <Heading level={4} as="h3">
          {title}
        </Heading>
        {aside}
      </div>
      {description && (
        <Text variant="body-sm" color="ink-3" className="max-w-[68ch] mb-4">
          {description}
        </Text>
      )}
      {children}
    </div>
  );
}

/**
 * A token name that copies itself.
 *
 * Reserved for strings you would paste verbatim — the custom properties and the
 * utility class names. Anything that only reads as a label (a JSX fragment, a
 * prop signature) is plain `<code>` instead: a button that hands back half an
 * element is chrome, not a tool, and the Usage tabs already carry complete
 * snippets.
 *
 * Carries a dotted underline at rest, since a chip that only reveals itself on
 * hover is one nobody discovers.
 */
export function CopyChip({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        copy(value);
        toast({ text: `Copied ${value}` });
      }}
      title={`Copy ${value}`}
      className={cn(
        'group/copy inline-flex items-center gap-[5px] cursor-pointer',
        // These sit in dense token tables where a 21px row is right under a
        // cursor; on touch the same row is a coin toss. Coarse pointers get
        // the padding, fine ones keep the density.
        'font-mono text-[11px] leading-none px-[6px] py-[4px] pointer-coarse:py-[16px] rounded-md',
        'border border-transparent bg-transparent text-(--color-ink-3)',
        'decoration-dotted underline underline-offset-[3px] decoration-(--color-ink-4)',
        'transition-[background,border-color,color] duration-[130ms]',
        'hover:border-(--color-border) hover:bg-(--color-bg-hover) hover:text-(--color-ink-2)',
        'hover:no-underline',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)',
        className,
      )}
    >
      {label ?? value}
      <CopyIcon
        size={10}
        aria-hidden="true"
        className="shrink-0 opacity-0 -ml-[3px] transition-opacity duration-[130ms] group-hover/copy:opacity-70"
      />
    </button>
  );
}

/**
 * Copyable code sample, highlighted by the same tokenizer and the same
 * `--code-*` palette as the blog's build-time code blocks. Copying yields the
 * original source, not the rendered markup.
 */
export function Snippet({
  code,
  lang = 'tsx',
  className,
}: {
  code: string;
  lang?: SnippetLanguage;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative group rounded-lg border border-(--color-border) bg-(--code-bg) overflow-hidden',
        className,
      )}
    >
      <pre className="overflow-x-auto px-4 py-3 m-0">
        <code className="font-mono text-[12px] leading-[1.65] text-(--code-base) whitespace-pre">
          {highlight(code, lang)}
        </code>
      </pre>
      <button
        type="button"
        onClick={() => {
          copy(code);
          toast({ text: 'Snippet copied' });
        }}
        aria-label="Copy snippet"
        className={cn(
          'absolute top-2 right-2 px-[8px] py-[3px] rounded-md cursor-pointer',
          'text-[11px] font-medium border border-(--color-border)',
          'bg-(--color-bg-panel) text-(--color-ink-3)',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          'transition-[opacity,color] duration-[130ms] hover:text-(--color-accent-text)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)',
        )}
      >
        Copy
      </button>
    </div>
  );
}

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export function PropTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-(--color-border)">
            {['Prop', 'Type', 'Default', 'Notes'].map((h) => (
              <th
                key={h}
                scope="col"
                className="py-2 pr-4 text-[11px] font-semibold tracking-[0.08em] uppercase text-(--color-ink-3) whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-(--color-border) last:border-0 align-top"
            >
              <td className="py-2 pr-4 font-mono text-[12px] text-(--color-ink-2) whitespace-nowrap">
                {row.name}
              </td>
              <td className="py-2 pr-4 font-mono text-[11px] text-(--color-accent-text) min-w-[140px]">
                {row.type}
              </td>
              <td className="py-2 pr-4 font-mono text-[11px] text-(--color-ink-3) whitespace-nowrap">
                {row.defaultValue ?? '—'}
              </td>
              <td className="py-2 text-[12px] leading-[1.5] text-(--color-ink-3) min-w-[200px]">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
