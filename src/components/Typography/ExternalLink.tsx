interface Props {
  href: string;
  className?: string;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `text-teal-600 underline hover:text-teal-400`,
  children,
}) => {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};
