import { MDXProvider as _MDXProvider } from '@mdx-js/react';

import { ExternalLink } from '@/components/Typography/ExternalLink';
import { InternalLink } from '@/components/Typography/InternalLink';

const mdxComponents = {
  a: ({ href, ...props }: any) => {
    if (href.startsWith('http')) {
      return <ExternalLink href={href} {...props} />;
    } else {
      return <InternalLink href={href} {...props} />;
    }
  },
  pre: ({ className, ...props }: any) => (
    <pre
      className={`${className} rounded-md bg-gray-800 py-3 px-4 overflow-x-auto`}
      {...props}
    />
  ),
  'pre.code': ({ className, ...props }: any) => (
    <code className={`${className} text-gray-200`} {...props} />
  ),
};

interface Props {
  children?: React.ReactNode;
}

export const MDXProvider = ({ children }: Props) => {
  return <_MDXProvider components={mdxComponents}>{children}</_MDXProvider>;
};
