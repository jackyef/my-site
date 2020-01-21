import React, { useState, useContext, useRef } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi/';
import { DarkModeContext } from '../../layouts';

const DarkModeToggle = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const [clickCount, setClickCount] = useState(0);
  const toggleDarkMode = () => {
    setClickCount(prev => prev + 1);
    toggle();
  };

  // some workaround needed to have a consistent toggle rotation
  const initiallyDarkModeRef = useRef(darkMode);
  const baseDegree = clickCount * 180;

  return (
    <React.Fragment>
      <div id="asd" className={`darkmode-toggle ${clickCount > 0 ? 'clicked' : ''}`}>
        <button className="sun" onClick={toggleDarkMode} aria-label="light theme">
          <FiSun size={56} />
        </button>
        <button className="moon" onClick={toggleDarkMode} aria-label="dark theme">
          <FiMoon size={56} />
        </button>
      </div>
      {/* --- STYLES --- */}
      <style jsx>{`
        .darkmode-toggle {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.5s ease-out;
          transform: rotateZ(var(--dark-mode-toggle-rotation)) rotateZ(${baseDegree}deg);
        }

        .clicked {
          transform: rotateZ(${initiallyDarkModeRef.current ? '180deg' : '0deg'})
            rotateZ(${baseDegree}deg);
        }

        button.sun,
        button.moon {
          color: white;
          position: absolute;
          transition: opacity 0.3s;
          opacity: 0;
          background: transparent;
          border: none;
        }

        button.sun {
          opacity: var(--light-mode-enabled);
          transform: translateY(-180px);
        }

        button.moon {
          opacity: var(--dark-mode-enabled);
          transform: translateY(180px) rotateZ(180deg);
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

        @from-width desktop {
          button {
            background: transparent;
            border: none;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default React.memo(DarkModeToggle);
