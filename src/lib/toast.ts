import hotToast from 'react-hot-toast';

type NotifyParams = {
  text: string;
  duration?: number;
};

export const toast = ({ text, duration = 5000 }: NotifyParams) => {
  hotToast(text, {
    duration,
    className: 'bg-(--color-bg-panel) shadow-(--shadow-md)',
    style: {
      padding: '10px 20px',
      color: 'var(--color-ink-2)',
      border: '1px solid var(--color-border)',
    },
  });
};
