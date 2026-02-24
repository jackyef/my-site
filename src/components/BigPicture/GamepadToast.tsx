import { useEffect, useRef } from 'react';
import hotToast from 'react-hot-toast';
import Link from 'next/link';

/**
 * Tiny component dynamically imported in _app.tsx.
 * Listens for a gamepad connection and shows a single toast
 * with a link to the Big Picture page. Zero impact on main bundle.
 */
export const GamepadToast = () => {
  const shownRef = useRef(false);

  useEffect(() => {
    const handleConnected = () => {
      if (shownRef.current) return;
      shownRef.current = true;

      hotToast(
        (t) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>🎮 Controller detected!</span>
            <Link
              href="/absurd-ui/big-picture"
              onClick={() => hotToast.dismiss(t.id)}
              style={{
                background: 'rgba(99,102,241,0.9)',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 12px',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Enter Big Picture →
            </Link>
          </div>
        ),
        {
          duration: 8000,
          style: {
            padding: '10px 16px',
            color: 'var(--color-text)',
            border: 'var(--border-dark-only)',
          },
          className: 'bg-surface-3 shadow-surface-3',
        },
      );
    };

    window.addEventListener('gamepadconnected', handleConnected);
    return () =>
      window.removeEventListener('gamepadconnected', handleConnected);
  }, []);

  return null;
};
