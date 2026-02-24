import { useCallback, useEffect, useRef, useState } from 'react';

import { AXIS, DPAD_DEBOUNCE_MS, STICK_THRESHOLD } from '../constants';

type ButtonCallback = (buttonIndex: number) => void;
type AxisCallback = (axisIndex: number, value: number) => void;

interface UseGamepadOptions {
  isActive: boolean;
  onButtonPress?: ButtonCallback;
  onAxisChange?: AxisCallback;
  onGamepadConnected?: () => void;
  onGamepadDisconnected?: () => void;
}

export const useGamepad = ({
  isActive,
  onButtonPress,
  onAxisChange,
  onGamepadConnected,
  onGamepadDisconnected,
}: UseGamepadOptions) => {
  const [hasGamepad, setHasGamepad] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastButtonPressRef = useRef<Record<number, number>>({});
  const prevButtonStateRef = useRef<Record<number, boolean>>({});
  const prevAxisStateRef = useRef<Record<number, number>>({});

  const handleConnected = useCallback(() => {
    setHasGamepad(true);
    onGamepadConnected?.();
  }, [onGamepadConnected]);

  const handleDisconnected = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const hasAny = Array.from(gamepads).some(Boolean);
    setHasGamepad(hasAny);
    if (!hasAny) {
      onGamepadDisconnected?.();
    }
  }, [onGamepadDisconnected]);

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleDisconnected);

    // Check for already-connected gamepads
    const gamepads = navigator.getGamepads();
    if (Array.from(gamepads).some(Boolean)) {
      setHasGamepad(true);
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleDisconnected);
    };
  }, [handleConnected, handleDisconnected]);

  const pollGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = Array.from(gamepads).find(Boolean);

    if (gamepad) {
      const now = Date.now();

      // Check button presses (edge detection: not-pressed → pressed)
      gamepad.buttons.forEach((button, index) => {
        const wasPressed = prevButtonStateRef.current[index] ?? false;
        const isPressed = button.pressed;

        if (isPressed && !wasPressed) {
          const lastPress = lastButtonPressRef.current[index] ?? 0;
          if (now - lastPress > DPAD_DEBOUNCE_MS) {
            lastButtonPressRef.current[index] = now;
            onButtonPress?.(index);
          }
        }

        prevButtonStateRef.current[index] = isPressed;
      });

      // Check axis changes
      gamepad.axes.forEach((value, index) => {
        const prevValue = prevAxisStateRef.current[index] ?? 0;
        const crossedThreshold =
          (Math.abs(value) >= STICK_THRESHOLD &&
            Math.abs(prevValue) < STICK_THRESHOLD) ||
          (Math.abs(value) < STICK_THRESHOLD &&
            Math.abs(prevValue) >= STICK_THRESHOLD);

        if (crossedThreshold && Math.abs(value) >= STICK_THRESHOLD) {
          onAxisChange?.(index, value);
        }

        // For scrolling (right stick), report continuous values
        if (index === AXIS.RIGHT_Y && Math.abs(value) >= STICK_THRESHOLD) {
          onAxisChange?.(index, value);
        }

        prevAxisStateRef.current[index] = value;
      });
    }

    rafRef.current = requestAnimationFrame(pollGamepad);
  }, [onButtonPress, onAxisChange]);

  useEffect(() => {
    if (isActive) {
      rafRef.current = requestAnimationFrame(pollGamepad);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, pollGamepad]);

  return { hasGamepad };
};
