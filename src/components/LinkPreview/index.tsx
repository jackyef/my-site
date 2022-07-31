import clsx from 'clsx';
import { css, keyframes } from 'goober';

import { HorizontalDivider } from '../Divider';

import { useUrlMetadata } from './useUrlMetadata';

interface Props {
  href: string;
}

export const LinkPreview = ({ href }: Props) => {
  const { data, isLoading, isError } = useUrlMetadata(href);

  if (!data || isLoading || isError) return null;

  const anim = keyframes`
    from {
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
    }

    to {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
  `;

  const container = css`
    width: 300px;
    max-width: 100%;
    margin: 0 auto;
    border-radius: 16px;
    background-color: var(--color-bg-offset);
    box-shadow: var(--shadow-md);
    padding: 12px;
    opacity: 0;
    transform-origin: var(--radix-tooltip-content-transform-origin);
    transform: scale(0.5);
    pointer-events: none;
    animation: ${anim} 0.3s;
    animation-fill-mode: both;

    & > img {
      border-radius: 4px;
      max-height: 200px;
      object-fit: contain;
      width: 100%;
    }
  `;

  return (
    <span
      className={clsx(
        container,
        'flex flex-col space-y-2',
        'text-sm font-normal',
      )}
    >
      {Boolean(data.image) && (
        <>
          <img src={data.image} className="mb-2" />
          <HorizontalDivider />
        </>
      )}
      <span className={clsx('text-base font-bold')}>{data.title}</span>
      <span>{data.description}</span>
    </span>
  );
};
