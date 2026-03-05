export type Project = {
  name: string;
  url: string;
  repo?: string;
  coverImage: string;
  description: string;
};

export const projects: Project[] = [
  {
    name: 'ProfileOverflow',
    url: 'https://profile-overflow.vercel.app',
    repo: 'https://github.com/jackyef/profile-overflow',
    coverImage: 'https://profile-overflow.vercel.app/api/og/users/4662933',
    description: 'Visualize public StackOverflow profile data',
  },
  {
    name: 'Kotla',
    url: 'https://kotla.vercel.app',
    repo: 'https://github.com/jackyef/kotla',
    coverImage: 'https://kotla.vercel.app/og.png',
    description:
      '`Kota` (city; in Indonesian) guessing game, inspired by Katla and Wordle',
  },
  {
    name: 'Tranquil',
    url: 'https://tranquil.vercel.app',
    repo: 'https://github.com/jackyef/tranquil',
    coverImage: 'https://tranquil.vercel.app/og.png',
    description: 'Environmental sounds to keep you company',
  },
  {
    name: 'Luck 🍀 or Hard Work 🛠️ ?',
    url: 'https://luck-or-hardwork.vercel.app',
    repo: 'https://github.com/jackyef/luck-or-hardwork',
    coverImage: 'https://luck-or-hardwork.vercel.app/og-macos.png',
    description:
      'Simulate a take on luck and hard work, inspired by a Veritasium video',
  },
  {
    name: 'Ames Window illusion',
    url: 'https://ames-window.vercel.app',
    coverImage: 'https://ames-window.vercel.app/og.png',
    repo: 'https://github.com/jackyef/ames-window',
    description:
      '3d showcase of Ames Window illusion, inspired by a Veritasium video',
  },
  {
    name: 'DOTA Rewind 2020',
    url: 'https://dotarewind.vercel.app',
    coverImage:
      'https://dotarewind.vercel.app/assets/previews/static-preview.png',
    description: 'Look back to your 2020 DOTA 2 matches',
  },
];
