import hotToast from 'react-hot-toast';

type NotifyParams = {
  text: string;
  duration?: number;
};

export const toast = ({ text, duration = 5000 }: NotifyParams) => {
  hotToast(text, {
    duration,
    className: 'bg-surface-3 shadow-surface-3',
    style: {
      padding: '10px 20px',
      color: 'var(--color-text)',
      border: 'var(--border-dark-only)',
    },
  });
};
