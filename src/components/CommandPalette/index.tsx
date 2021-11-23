import dynamic from 'next/dynamic';

export const CommandPalette = dynamic(() => import('./CommandPalette'), {
  ssr: false,
});
