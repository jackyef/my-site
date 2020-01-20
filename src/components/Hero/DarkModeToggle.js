import React, { useState, useContext } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi/';
import { DarkModeContext } from '../../layouts';

const DarkModeToggle = () => {
  const { darkMode: dark, toggle } = useContext(DarkModeContext);
  const [clickCount, setClickCount] = useState(dark ? 1 : 0);
  const toggleDarkMode = () => {
    setClickCount(prev => prev + 1);
    toggle();
  };

  const baseDegree = clickCount * 180;

  const sunClass = dark ? 'sun' : 'sun active';
  const moonClass = dark ? 'moon active' : 'moon';

  return (
    <React.Fragment>
      <div className={`darkmode-toggle ${dark ? 'darkmode-active' : ''}`}>
        <button className={sunClass} onClick={toggleDarkMode}>
          <FiSun size={56} />
        </button>
        <button className={moonClass} onClick={toggleDarkMode}>
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
          transform: rotateZ(${baseDegree}deg);
        }

        .darkmode-active {
          transform: rotateZ(${baseDegree}deg);
        }

        button.sun,
        button.moon {
          color: white;
          position: absolute;
          transition: opacity 0.3s;
          opacity: 0;
        }

        button.sun {
          transform: translateY(-180px);
        }

        button.moon {
          transform: translateY(180px) rotateZ(180deg);
        }

        button.active {
          opacity: 1;
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
            // display: none;
            background: transparent;
            border: none;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default DarkModeToggle;
