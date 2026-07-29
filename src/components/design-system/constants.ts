/**
 * The token registry behind /design.
 *
 * Every entry names a custom property that is actually declared in
 * src/styles/globals.css — the page resolves each one live from the DOM rather
 * than repeating its value here, so a swatch can never drift from the token it
 * documents. Adding a token to globals.css and listing it here is all it takes
 * to get it documented, contrast-checked, and rendered in all three themes.
 */

export const THEMES = ['light', 'dim', 'dark'] as const;

export type ThemeName = (typeof THEMES)[number];

/**
 * The page's top-level bands, in document order. Both the sticky tab bar and
 * the "on this page" rail read from here, so they cannot drift apart. Labels
 * are short on purpose — they have to fit a 224px rail and a tab strip that
 * scrolls horizontally on a phone.
 */
export const SECTIONS = [
  { id: 'color', label: 'Colour' },
  { id: 'contrast', label: 'Contrast' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'typography', label: 'Type' },
  { id: 'components', label: 'Components' },
  { id: 'patterns', label: 'Patterns' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export interface TokenSpec {
  /** The custom property, without `var()`. */
  token: string;
  /** What it is for. Shown beside the swatch. */
  usage: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  description: string;
  tokens: TokenSpec[];
}

export const COLOR_GROUPS: TokenGroup[] = [
  {
    id: 'surfaces',
    title: 'Surfaces',
    description:
      'The background ladder. Every plane on the site is one of these five — there is no sixth, and no ad-hoc tint.',
    tokens: [
      { token: '--color-bg', usage: 'Page background' },
      { token: '--color-bg-panel', usage: 'Cards, dialogs, anything raised' },
      { token: '--color-bg-sidebar', usage: 'Sidebar, recessed chrome' },
      { token: '--color-bg-hover', usage: 'Hover fill' },
      { token: '--color-bg-active', usage: 'Selected / active fill' },
    ],
  },
  {
    id: 'borders',
    title: 'Borders',
    description:
      'Two weights. The high-contrast one is for element boundaries you need to see; the default is for everything else.',
    tokens: [
      { token: '--color-border', usage: 'Default hairline' },
      { token: '--color-border-hi', usage: 'Controls, scrollbar thumb' },
    ],
  },
  {
    id: 'ink',
    title: 'Ink',
    description:
      'A four-step text ramp, tuned per theme. The contrast grid below shows where each step actually lands.',
    tokens: [
      { token: '--color-ink', usage: 'Headings, primary text' },
      { token: '--color-ink-2', usage: 'Body copy' },
      { token: '--color-ink-3', usage: 'Secondary / meta text' },
      { token: '--color-ink-4', usage: 'Decorative, placeholder' },
    ],
  },
  {
    id: 'accent',
    title: 'Accent',
    description:
      'Teal, in five weights. `accent` fills, `accent-text` sits on backgrounds — they differ because the fill would fail contrast as text in the dark themes.',
    tokens: [
      { token: '--color-accent', usage: 'Fills, indicators, focus ring' },
      { token: '--color-accent-2', usage: 'Secondary accent' },
      { token: '--color-accent-text', usage: 'Links, accent text and icons' },
      { token: '--color-accent-l', usage: 'Tinted fill' },
      { token: '--color-accent-xl', usage: 'Faintest tinted fill' },
      { token: '--color-on-accent', usage: 'Text on an accent fill' },
    ],
  },
  {
    id: 'semantic',
    title: 'Semantic',
    description:
      'Each status ships as a foreground/background pair, so a Panel never has to derive its own tint.',
    tokens: [
      { token: '--color-success', usage: 'Success foreground' },
      { token: '--color-success-bg', usage: 'Success fill' },
      { token: '--color-info', usage: 'Info foreground' },
      { token: '--color-info-bg', usage: 'Info fill' },
      { token: '--color-warning', usage: 'Warning foreground' },
      { token: '--color-warning-bg', usage: 'Warning fill' },
      { token: '--color-danger', usage: 'Danger foreground' },
      { token: '--color-danger-bg', usage: 'Danger fill' },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    description:
      'The syntax palette. Light theme uses a high-contrast set; dim and dark share a softer one.',
    tokens: [
      { token: '--code-bg', usage: 'Code block background' },
      { token: '--code-base', usage: 'Plain text' },
      { token: '--code-comment', usage: 'Comments' },
      { token: '--code-red', usage: 'Keywords, tags' },
      { token: '--code-blue', usage: 'Functions, attributes' },
      { token: '--code-green', usage: 'Strings' },
      { token: '--code-purple', usage: 'Constants, numbers' },
      { token: '--code-yellow', usage: 'Operators, punctuation' },
      { token: '--code-teal', usage: 'Types' },
    ],
  },
];

/** Foreground tokens the contrast grid measures. */
export const CONTRAST_FOREGROUNDS = [
  '--color-ink',
  '--color-ink-2',
  '--color-ink-3',
  '--color-ink-4',
  '--color-accent-text',
] as const;

/** Background tokens the contrast grid measures against. */
export const CONTRAST_BACKGROUNDS = [
  '--color-bg',
  '--color-bg-panel',
  '--color-bg-sidebar',
  '--color-bg-hover',
  '--color-bg-active',
] as const;

export interface ShadowSpec {
  token: string;
  usage: string;
}

export const SHADOW_TOKENS: ShadowSpec[] = [
  { token: '--shadow-sm', usage: 'Resting cards, the default Surface' },
  { token: '--shadow-md', usage: 'Hover lift, toasts, code playgrounds' },
  { token: '--shadow-lg', usage: 'Dialogs, popovers, the font menu' },
  { token: '--shadow-inset', usage: 'Recessed wells — SegmentedControl' },
];

export const RADIUS_STEPS = [
  { label: 'sm', className: 'rounded-sm', value: '0.25rem' },
  { label: 'md', className: 'rounded-md', value: '0.375rem' },
  { label: 'lg', className: 'rounded-lg', value: '0.5rem' },
  { label: 'xl', className: 'rounded-xl', value: '0.75rem' },
  { label: 'full', className: 'rounded-full', value: '9999px' },
];

/**
 * Transition durations in use across the system. These are literals in the
 * components rather than custom properties — listing them here is what keeps
 * new code reaching for an existing speed instead of inventing one.
 */
export const MOTION_STEPS = [
  { label: '130ms', usage: 'Nav items, segmented control, font picker' },
  { label: '150ms', usage: 'Table-of-contents links, dialogs' },
  { label: '180ms', usage: 'Buttons' },
  { label: '200ms', usage: 'Card lift' },
  { label: '220ms', usage: 'Theme change (background, border, colour)' },
];

export const KEYFRAMES = [
  {
    name: 'status-pulse',
    className: 'animate-status-pulse',
    usage: 'Live indicator dots — StatusDot',
  },
  {
    name: 'cursor-blink',
    className: 'animate-cursor-blink',
    usage: 'Typewriter caret — TypewriterText',
  },
];

export interface LayoutUtility {
  name: string;
  usage: string;
  spec: string;
}

export const LAYOUT_UTILITIES: LayoutUtility[] = [
  {
    name: 'page-pad',
    usage: 'Standard content pages — About, Uses, this page',
    spec: '880px column · 24/20px padding → 40/52px at md',
  },
  {
    name: 'post-pad',
    usage: 'Blog post bodies, where the column is sized by the post layout',
    spec: '24/20px padding → 40/52px at md',
  },
  {
    name: 'hero-pad',
    usage: 'Homepage hero, aligned to the widget grid below it',
    spec: '960px column · 32/20px padding → 64/52px at md',
  },
  {
    name: 'widget-grid',
    usage: 'Homepage widget cards',
    spec: '2 columns → 3 at md · 10px gap · 960px column',
  },
  {
    name: 'latest-pad',
    usage: 'Homepage "latest writing" list',
    spec: '960px column, matching widget-grid',
  },
];

export const EFFECT_UTILITIES = [
  {
    name: 'blueprint-bg',
    usage:
      'The grid behind the content area. Two layers — 96px primary over 32px faint — offset so the lines land off-centre.',
  },
  {
    name: 'card-hover',
    usage:
      'Interactive card lift: 1px translate plus --shadow-md, in CSS rather than JS mouse handlers.',
  },
  {
    name: 'fancy-link',
    usage:
      'Inline links whose underline fills upward into a highlight on hover.',
  },
  {
    name: 'no-animation',
    usage:
      'Escape hatch that freezes transitions, transforms and animations in a subtree.',
  },
];
