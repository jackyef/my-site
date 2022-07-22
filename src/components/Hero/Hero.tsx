import clsx from 'clsx';
import { css } from 'goober';
import { FC } from 'react';

import { HeroBackground } from './HeroBackground';

interface Props {
  hidden?: boolean;
}

export const Hero: FC<Props> = ({ hidden }) => {
  const containerClass = css`
    height: 99vh;
    transition: var(--transition-default);
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    pointer-events: none;
    --blob-opacity: ${hidden ? 0.1 : 0.2};
    --blob-scale: ${hidden ? 0.8 : 1};
    isolation: isolate;
  `;

  return (
    <>
      <div
        className={css`
          position: sticky;
          margin-top: calc(var(--navbar-height) * -1);
          top: -30vh;
          z-index: -1;
        `}
      >
        <div className={clsx(containerClass)}>
          <HeroBackground />
        </div>
      </div>
      <div
        className={css`
          height: var(--navbar-height);
        `}
      />
    </>
  );
};
