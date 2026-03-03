import { type JSX } from 'react';

import { Heading } from '@/components/common/Heading';

type Props = JSX.IntrinsicAttributes &
  React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode;
  };

export const H1 = ({ children, ...rest }: Props) => {
  return (
    <Heading level={1} {...rest}>
      {children}
    </Heading>
  );
};

export const H2 = ({ children, ...rest }: Props) => {
  return (
    <Heading level={2} {...rest}>
      {children}
    </Heading>
  );
};

export const H3 = ({ children, ...rest }: Props) => {
  return (
    <Heading level={3} {...rest}>
      {children}
    </Heading>
  );
};

export const H4 = ({ children, ...rest }: Props) => {
  return (
    <Heading level={4} {...rest}>
      {children}
    </Heading>
  );
};

export const H5 = ({ children, ...rest }: Props) => {
  return (
    <Heading level={4} as="h5" className="italic" {...rest}>
      {children}
    </Heading>
  );
};
