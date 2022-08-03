import hotToast from 'react-hot-toast';

import { getHslaColor } from './styles/colors';

type NotifyParams = {
  text: string;
  duration?: number;
};

export const toast = ({ text, duration = 5000 }: NotifyParams) => {
  hotToast(text, {
    duration,
    style: {
      padding: '10px 20px',
      background: getHslaColor('bg'),
      color: 'var(--color-text)',
      border: 'var(--border-dark-only)',
      boxShadow: 'var(--shadow-md)',
    },
  });
};
