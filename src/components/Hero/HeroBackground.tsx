import clsx from 'clsx';
import { css, keyframes } from 'goober';

import { getHslString } from '@/lib/styles/colors';

export const HeroBackground = () => {
  const fly = keyframes`
    100% {
      transform: rotate(1turn) translate(80px) rotate(-1turn);
    }
  `;

  // const flyPlus = keyframes`
  //   100% {
  //     transform: rotate(-1turn) translate(100px) rotate(1turn);
  //   }
  // `;

  /**
   * Safari seems to have a bug where some square artifacts are visible
   * upon switching between theme.
   * Forcing a repaint fixes this.
   */
  const blurBreathing = keyframes`
    from {
      opacity: var(--blob-opacity);
      transform: scale(1);
    }

    50% {
      opacity: calc(var(--blob-opacity) * 0.8);
      transform: scale(0.9);
    }

    to {
      opacity: var(--blob-opacity);
      transform: scale(1);
    }
  `;

  const wrapper = css`
    position: absolute;
    inset: 0;
    z-index: -1;
    height: 20rem;
  `;

  const base = css`
    position: absolute;
    filter: blur(60px);
    animation: ${blurBreathing} 15s linear infinite;
    animation-fill-mode: both;
    opacity: var(--blob-opacity);
    transition: opacity 2s, width 2s, height 2s;
  `;

  const one = css`
    border-radius: 100%;
    width: calc(var(--blob-scale) * 150%);
    height: calc(var(--blob-scale) * 150%);
    background-color: hsl(${getHslString('secondary')});
    left: -20%;
    top: -45%;
    z-index: 3;
    animation: ${fly} 12s linear infinite;
    transform: rotate(0) translate(80px) rotate(0);
  `;

  const two = css`
    width: calc(var(--blob-scale) * 125%);
    height: calc(var(--blob-scale) * 200%);
    background-color: hsl(${getHslString('primary')});
    bottom: -10%;
    left: -20%;
  `;

  // const three = css`
  //   border-radius: 100%;
  //   width: calc(var(--blob-scale) * 108%);
  //   height: calc(var(--blob-scale) * 108%);
  //   bottom: -20%;
  //   right: -25%;
  //   background-color: hsl(${getHslString('tertiary')});
  //   animation: ${flyPlus} 8s linear infinite;
  //   transform: rotate(0) translate(100px) rotate(0);
  // `;

  const left = css`
    position: absolute;
    inset: 0;
    transform: translateY(-10%);
  `;

  return (
    <div className={wrapper}>
      <div className={left}>
        <div className={clsx(base, one)}></div>
        <div className={clsx(base, two)}></div>
        {/* Turning this off for now, looks pretty nice */}
        {/* <div className={clsx(base, three)}></div> */}
      </div>
    </div>
  );
};
