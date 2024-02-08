import { getHslaColor } from '@/lib/styles/colors';

export const Mark = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'mark'>) => {
  return (
    <mark {...props}>
      <span>{children}</span>

      <style jsx>{`
        mark {
          --factor: 1;
          color: currentColor;
          animation: highlight;
          animation-timeline: view();
          background: transparent;
        }

        @keyframes highlight {
          to {
            --factor: 0;
          }
        }

        mark span {
          background: linear-gradient(
              120deg,
              ${getHslaColor('secondary', 0.3)} 50%,
              transparent 50%
            )
            110% 0 / 220% 100% no-repeat;
          background-position: calc(var(--factor) * 110%) 0;
          transition: background-position 1s;
        }
      `}</style>
    </mark>
  );
};
