import Link from 'next/link';

interface Props {
  href: string;
}

export const InternalLink: React.FC<Props> = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className="text-blue-600 underline hover:text-blue-400">{children}</a>
    </Link>
  );
};
