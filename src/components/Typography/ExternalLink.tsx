interface Props {
  href: string;
  className?: string;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `text-blue-600 underline hover:text-blue-400`,
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
