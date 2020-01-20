import React from 'react';

import { FaArrowDown } from 'react-icons/fa/';

const DownArrowButton = props => {
  const { onClick, theme } = props;

  return (
    <React.Fragment>
      <button onClick={onClick} aria-label="scroll">
        <FaArrowDown />
      </button>

      {/* --- STYLES --- */}
      <style jsx>{`
        button {
          background: rgba(255, 255, 255, 0.3);
          border: 0;
          border-radius: 50%;
          font-size: ${theme.font.size.m};
          padding: ${theme.space.s} ${theme.space.m};
          cursor: pointer;
          width: ${theme.space.xl};
          height: ${theme.space.xl};

          &:focus {
            outline-style: none;
            background: ${theme.color.brand.primary.active};
          }

          :global(svg) {
            position: relative;
            top: 5px;
            fill: ${theme.color.neutral.white};
            stroke-width: 40;
            stroke: ${theme.color.neutral.white};
            animation-duration: ${theme.time.duration.long};
            animation-name: buttonIconMove;
            animation-iteration-count: infinite;
          }
        }

        @keyframes buttonIconMove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @from-width tablet {
          button {
            font-size: ${theme.font.size.l};
          }
        }

        @from-width desktop {
          button {
            font-size: ${theme.font.size.xl};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default React.memo(DownArrowButton);
