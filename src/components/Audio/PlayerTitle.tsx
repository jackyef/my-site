interface Props {
  title: string;
  subtitle?: string;
}

export const PlayerTitle = ({ title, subtitle }: Props) => {
  return (
    <h5 className="mb-2 font-semibold">
      {title}

      {Boolean(subtitle) && (
        <span className="italic text-sm font-light"> {subtitle}</span>
      )}
    </h5>
  );
};
