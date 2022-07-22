import dynamic from 'next/dynamic';
import type { FlipperProps } from 'flip-toolkit/lib/types';

export const Flipper = dynamic<FlipperProps>(
  () => import('react-flip-toolkit').then((m) => m.Flipper),
  {
    ssr: true,
  },
);
