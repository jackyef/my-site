import * as React from 'react';

import { canUseDOM } from '@/utils/constants';

export const SkipSSR = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement | null => {
  const [state, setState] = React.useState(canUseDOM);

  React.useEffect(() => {
    setState(true);
  }, []);

  return state ? children : null;
};
