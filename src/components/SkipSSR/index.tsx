import * as React from 'react';

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SkipSSR = ({ children, fallback = null }: Props) => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    setState(true);
  }, []);

  if (state) return <>{children}</>;

  return <>{fallback}</>;
};
