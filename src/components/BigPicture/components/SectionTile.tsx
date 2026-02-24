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
      className="flex flex-col gap-3 p-6 w-full h-full min-h-[180px]"
      style={
        {
          '--accent': accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl"
        style={{ background: `${accentColor}20` }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
      <div
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        Press ⊕ to enter →
      </div>
    </FocusCard>
  );
};
