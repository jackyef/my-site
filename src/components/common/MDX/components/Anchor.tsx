import { FunctionComponent, HTMLProps } from 'react';

import { ExternalLink } from '@/components/Typography/ExternalLink';
import { InternalLink } from '@/components/Typography/InternalLink';

export const Anchor: FunctionComponent<HTMLProps<HTMLAnchorElement>> = ({
  href = '',
  ...props
}) => {
  if (href.startsWith('http')) {
    return <ExternalLink href={href} {...props} />;
  } else {
    return <InternalLink href={href} {...props} />;
  }
};
