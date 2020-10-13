interface Props extends React.HTMLProps<HTMLAnchorElement>{
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `text-theme-link underline`,
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
