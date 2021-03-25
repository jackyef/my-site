export type Project = {
  name: string;
  url: string;
  repo?: string;
  coverImage: string;
};

export const projects: Project[] = [
  {
    name: 'Luck 🍀 or Hard Work 🛠️ ?',
    url: 'https://luck-or-hardwork.vercel.app',
    repo: 'https://github.com/jackyef/luck-or-hardwork',
    coverImage: 'https://luck-or-hardwork.vercel.app/og-macos.png',
  },
  {
    name: 'DOTA Rewind 2020',
    url: 'https://dotarewind.com',
    coverImage: 'https://dotarewind.com/assets/previews/static-preview.png',
  },
];
