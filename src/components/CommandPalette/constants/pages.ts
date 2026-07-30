/**
 * We store all pages (excluding posts) we want to be available in the Command Palette here.
 */

import {
  EXPERIMENTS,
  experimentHref,
} from '@/components/experiments/constants';

import { PageData } from '../../../../types/types';

export const PAGES: readonly PageData[] = [
  {
    title: 'Home',
    description: 'The home page of my personal site 🏠',
    link: '/',
  },
  {
    title: 'Blog',
    description: `Some stuff that I wrote. I write about things I find interesting from time to time. ✍️`,
    link: '/blog',
  },
  {
    title: 'About me 👋',
    description:
      'Get to know me! This page contains what I worked on, where I worked at, where to find me, etc.',
    link: '/about',
  },
  {
    title: 'Design system 🎨',
    description:
      'The tokens, type and components this site is built from — colours in all three themes, a live WCAG contrast grid, and every primitive rendered for real.',
    link: '/design',
    hiddenSearchTerm: 'tokens colors colours palette typography contrast a11y',
  },
  {
    title: 'Uses',
    description: 'List of things that I use daily',
    link: '/uses',
  },
  {
    title: 'Resume 🛋️',
    description:
      'An interactive resume set in a cozy little 3D room. Click around to explore!',
    link: '/resume',
    hiddenSearchTerm: 'cv portfolio room 3d',
  },

  // Lab
  {
    title: 'Lab 🧪',
    description:
      'Every experiment on this site — generators, browser API demos and deliberately impractical components.',
    link: '/experiments',
    hiddenSearchTerm: 'experiments tools absurd ui toys demos',
  },

  // Each experiment stays individually searchable, off the same list the Lab
  // page renders — so adding one never needs a second edit here.
  ...EXPERIMENTS.map((experiment) => ({
    title: `Lab ▶️ ${experiment.label}`,
    description: experiment.description,
    link: experimentHref(experiment.slug),
    hiddenSearchTerm: experiment.searchTerm,
  })),
];

export const filterPages = (query: string): PageData[] => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  return PAGES.filter((page) =>
    words.every(
      (word) =>
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word) ||
        // Without this, every hiddenSearchTerm on a page was dead weight —
        // "cv" would not find the resume, nor "voice" the speech-to-text tool.
        // filterExternalLinks has always matched it; this was the odd one out.
        page.hiddenSearchTerm?.toLowerCase().includes(word),
    ),
  );
};
