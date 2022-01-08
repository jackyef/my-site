import clsx from 'clsx';
import { css, keyframes } from 'goober';

export const HeroBackground = () => {
  const fly = keyframes`
    100% {
      transform: rotate(1turn) translate(80px) rotate(-1turn);
    }
  `;

  const flyPlus = keyframes`
    100% {
      transform: rotate(-1turn) translate(100px) rotate(1turn);
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
    opacity: 0.15;
  `;

  const one = css`
    border-radius: 100%;
    width: 150%;
    height: 150%;
    background-color: rgb(var(--rgb-tertiary));
    left: -20%;
    top: -75%;
    z-index: 3;
    animation: ${fly} 12s linear infinite;
    transform: rotate(0) translate(80px) rotate(0);
  `;

  const two = css`
    width: 125%;
    height: 200%;
    background-color: rgb(var(--rgb-primary));
    bottom: -10%;
    left: -20%;
  `;

  const three = css`
    border-radius: 100%;
    width: 108%;
    height: 108%;
    bottom: -20%;
    right: -25%;
    background-color: rgb(var(--rgb-secondary));
    animation: ${flyPlus} 8s linear infinite;
    transform: rotate(0) translate(100px) rotate(0);
  `;

  const left = css`
    position: absolute;
    inset: 0;
    transform: translateX(-100%) rotate(0.5turn);
  `;

  const right = css`
    position: absolute;
    inset: 0;
    transform: translateX(92%) rotate(0.5turn) translateY(-34%);
  `;

  return (
    <div className={wrapper}>
      <div className={left}>
        <div className={clsx(base, one)}></div>
        <div className={clsx(base, two)}></div>
        <div className={clsx(base, three)}></div>
      </div>
      <div className={right}>
        <div className={clsx(base, one)}></div>
        <div className={clsx(base, two)}></div>
        <div className={clsx(base, three)}></div>
      </div>
    </div>
  );
};
