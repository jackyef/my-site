import { FocusCard } from './FocusCard';

interface Props {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  onClick: () => void;
  prefersReducedMotion?: boolean;
  row?: string;
}

export const PostCard = ({
  title,
  description,
  date,
  readingTime,
  tags,
  onClick,
  prefersReducedMotion = false,
  row = 'posts',
}: Props) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <FocusCard
      row={row}
      onClick={onClick}
      prefersReducedMotion={prefersReducedMotion}
      className="flex flex-col gap-3 p-5 h-full min-h-[180px] text-left"
    >
      <div className="flex-1">
        <h3 className="text-white font-semibold text-base leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
        <span>{formattedDate}</span>
        <span>·</span>
        <span>{readingTime}</span>
        {tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full bg-white/10 text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </FocusCard>
  );
};
