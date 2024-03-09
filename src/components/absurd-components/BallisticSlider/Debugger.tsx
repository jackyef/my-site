import { css } from 'goober';

import { cn } from '@/utils/styles/classNames';

export const Debugger = () => {
  return (
    <>
      {/* Button point */}
      <div
        className={cn(
          css`
            &::before {
              display: block;
              position: absolute;
              content: var(--angle-degree);
              font-size: 0.7rem;
              top: -16px;
              left: 40px;
            }
          `,
        )}
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          position: 'absolute',
          top: 'var(--button-y)',
          left: 'var(--button-x)',
        }}
      />

      {/* Mouse point */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          transform: 'translate(-50%, -50%)',
          background: 'red',
          position: 'absolute',
          top: 'var(--mouse-y)',
          left: 'var(--mouse-x)',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '1px',
          transform: 'translateY(-1px)',
          borderRadius: 4,
          background: 'gray',
          opacity: 0.3,
          position: 'absolute',
          top: 'var(--mouse-y)',
          left: 0,
        }}
      />
      <div
        style={{
          width: '1px',
          height: '100%',
          transform: 'translateX(-1px)',
          borderRadius: 4,
          background: 'gray',
          opacity: 0.3,
          position: 'absolute',
          left: 'var(--mouse-x)',
          top: 0,
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
