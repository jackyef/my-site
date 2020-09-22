interface Props extends React.HTMLProps<HTMLAnchorElement>{
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `text-teal-600 underline hover:text-teal-400`,
  onClick,
  children,
}) => {
  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};
