import { useCallback, useEffect } from 'react';

import { AXIS, BUTTON, SCROLL_SPEED } from '../constants';

import { useBigPictureContext } from './useBigPictureContext';
import { useGamepad } from './useGamepad';

const getFocusableElements = () => {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.bp-focusable'),
  ).filter((el) => !el.closest('[data-bp-hidden]') && el.offsetParent !== null);
};

const getRow = (el: HTMLElement) => el.dataset.bpRow ?? '';

// Focuses an element without the browser's instant scroll-jump, then
// smoothly scrolls the element into view via the scroll container.
const focusAndScroll = (el: HTMLElement) => {
  el.focus({ preventScroll: true });
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
};

const moveFocus = (direction: 'left' | 'right' | 'up' | 'down') => {
  const elements = getFocusableElements();
  const focused = document.activeElement as HTMLElement | null;

  if (elements.length === 0) return;

  if (!focused || !elements.includes(focused)) {
    elements[0]?.focus({ preventScroll: true });
    return;
  }

  const currentIndex = elements.indexOf(focused);
  const currentRow = getRow(focused);

  if (direction === 'left' || direction === 'right') {
    const sameRow = elements.filter((el) => getRow(el) === currentRow);
    const rowIndex = sameRow.indexOf(focused);

    if (direction === 'left' && rowIndex > 0) {
      const target = sameRow[rowIndex - 1];
      if (target) focusAndScroll(target);
    } else if (direction === 'right' && rowIndex < sameRow.length - 1) {
      const target = sameRow[rowIndex + 1];
      if (target) focusAndScroll(target);
    }
  } else {
    const rows = [...new Set(elements.map(getRow))].filter(Boolean);
    if (rows.length === 0) {
      if (direction === 'up' && currentIndex > 0) {
        const target = elements[currentIndex - 1];
        if (target) focusAndScroll(target);
      } else if (direction === 'down' && currentIndex < elements.length - 1) {
        const target = elements[currentIndex + 1];
        if (target) focusAndScroll(target);
      }
      return;
    }

    const currentRowIndex = rows.indexOf(currentRow);
    const targetRowIndex =
      direction === 'up' ? currentRowIndex - 1 : currentRowIndex + 1;

    if (targetRowIndex < 0 || targetRowIndex >= rows.length) return;

    const targetRow = rows[targetRowIndex];
    const targetRowElements = elements.filter((el) => getRow(el) === targetRow);
    const target = targetRowElements[0];
    if (target) focusAndScroll(target);
  }
};

interface Options {
  onNavigate?: () => void;
  onBack?: () => void;
}

export const useControllerNavigation = ({
  onNavigate,
  onBack,
}: Options = {}) => {
  const { pop } = useBigPictureContext();

  const handleButtonPress = useCallback(
    (buttonIndex: number) => {
      switch (buttonIndex) {
        case BUTTON.DPAD_LEFT:
          onNavigate?.();
          moveFocus('left');
          break;
        case BUTTON.DPAD_RIGHT:
          onNavigate?.();
          moveFocus('right');
          break;
        case BUTTON.DPAD_UP:
          onNavigate?.();
          moveFocus('up');
          break;
        case BUTTON.DPAD_DOWN:
          onNavigate?.();
          moveFocus('down');
          break;
        case BUTTON.A:
          // Don't call onSelect here — the synthetic .click() below fires a
          // click event that the shell's document listener will catch instead,
          // avoiding double-playing when using a gamepad.
          (document.activeElement as HTMLElement)?.click();
          break;
        case BUTTON.B:
        case BUTTON.START:
          onBack?.();
          pop();
          break;
      }
    },
    [pop, onNavigate, onBack],
  );

  const handleAxisChange = useCallback(
    (axisIndex: number, value: number) => {
      if (axisIndex === AXIS.LEFT_X) {
        onNavigate?.();
        moveFocus(value < 0 ? 'left' : 'right');
      } else if (axisIndex === AXIS.LEFT_Y) {
        onNavigate?.();
        moveFocus(value < 0 ? 'up' : 'down');
      } else if (axisIndex === AXIS.RIGHT_Y) {
        const scrollable = document.querySelector<HTMLElement>(
          '[data-bp-scrollable]',
        );
        if (scrollable) {
          scrollable.scrollTop += value * SCROLL_SPEED;
        }
      }
    },
    [onNavigate],
  );

  // Page is always active — no isActive guard needed
  const { hasGamepad } = useGamepad({
    isActive: true,
    onButtonPress: handleButtonPress,
    onAxisChange: handleAxisChange,
  });

  // Keyboard fallbacks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onNavigate?.();
          moveFocus('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNavigate?.();
          moveFocus('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          onNavigate?.();
          moveFocus('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNavigate?.();
          moveFocus('down');
          break;
        case 'Escape':
          e.preventDefault();
          onBack?.();
          pop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pop, onNavigate, onBack]);

  return { hasGamepad };
};
