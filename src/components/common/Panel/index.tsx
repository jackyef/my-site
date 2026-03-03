import * as React from 'react';

import { cn } from '@/utils/styles/classNames';

type PanelType = 'info' | 'warning' | 'danger' | 'success' | 'accent';

interface Props {
  type: PanelType;
  title: string;
  children?: React.ReactNode;
}

const STYLES: Record<PanelType, { border: string; bg: string }> = {
  info: {
    border: 'border-l-(--color-info)',
    bg: 'bg-(--color-info-bg)',
  },
  warning: {
    border: 'border-l-(--color-warning)',
    bg: 'bg-(--color-warning-bg)',
  },
  danger: {
    border: 'border-l-(--color-danger)',
    bg: 'bg-(--color-danger-bg)',
  },
  success: {
    border: 'border-l-(--color-success)',
    bg: 'bg-(--color-success-bg)',
  },
  accent: {
    border: 'border-l-(--color-accent)',
    bg: 'bg-(--color-accent-xl)',
  },
};

export const Panel: React.FC<Props> = ({
  type = 'info',
  title = '',
  children,
}) => {
  const { border, bg } = STYLES[type];

  return (
    <div className={cn('rounded-lg my-8 px-5 py-4 border-l-4', border, bg)}>
      <div className="font-bold text-xl mb-2 text-(--color-ink)">{title}</div>
      {children}
    </div>
  );
};
