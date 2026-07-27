import { TECHNOLOGIES } from '@/constants/technologies';

export type ResumeRole = {
  title: string;
  period: string;
  summary: string;
  highlights?: string[];
};

export type ResumeStint = {
  company: string;
  url?: string;
  location: string;
  roles: ResumeRole[];
};

export const RESUME_TAGLINE =
  'Product engineer building for the web — performance, design systems, developer tooling, and the interfaces people actually use.';

export const RESUME_INTRO = [
  'I build for the web: performance, design systems, developer tooling, and the product interfaces people actually use.',
  'Frontend is where I go deepest, but I have spent enough time in the surrounding infrastructure — build pipelines, monorepos, developer tooling — to be useful well beyond the browser.',
  '8 years in, 5 fully remote across teams on 5 continents. Based in Jakarta, Indonesia (UTC+7).',
];

export const EXPERIENCE: ResumeStint[] = [
  {
    company: 'Sticker Mule',
    url: 'https://www.stickermule.com',
    location: 'Remote',
    roles: [
      {
        title: 'Senior Software Engineer',
        period: 'Oct 2025 — present',
        summary:
          'Back to being an individual contributor by choice after two years of leading. Currently driving the migration of a 7-year-old design system.',
      },
      {
        title: 'Tech Lead',
        period: 'Dec 2023 — Sep 2025',
        summary:
          'Owned the technical direction of the Platform UX team: project planning, code reviews, and helping others ship.',
      },
      {
        title: 'Senior Software Engineer — Platform UX',
        period: 'Dec 2020 — Nov 2023',
        summary:
          'Maintained the shared libraries powering products across the monorepo, plus the main e-commerce platform — everything from catalog to checkout — collaborating asynchronously with a team scattered around the globe.',
      },
    ],
  },
  {
    company: 'Tokopedia',
    url: 'https://www.tokopedia.com',
    location: 'Jakarta, Indonesia',
    roles: [
      {
        title: 'Principal Engineer — Web Platform',
        period: '2020',
        summary:
          'Worked on developer experience for ~80 engineers across a monorepo housing 20+ services.',
        highlights: [
          'Cut Largest Contentful Paint of the mobile home page from 4.1s to 1.7s',
          'Migrated the frontend monorepo from Yarn workspaces to pnpm',
          'Pioneered Next.js + Preact microsites, reducing bytes over the wire',
          'Improved staging build times by 90%',
          "Spoke at Tokopedia START Summit 2020 and Google's web.dev ID forum",
        ],
      },
      {
        title: 'Senior Software Engineer — Mobile Web, then Web Platform',
        period: '2019',
        summary:
          'Moved from frontend-product to frontend-infra: developer tooling, build pipelines, and workshops to onboard engineers specializing in web frontend.',
      },
      {
        title: 'Software Engineer — Mobile Web',
        period: 'Nov 2017 — Dec 2018',
        summary:
          "Built Tokopedia's mobile web with React and pioneered the use of GraphQL at the company. Shipped TopChat, TokoPoints, and Mitra Tokopedia.",
      },
    ],
  },
];

export const EARLIER_CAREER = [
  'Programmer at a local company in my hometown — my very first programming job (2017)',
  'Informatics student and part-time English teacher (2013 — 2017)',
];

export const SKILLS = [
  ...TECHNOLOGIES.map((tech) => tech.name),
  'Web performance',
  'Design systems',
  'Developer tooling',
  'Monorepos',
];

// Displayed on the little side table in the 3D room. Swap these freely —
// each item is just an emoji and a short label.
export const CARE_ITEMS = [
  { emoji: '♟️', label: 'Chess' },
  { emoji: '🏀', label: 'Basketball' },
  { emoji: '🎮', label: 'Games' },
  { emoji: '☕', label: 'Coffee' },
];
