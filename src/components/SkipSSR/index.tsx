import * as React from 'react';

export const SkipSSR = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement | null => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    setState(true);
  }, []);

  return state ? children : null;
};
