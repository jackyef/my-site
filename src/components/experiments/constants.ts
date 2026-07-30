import {
  MicIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
  SquareCodeIcon,
  type LucideIcon,
} from 'lucide-react';

export interface Experiment {
  slug: string;
  /** Page `<h1>` and meta tags — can be longer and more descriptive */
  title: string;
  /** Hub card and command palette label */
  label: string;
  description: string;
  date: string;
  icon: LucideIcon;
  /** Extra command-palette search terms that aren't in the title/description */
  searchTerm?: string;
}

/**
 * The Lab: every experiment on this site, newest first.
 *
 * This is the single source of truth — the hub page, the command palette and
 * each experiment's own meta tags all read from here, so adding one is a single
 * entry plus a page file, not four edits scattered across the tree.
 */
export const EXPERIMENTS: readonly Experiment[] = [
  {
    slug: 'ballistic-slider',
    title: 'Ballistic Slider',
    label: 'Ballistic Slider',
    description: 'A slider with some ballistic physics baked in.',
    date: '2024-03-10T09:45:30.326Z',
    icon: SlidersHorizontalIcon,
    searchTerm: 'absurd ui physics drag aim',
  },
  {
    slug: 'playground',
    title: 'Code playground',
    label: 'Code playground',
    description:
      'A playground for testing code snippets with framer-motion and tailwind css',
    date: '2023-07-05T09:45:30.326Z',
    icon: SquareCodeIcon,
    searchTerm: 'editor sandbox repl',
  },
  {
    slug: 'speech-to-text',
    title: 'Speech-to-text with Web Speech API',
    label: 'Speech-to-text',
    description:
      "Speech-to-text demo using the Web Speech API's SpeechRecognition",
    date: '2022-04-13T06:43:37.680Z',
    icon: MicIcon,
    searchTerm: 'voice dictation microphone',
  },
  {
    slug: 'claymorphism',
    title: 'Claymorphism-style CSS generator',
    label: 'Claymorphism',
    description: 'Play around and generate claymorphism-style CSS!',
    date: '2021-12-22T09:45:30.326Z',
    icon: PaletteIcon,
    searchTerm: 'css generator shadow clay',
  },
];

export const experimentHref = (slug: string) => `/experiments/${slug}`;

/**
 * Throws rather than returning `undefined` so a renamed slug fails the build
 * on the page that owns it, instead of rendering a page with empty meta tags.
 */
export const getExperiment = (slug: string): Experiment => {
  const experiment = EXPERIMENTS.find((item) => item.slug === slug);

  if (!experiment) {
    throw new Error(`Unknown experiment slug: ${slug}`);
  }

  return experiment;
};
