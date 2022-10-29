import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Anchor } from './components/Anchor';
import { Pre, PreCode } from './components/Pre';

const mdxComponents = {
  a: Anchor,
  pre: Pre,
  'pre.code': PreCode,
};

interface Props {
  mdxSource?: MDXRemoteSerializeResult;
}

export const MDXProvider = ({ mdxSource }: Props) => {
  return (
    <MDXRemote
      {...mdxSource}
      // @ts-ignore
      components={mdxComponents}
    />
  );
};
