export type Project = {
  name: string;
  url: string;
  repo?: string;
  coverImage: string;
};

export const projects: Project[] = [
  {
    name: 'Indonesian remote-friendly companies 🇮🇩',
    url: 'https://id-wfa-companies.vercel.app',
    repo: 'https://github.com/jackyef/id-wfa',
    coverImage: 'https://id-wfa-companies.vercel.app/og.png',
  },
  {
    name: 'Luck 🍀 or Hard Work 🛠️ ?',
    url: 'https://luck-or-hardwork.vercel.app',
    repo: 'https://github.com/jackyef/luck-or-hardwork',
    coverImage: 'https://luck-or-hardwork.vercel.app/og-macos.png',
  },
  {
    name: 'Ames Window illusion',
    url: 'https://ames-window.vercel.app',
    coverImage: 'https://ames-window.vercel.app/og.png',
    repo: 'https://github.com/jackyef/ames-window',
  },
  {
    name: 'DOTA Rewind 2020',
    url: 'https://dotarewind.vercel.app',
    coverImage:
      'https://dotarewind.vercel.app/assets/previews/static-preview.png',
  },
];
