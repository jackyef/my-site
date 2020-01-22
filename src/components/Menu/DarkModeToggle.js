import React, { useContext, useRef } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi/';
import { DarkModeContext } from '../../layouts';

const MemoFiSun = React.memo(FiSun);
const MemoFiMoon = React.memo(FiMoon);

const DarkModeToggle = () => {
  const { toggle } = useContext(DarkModeContext);

  return (
    <React.Fragment>
      <button className="darkmode-menu-toggle" onClick={toggle} aria-label="toggle dark theme">
        <div className="wrapper">
          <span className="sun">
            <MemoFiSun size={24} />
          </span>
          <span className="moon">
            <MemoFiMoon size={24} />
          </span>
        </div>
      </button>
      {/* --- STYLES --- */}
      <style jsx>{`
        .darkmode-menu-toggle {
          position: relative;
          height: 16px;
          margin-right: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          opacity: 0.6;
        }

        .wrapper {
          position: relative;
        }

        .sun,
        .moon {
          will-change: opacity;
          position: absolute;
          color: #111;
          color: var(--textNormal);
          transition: opacity 0.3s;
        }

        .sun {
          opacity: var(--light-mode-enabled);
        }

        .moon {
          opacity: var(--dark-mode-enabled);
        }

        :global(.homepage):not(.fixed) & .sun,
        :global(.homepage):not(.fixed) & .moon {
          color: white;
        }
      `}</style>
    </React.Fragment>
  );
};

export default React.memo(DarkModeToggle);
