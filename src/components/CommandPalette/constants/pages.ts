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
    title: 'Uses',
    description: 'List of things that I use daily',
    link: '/uses',
  },

  // Tools
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
