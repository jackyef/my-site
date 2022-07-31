import { css, keyframes } from 'goober';

import { useUrlMetadata } from './useUrlMetadata';

interface Props {
  href: string;
}

export const LinkPreview = ({ href }: Props) => {
  const { data, isLoading } = useUrlMetadata(href);

  if (!data || isLoading) return null;

  const anim = keyframes`
    from {
      opacity: 0;
      transform: translateY(100px) scale(0.5);
      pointer-events: none;
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
  `;

  const className = css`
    position: absolute;
    width: 300px;
    max-width: 90vw;
    top: -100%;
    border-radius: 16px;
    background-color: var(--color-bg-offset);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    font-size: 12px;
    opacity: 0;
    transform: translateY(100px) scale(0.5);
    pointer-events: none;
    animation: ${anim} 0.3s;
    animation-fill-mode: both;

    & > img {
      border-radius: 8px;
      max-height: 200px;
      object-fit: contain;
      width: 100%;
    }
  `;

  return (
    <span className={className}>
      <img src={data.image} />
      <span>{data.title}</span>
      <span>{data.description}</span>
    </span>
  );
};
