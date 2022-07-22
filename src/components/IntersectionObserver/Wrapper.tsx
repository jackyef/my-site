import { useState } from 'react';

import useIntersect from '@/hooks/useIntersect';

interface Props {
  children: (show: boolean) => React.ReactElement | null;
  inline?: boolean;
}

/**
 * This wrapper component use render props pattern
 * to lazily render a component using an intersection observer
 */
export const IOWrapper = ({ children, inline = false }: Props) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useIntersect<HTMLDivElement>({
    onIntersect: () => setShow(true),
    onlyOnce: true,
  });

  const Element = inline ? 'span' : 'div';

  return <Element ref={!show ? wrapperRef : null}>{children(show)}</Element>;
};
