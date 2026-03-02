interface Props {
  title: string;
  subtitle?: string;
}

export const PlayerTitle = ({ title, subtitle }: Props) => {
  return (
    <h5 className="mb-2 font-semibold text-(--color-ink)">
      {title}

      {Boolean(subtitle) && (
        <span className="italic text-sm font-light text-(--color-ink-3)">
          {' '}
          {subtitle}
        </span>
      )}
    </h5>
  );
};
