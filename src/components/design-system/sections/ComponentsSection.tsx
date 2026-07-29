import { useState } from 'react';
import { CircleDotIcon, MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Chip } from '@/components/common/Chip';
import { Panel } from '@/components/common/Panel';
import { SectionLabel } from '@/components/common/SectionLabel';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { StatusDot } from '@/components/common/StatusDot';
import { Surface } from '@/components/common/Surface';
import { Table } from '@/components/common/Table';
import { Text } from '@/components/common/Text';
import { TextLink } from '@/components/common/TextLink';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import { TypewriterText } from '@/components/common/TypewriterText';

import { cn } from '@/utils/styles/classNames';

import { Block, PropTable, Section, Snippet, type PropRow } from '../Scaffold';

/** One primitive: what it is, what it looks like, and how to call it. */
function Spec({
  name,
  file,
  summary,
  demo,
  props: propRows,
  snippet,
}: {
  name: string;
  file: string;
  summary: string;
  demo: React.ReactNode;
  props?: PropRow[];
  snippet: string;
}) {
  const [tab, setTab] = useState<'props' | 'code'>('props');

  return (
    <div
      id={`component-${name.toLowerCase()}`}
      className="scroll-mt-16 rounded-xl border border-(--color-border) bg-(--color-bg-panel) overflow-hidden"
    >
      <div className="px-5 pt-4 pb-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[17px] font-bold font-serif text-(--color-ink) m-0">
            {name}
          </h3>
          <code className="font-mono text-[11px] text-(--color-ink-4)">
            {file}
          </code>
        </div>
        <Text variant="body-sm" color="ink-3" className="mt-1 max-w-[70ch]">
          {summary}
        </Text>
      </div>

      {/* Demos sit on the page background, not the panel, so a component's own
          panel colour reads as a distinct layer the way it does in situ. */}
      <div className="border-y border-(--color-border) bg-(--color-bg) px-5 py-6">
        {demo}
      </div>

      <div className="px-5 py-3">
        <div className="flex gap-1 mb-3">
          {(propRows ? (['props', 'code'] as const) : (['code'] as const)).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'text-[11px] font-semibold tracking-[0.06em] uppercase cursor-pointer',
                  'px-[9px] py-[4px] rounded-md border border-transparent bg-transparent',
                  'transition-[background,color] duration-[130ms]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)',
                  (propRows ? tab : 'code') === t
                    ? 'bg-(--color-bg-active) text-(--color-accent-text)'
                    : 'text-(--color-ink-4) hover:text-(--color-ink-2)',
                )}
              >
                {t === 'props' ? 'Props' : 'Usage'}
              </button>
            ),
          )}
        </div>
        {propRows && tab === 'props' ? (
          <PropTable rows={propRows} />
        ) : (
          <Snippet code={snippet} />
        )}
      </div>
    </div>
  );
}

const Row = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className="flex flex-col gap-2">
    {label && <SectionLabel>{label}</SectionLabel>}
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

export function ComponentsSection() {
  const [segment, setSegment] = useState('dim');

  return (
    <Section
      id="components"
      eyebrow="Components"
      title={
        <>
          The <em>primitives</em>
        </>
      }
      intro="Everything in src/components/common. These are live — the same imports the rest of the site uses, rendering in whatever theme and pairing you have selected. If one of them looks wrong here, it looks wrong everywhere."
    >
      <Spec
        name="Button"
        file="common/Button"
        summary="Polymorphic pill button in three variants. Pass as={Link} or as='a' to render a navigation control that still looks like a button."
        demo={
          <div className="flex flex-col gap-5">
            <Row label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </Row>
            <Row label="Sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
            </Row>
          </div>
        }
        props={[
          {
            name: 'variant',
            type: "'primary' | 'secondary' | 'ghost'",
            defaultValue: "'primary'",
            description: 'Visual weight.',
          },
          {
            name: 'size',
            type: "'sm' | 'md'",
            defaultValue: "'md'",
            description: '13px or 14px, with matching padding.',
          },
          {
            name: 'as',
            type: 'React.ElementType',
            defaultValue: "'button'",
            description: 'Render as Link, a, or any element.',
          },
        ]}
        snippet={`import { Button } from '@/components/common/Button';

<Button variant="secondary" size="sm">Read more</Button>
<Button as={Link} href="/about">About me</Button>`}
      />

      <Spec
        name="Surface"
        file="common/Surface"
        summary="The container primitive: panel background, elevation, radius and an optional border. Card and every dialog build on it."
        demo={
          <div className="grid gap-4 sm:grid-cols-3">
            {(['sm', 'md', 'lg'] as const).map((e) => (
              <Surface key={e} elevation={e} className="px-4 py-5 text-center">
                <code className="font-mono text-[12px] text-(--color-ink-2)">
                  elevation=&quot;{e}&quot;
                </code>
              </Surface>
            ))}
          </div>
        }
        props={[
          {
            name: 'elevation',
            type: "'none' | 'sm' | 'md' | 'lg'",
            defaultValue: "'sm'",
            description: 'Maps to the --shadow-* tokens.',
          },
          {
            name: 'rounded',
            type: "'sm' | 'md' | 'lg' | 'xl'",
            defaultValue: "'lg'",
            description: 'Corner radius.',
          },
          {
            name: 'border',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Hairline in --color-border.',
          },
          {
            name: 'as',
            type: 'React.ElementType',
            defaultValue: "'div'",
            description: 'Semantic override.',
          },
        ]}
        snippet={`import { Surface } from '@/components/common/Surface';

<Surface elevation="md" rounded="xl" as="section">
  …
</Surface>`}
      />

      <Spec
        name="Card"
        file="common/Card"
        summary="Surface plus padding presets and the hover lift. Use hover for anything clickable — it is a CSS transition, not a JS mouse handler."
        demo={
          <div className="grid gap-4 sm:grid-cols-2">
            <Card padding="md">
              <Text variant="body-sm">padding=&quot;md&quot;</Text>
              <Text variant="caption">Resting card.</Text>
            </Card>
            <Card padding="md" hover>
              <Text variant="body-sm">hover</Text>
              <Text variant="caption">Point at me.</Text>
            </Card>
          </div>
        }
        props={[
          {
            name: 'padding',
            type: "'none' | 'sm' | 'md'",
            defaultValue: "'none'",
            description: 'Inner spacing preset.',
          },
          {
            name: 'hover',
            type: 'boolean',
            defaultValue: 'false',
            description: 'Adds .card-hover — 1px lift plus --shadow-md.',
          },
        ]}
        snippet={`import { Card } from '@/components/common/Card';

<Card padding="md" hover>…</Card>`}
      />

      <Spec
        name="Chip"
        file="common/Chip"
        summary="Compact inline label in three sizes and three tones. Used for tags, tech stacks and status badges."
        demo={
          <div className="flex flex-col gap-5">
            <Row label="Variants">
              <Chip>Default</Chip>
              <Chip variant="highlight">Highlight</Chip>
              <Chip variant="muted">Muted</Chip>
            </Row>
            <Row label="Sizes">
              <Chip size="xs">xs</Chip>
              <Chip size="sm">sm</Chip>
              <Chip size="md">md</Chip>
            </Row>
          </div>
        }
        props={[
          {
            name: 'variant',
            type: "'default' | 'highlight' | 'muted'",
            defaultValue: "'default'",
            description: 'Tone.',
          },
          {
            name: 'size',
            type: "'xs' | 'sm' | 'md'",
            defaultValue: "'sm'",
            description: '11px, 12px or 13px.',
          },
        ]}
        snippet={`import { Chip } from '@/components/common/Chip';

<Chip variant="highlight" size="xs">Current</Chip>`}
      />

      <Spec
        name="Panel"
        file="common/Panel"
        summary="Callout block with a semantic left rule. Registered as an MDX component, so blog posts can use it directly."
        demo={
          <div className="space-y-3 [&>div]:my-0">
            <Panel type="info" title="Info">
              <Text variant="body-sm">Neutral aside.</Text>
            </Panel>
            <Panel type="success" title="Success">
              <Text variant="body-sm">It worked.</Text>
            </Panel>
            <Panel type="warning" title="Warning">
              <Text variant="body-sm">Mind this.</Text>
            </Panel>
            <Panel type="danger" title="Danger">
              <Text variant="body-sm">Do not do this.</Text>
            </Panel>
            <Panel type="accent" title="Accent">
              <Text variant="body-sm">Worth noticing.</Text>
            </Panel>
          </div>
        }
        props={[
          {
            name: 'type',
            type: "'info' | 'warning' | 'danger' | 'success' | 'accent'",
            description: 'Picks the rule colour and fill.',
          },
          { name: 'title', type: 'string', description: 'Bold heading line.' },
        ]}
        snippet={`import { Panel } from '@/components/common/Panel';

<Panel type="warning" title="Careful">
  This is load-bearing.
</Panel>`}
      />

      <Spec
        name="SegmentedControl"
        file="common/SegmentedControl"
        summary="Generic exclusive picker with an inset well. Drives the theme switcher, the chess time-control picker, and the contrast grid above."
        demo={
          <div className="max-w-[280px]">
            <SegmentedControl
              options={[
                { value: 'light', label: 'Light', icon: <SunIcon size={13} /> },
                { value: 'dim', label: 'Dim', icon: <MoonIcon size={13} /> },
                {
                  value: 'dark',
                  label: 'Dark',
                  icon: <CircleDotIcon size={13} />,
                },
              ]}
              value={segment}
              onChange={setSegment}
            />
          </div>
        }
        props={[
          {
            name: 'options',
            type: 'SegmentOption<T>[]',
            description: 'value, plus optional label, icon and title.',
          },
          {
            name: 'value',
            type: 'T | null',
            description: 'null renders nothing as selected.',
          },
          {
            name: 'onChange',
            type: '(value: T) => void',
            description: 'Selection handler.',
          },
        ]}
        snippet={`import { SegmentedControl } from '@/components/common/SegmentedControl';

<SegmentedControl
  options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
  value={value}
  onChange={setValue}
/>`}
      />

      <Spec
        name="StatusDot"
        file="common/StatusDot"
        summary="Small indicator dot, pulsing by default. The colour is an inline style on purpose — it is a runtime value with no Tailwind equivalent."
        demo={
          <div className="flex flex-wrap items-center gap-6">
            {[
              ['--color-success', 'Available'],
              ['--color-warning', 'Busy'],
              ['--color-danger', 'Offline'],
            ].map(([token, label]) => (
              <span key={token} className="flex items-center gap-2">
                <StatusDot color={`var(${token})`} />
                <Text variant="caption" as="span">
                  {label}
                </Text>
              </span>
            ))}
            <span className="flex items-center gap-2">
              <StatusDot pulse={false} />
              <Text variant="caption" as="span">
                pulse=false
              </Text>
            </span>
          </div>
        }
        props={[
          {
            name: 'color',
            type: 'string',
            defaultValue: 'var(--color-success)',
            description: 'Any CSS colour.',
          },
          {
            name: 'pulse',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Adds .animate-status-pulse.',
          },
        ]}
        snippet={`import { StatusDot } from '@/components/common/StatusDot';

<StatusDot color="var(--color-warning)" />`}
      />

      <Spec
        name="TextLink"
        file="common/TextLink"
        summary="Accent-coloured navigation link over next/link. For inline prose links inside long-form content, the .fancy-link utility is the richer treatment."
        demo={
          <div className="flex flex-col gap-3">
            <Text variant="body-sm">
              A sentence with a <TextLink href="/design">TextLink</TextLink> in
              it.
            </Text>
            <Text variant="body-sm">
              And one with a{' '}
              <a href="#patterns" className="fancy-link">
                fancy-link
              </a>{' '}
              in it.
            </Text>
          </div>
        }
        props={[
          { name: 'href', type: 'string', description: 'Passed to next/link.' },
        ]}
        snippet={`import { TextLink } from '@/components/common/TextLink';

<TextLink href="/blog">All posts &rarr;</TextLink>`}
      />

      <Spec
        name="Table"
        file="common/Table"
        summary="Compound table with a panel wrapper and horizontal scroll. Registered for MDX, so posts get consistent tables without markup gymnastics."
        demo={
          <Table>
            <Table.THead>
              <Table.Tr>
                <Table.Th>Token</Table.Th>
                <Table.Th>Purpose</Table.Th>
              </Table.Tr>
            </Table.THead>
            <Table.TBody>
              <Table.Tr>
                <Table.Td>--color-ink</Table.Td>
                <Table.Td>Headings</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>--color-ink-2</Table.Td>
                <Table.Td>Body copy</Table.Td>
              </Table.Tr>
            </Table.TBody>
          </Table>
        }
        snippet={`import { Table } from '@/components/common/Table';

<Table>
  <Table.THead><Table.Tr><Table.Th>Name</Table.Th></Table.Tr></Table.THead>
  <Table.TBody><Table.Tr><Table.Td>Value</Table.Td></Table.Tr></Table.TBody>
</Table>`}
      />

      <Spec
        name="AnimatedNumber"
        file="common/AnimatedNumber"
        summary="Counts up to its value with an expo ease-out, and scrambles while the value is still undefined — which is what the homepage widgets show while their data is in flight."
        demo={
          <div className="flex flex-wrap items-baseline gap-8">
            <span className="text-3xl font-bold text-(--color-ink)">
              <AnimatedNumber value={1847} />
            </span>
            <span className="text-3xl font-bold text-(--color-ink-4)">
              <AnimatedNumber value={undefined} />
            </span>
          </div>
        }
        props={[
          {
            name: 'value',
            type: 'number | undefined | null',
            description: 'Nullish renders the scrambling loading state.',
          },
          {
            name: 'duration',
            type: 'number',
            defaultValue: '1.2',
            description: 'Seconds.',
          },
        ]}
        snippet={`import { AnimatedNumber } from '@/components/common/AnimatedNumber';

<AnimatedNumber value={stats?.rating} />`}
      />

      <Spec
        name="TypewriterText"
        file="common/TypewriterText"
        summary="Types its text out on entering the viewport, then blinks. Honours prefers-reduced-motion through the global rule."
        demo={
          <Text variant="body-sm" as="div">
            <TypewriterText text="Hello — this is the design system." />
          </Text>
        }
        props={[
          { name: 'text', type: 'string', description: 'The full string.' },
          {
            name: 'charSpeed',
            type: 'number',
            defaultValue: '45',
            description: 'Milliseconds per character.',
          },
          {
            name: 'active',
            type: 'boolean',
            description:
              'Bypasses the IntersectionObserver and starts on true.',
          },
        ]}
        snippet={`import { TypewriterText } from '@/components/common/TypewriterText';

<TypewriterText text="Hello there" charSpeed={45} />`}
      />

      <Block
        title="Also in common/"
        description="Documented above under Foundations, since they are typography rather than components in their own right."
      >
        <div className="flex flex-wrap gap-2">
          {[
            'Heading',
            'Text',
            'SectionLabel',
            'PageHeader',
            'Mark',
            'Divider',
            'MDX',
          ].map((n) => (
            <Chip key={n} variant="muted" size="sm">
              {n}
            </Chip>
          ))}
        </div>
      </Block>
    </Section>
  );
}
