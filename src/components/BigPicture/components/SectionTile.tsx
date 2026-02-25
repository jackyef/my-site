import * as React from 'react';

import { FocusCard } from './FocusCard';

interface Props {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  onClick: () => void;
  prefersReducedMotion?: boolean;
}

export const SectionTile = ({
  title,
  description,
  icon,
  accentColor,
  onClick,
  prefersReducedMotion = false,
}: Props) => {
  return (
    <FocusCard
      row="sections"
      onClick={onClick}
      prefersReducedMotion={prefersReducedMotion}
      className="flex flex-col p-8 w-full h-full gap-6"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Accent glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}18, transparent 55%)`,
        }}
      />

      {/* Icon */}
      <div
        className="text-6xl w-20 h-20 flex items-center justify-center rounded-2xl shrink-0 relative"
        style={{ background: `${accentColor}18` }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col gap-3 relative">
        <h3 className="text-white font-bold text-3xl leading-tight">{title}</h3>
        <p className="text-white/50 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Footer hint */}
      <div
        className="relative text-xs font-bold uppercase tracking-widest flex items-center gap-2 shrink-0"
        style={{ color: accentColor }}
      >
        <span>⊕</span>
        <span>Enter</span>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{
          background: `linear-gradient(90deg, ${accentColor}70, transparent)`,
        }}
      />
    </FocusCard>
  );
};
