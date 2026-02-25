/**
 * We store all pages (excluding posts) we want to be available in the Command Palette here.
 */

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
    title: 'Tokens 🖌️',
    description: 'Shows some of the design tokens used on this site.',
    link: '/about/tokens',
  },
  {
    title: 'Uses',
    description: 'List of things that I use daily',
    link: '/uses',
  },

  // Tools
  {
    title: 'Tools ▶️ Code playground',
    description: `A playground for testing code snippets with framer-motion and tailwind css`,
    link: '/tools/playground',
  },
  {
    title: 'Tools ▶️ Claymorphism',
    description: `Simple tool for generating for claymorphism-style CSS`,
    link: '/tools/claymorphism',
  },
  {
    title: 'Tools ▶️ Speech-to-text',
    description: `Speech-to-text demo using the Web Speech API's SpeechRecognition`,
    link: '/tools/speech-to-text',
    hiddenSearchTerm: 'voice',
  },

  // Absurd UI components
  {
    title: 'Absurd UI components',
    description:
      'A collection of absurd UI components that are not practical but fun to play with.',
    link: '/absurd-ui',
  },

  {
    title: 'Absurd UI ▶️ Ballistic Slider',
    description: 'A slider with some ballistic physics baked in..',
    link: '/absurd-ui/ballistic-slider',
  },

  {
    title: 'Absurd UI ▶️ Big Picture Mode',
    description:
      'A game controller–navigable full-screen experience. Connect a gamepad or use arrow keys.',
    link: '/absurd-ui/big-picture',
    hiddenSearchTerm: 'gamepad controller',
  },
];

export const filterPages = (query: string): PageData[] => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  return PAGES.filter((page) =>
    words.every(
      (word) =>
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word),
    ),
  );
};
