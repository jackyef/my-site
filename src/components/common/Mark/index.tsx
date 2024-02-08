import { cn } from '@/utils/styles/classNames';

export const Mark = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'mark'>) => {
  return <mark {...props} className={cn(className)} />;
};
