import { MDXProvider as _MDXProvider } from '@mdx-js/react';

import { Anchor } from './components/Anchor';
import { Pre, PreCode } from './components/Pre';

const mdxComponents = {
  a: Anchor,
  pre: Pre,
  'pre.code': PreCode,
};

interface Props {
  children?: React.ReactNode;
}

export const MDXProvider = ({ children }: Props) => {
  return (
    <_MDXProvider
      // @ts-ignore
      components={mdxComponents}
    >
      {children}
    </_MDXProvider>
  );
};
