import { css } from 'goober';

import { cn } from '@/utils/styles/classNames';

export const TrackDebugger = () => {
  return (
    <>
      <div
        className={cn(
          css`
            &::before {
              display: block;
              position: absolute;
              content: var(--slider-value);
              font-size: 0.7rem;
              top: 50%;
              left: -2ch;
            }
          `,
        )}
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          transform: 'translateY(-50%) translateX(-50%)',
          background: 'rgba(255,0,0,0.3)',
          position: 'absolute',
          top: '50%',
          left: 'var(--projected-distance)',
        }}
      />

      <style jsx>{`
        div {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};
