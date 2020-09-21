import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
}

export const InternalLink: React.FC<Props> = ({
  href,
  children,
  className = `text-teal-500 underline hover:text-teal-300`,
  ...rest
}) => {
  return (
    <Link href={href}>
      <a className={className} {...rest}>{children}</a>
    </Link>
  );
};
