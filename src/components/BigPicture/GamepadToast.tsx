import { useEffect, useRef } from 'react';
import hotToast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BUTTON } from './constants';

/**
 * Tiny component dynamically imported in _app.tsx.
 * Listens for a gamepad connection and shows a single toast
 * with a link to the Big Picture page. Zero impact on main bundle.
 */
export const GamepadToast = () => {
  const shownRef = useRef(false);
  const routerRef = useRef<ReturnType<typeof useRouter> | null>(null);
  const router = useRouter();
  routerRef.current = router;

  useEffect(() => {
    let rafId: number | null = null;
    let prevStartPressed = false;

    const stopPolling = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const startPolling = (toastId: string) => {
      const poll = () => {
        const gamepads = navigator.getGamepads();
        const gamepad = Array.from(gamepads).find(Boolean);

        if (gamepad) {
          const isPressed = gamepad.buttons[BUTTON.START]?.pressed ?? false;

          if (isPressed && !prevStartPressed) {
            hotToast.dismiss(toastId);
            routerRef.current?.push('/absurd-ui/big-picture');
            stopPolling();
            return;
          }

          prevStartPressed = isPressed;
        }

        rafId = requestAnimationFrame(poll);
      };

      rafId = requestAnimationFrame(poll);
    };

    const handleConnected = () => {
      if (shownRef.current) return;
      shownRef.current = true;

      const toastId = hotToast(
        (t) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>🎮 Controller detected!</div>
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
              Press start to enter big picture mode
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

      startPolling(toastId);
    };

    window.addEventListener('gamepadconnected', handleConnected);
    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      stopPolling();
    };
  }, []);

  return null;
};
