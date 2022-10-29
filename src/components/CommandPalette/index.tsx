import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const _CommandPalette = dynamic(() => import('./CommandPalette'), {
  ssr: false,
  // Using suspense means rendering this component on the server, where the server cna suspend as needed.
  // We don't need it as CommandPallete is strictly a client-side component
  suspense: false,
});

export const CommandPalette = () => (
  <Suspense fallback={null}>
    <_CommandPalette />
  </Suspense>
);
