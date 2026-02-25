import dynamic from 'next/dynamic';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import { FocusCard } from '../components/FocusCard';

const BallisticSlider = dynamic(
  () =>
    import('@/components/absurd-components/BallisticSlider').then(
      (m) => m.BallisticSlider,
    ),
  { ssr: false },
);

export const AbsurdUIScreen = () => {
  const prefersReducedMotion = useReduceMotion();

  return (
    <div
      className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto"
      data-bp-scrollable
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Absurd UI</h1>
        <p className="text-white/50">
          Experimental components that prioritize delight over practicality.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold text-lg mb-2">
          🎯 Ballistic Slider
        </h2>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          A volume slider that fires a projectile to reach its target. Because
          why not?
        </p>
        <div className="py-4">
          <BallisticSlider label="Volume" height={120} />
        </div>
      </div>

      <FocusCard
        row="links"
        prefersReducedMotion={prefersReducedMotion}
        onClick={() => window.open('/absurd-ui', '_blank')}
        className="flex items-center justify-between px-5 py-4"
      >
        <span className="text-white/80 font-medium">
          View all Absurd UI experiments
        </span>
        <span className="text-white/40">↗</span>
      </FocusCard>

      <div className="pb-8" />
    </div>
  );
};
