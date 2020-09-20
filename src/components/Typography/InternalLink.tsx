import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
}

export const InternalLink: React.FC<Props> = ({
  href,
  children,
  className = 'text-blue-600 underline hover:text-blue-400',
}) => {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};
