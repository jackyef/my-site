import clsx from 'clsx';
import { css } from 'goober';

interface Props {
  hasError: boolean;
  children: React.ReactNode;
}

export const Container = ({ children, hasError }: Props) => {
  const errorContainerClass = css`
    color: rgba(var(--rgb-secondary), 1);
    background: rgba(var(--rgb-secondary), 0.1);
    border-color: rgba(var(--rgb-secondary), 0.6) !important;
  `;

  return (
    <div
      className={clsx(
        'lg:mx-8',
        'mt-8',
        'mb-16',
        'p-8',
        'rounded-2xl',
        'border-2',
        'border-theme-backgroundOffset',
        {
          [errorContainerClass]: hasError,
        },
      )}
    >
      {children}
    </div>
  );
};
