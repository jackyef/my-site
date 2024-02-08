import { cn } from '@/utils/styles/classNames';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const Paragraph: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <p className={cn(`text-md text-theme-text md:text-lg my-6`, className)}>
      {children}
    </p>
  );
};
