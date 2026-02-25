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
      className="flex flex-col gap-5 p-7 w-full h-full text-left"
    >
      {/* Date + reading time */}
      <div className="flex items-center gap-2 text-sm text-white/40 font-medium shrink-0">
        <span>{formattedDate}</span>
        <span>·</span>
        <span>{readingTime}</span>
      </div>

      {/* Title */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-white font-semibold text-2xl leading-snug line-clamp-3">
          {title}
        </h3>
        <p className="text-white/50 text-base leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 shrink-0">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-white/8 text-white/55 text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </FocusCard>
  );
};
