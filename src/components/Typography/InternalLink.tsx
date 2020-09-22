import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
}

export const InternalLink: React.FC<Props> = ({
  href,
  children,
  className = `text-teal-600 underline hover:text-teal-400`,
  ...rest
}) => {
  return (
    <Link href={href}>
      <a className={className} {...rest}>{children}</a>
    </Link>
  );
};
