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
    transform: ${hidden ? 'translateY(-80%)' : 'translateY(0)'};
    transition: var(--transition-default);
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  `;

  return (
    <div className={clsx(containerClass)}>
      <HeroBackground />
    </div>
  );
};
