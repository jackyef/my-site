import clsx from 'clsx';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const Paragraph: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <p className={clsx(`text-md text-theme-text md:text-lg my-6`, className)}>
      {children}
    </p>
  );
};
