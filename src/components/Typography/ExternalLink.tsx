interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `fancy-anchor`,
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
