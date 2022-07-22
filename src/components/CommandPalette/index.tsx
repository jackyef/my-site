import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const _CommandPalette = dynamic(() => import('./CommandPalette'), {
  ssr: false,
  suspense: true,
});

export const CommandPalette = () => (
  <Suspense fallback={null}>
    <_CommandPalette />
  </Suspense>
);
