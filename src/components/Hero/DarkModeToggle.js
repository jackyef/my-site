import React, { useContext, useRef, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi/';
import { DarkModeContext } from '../../layouts';

const MemoFiSun = React.memo(FiSun);
const MemoFiMoon = React.memo(FiMoon);

const DarkModeToggle = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const toggleRef = useRef();
  const [count, setCount] = useState(0);
  // some workaround needed to have a consistent toggle rotation
  const initiallyDarkModeRef = useRef(darkMode);

  const toggleDarkMode = () => {
    setCount(count + 1);
    toggle();

    const baseDegree = (count + 1) * 180;
    toggleRef.current.style.transform = `rotateZ(${
      initiallyDarkModeRef.current ? '180deg' : '0deg'
    })
    rotateZ(${baseDegree}deg)`;
  };

  return (
    <React.Fragment>
      <div ref={toggleRef} className="darkmode-toggle">
        <button className="sun" onClick={toggleDarkMode} aria-label="light theme">
          <MemoFiSun size={56} />
        </button>
        <button className="moon" onClick={toggleDarkMode} aria-label="dark theme">
          <MemoFiMoon size={56} />
        </button>
      </div>
      {/* --- STYLES --- */}
      <style jsx>{`
        .darkmode-toggle {
          position: absolute;
          width: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.5s ease-out;
          will-change: transform;
          transform: rotateZ(var(--dark-mode-toggle-rotation));
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
