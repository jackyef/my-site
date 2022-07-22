import { useEffect, useState } from 'react';

import { canUseDOM } from '@/utils/constants';

export function useReduceMotion() {
  const [matches, setMatch] = useState(
    canUseDOM
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setMatch(mq.matches);
    };

    handleChange();

    mq.addEventListener('change', handleChange);

    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);

  return matches;
}
