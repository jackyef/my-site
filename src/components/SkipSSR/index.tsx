import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

export const SkipSSR = ({ children }: Props) => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    setState(true);
  }, []);

  if (state) return <>{children}</>;

  return null;
};
