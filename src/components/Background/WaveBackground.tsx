import { useReduceMotion } from '@/hooks/useReduceMotion';

export const WaveBackground = ({ hidden = false }) => {
  const prefersReducedMotion = useReduceMotion();

  return (
    <>
      <div
        style={{
          position: 'absolute',
          zIndex: -1,
          minHeight: '28rem',
          left: 0,
          right: 0,
          top: -4,
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          transform: hidden ? 'translateY(-32rem)' : 'translateY(1px)',
          transition: prefersReducedMotion ? '' : 'transform .4s ease-in-out', // https://easings.net/#easeInOutExpo
        }}
      >
        {/* we use 2 divs here to transition between 2 linear-gradient by using opacity */}
        <div
          style={{
            position: 'absolute',
            background: 'linear-gradient(0deg, #1F2930, #111820)', // --color-bg-offset, --color-bg
            zIndex: -1,
            minHeight: '28rem',
            left: 0,
            right: 0,
            transform: 'translateY(1px)',
            transition: 'var(--transition-default)',
            opacity: 'var(--hide-in-light-mode)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            background:
              'linear-gradient(0deg, #fafafa,  rgba(4, 116, 129, 0.25))', // --color-bg, --color-link-highlight
            zIndex: -1,
            minHeight: '28rem',
            left: 0,
            right: 0,
            transform: 'translateY(1px)',
            transition: 'var(--transition-default)',
            opacity: 'var(--hide-in-dark-mode)',
          }}
        />
        <svg
          preserveAspectRatio="none"
          width="1440"
          height="74"
          viewBox="0 0 1440 74"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            fill: 'var(--color-bg)',
            overflow: 'hidden',
            transition: 'var(--transition-default)',
            width: '100%',
          }}
        >
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
        </svg>
      </div>
    </>
  );
};
