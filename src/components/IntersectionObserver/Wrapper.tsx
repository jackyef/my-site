import { useState } from 'react';
import useIntersect from '@/hooks/useIntersect';

interface Props {
  children: React.ReactNode;
}

/**
 * This wrapper component use render props pattern
 * to lazily render a component using an intersection observer
 */
export const IOWrapper = ({ children }: Props) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useIntersect<HTMLDivElement>({
    onIntersect: () => setShow(true),
    onlyOnce: true,
  });

  return !show ? <div ref={wrapperRef} /> : <>{children}</>;
};
