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

const moveFocus = (direction: 'left' | 'right' | 'up' | 'down') => {
  const elements = getFocusableElements();
  const focused = document.activeElement as HTMLElement | null;

  if (elements.length === 0) return;

  if (!focused || !elements.includes(focused)) {
    elements[0]?.focus();
    return;
  }

  const currentIndex = elements.indexOf(focused);
  const currentRow = getRow(focused);

  if (direction === 'left' || direction === 'right') {
    const sameRow = elements.filter((el) => getRow(el) === currentRow);
    const rowIndex = sameRow.indexOf(focused);

    if (direction === 'left' && rowIndex > 0) {
      sameRow[rowIndex - 1]?.focus();
    } else if (direction === 'right' && rowIndex < sameRow.length - 1) {
      sameRow[rowIndex + 1]?.focus();
    }
  } else {
    const rows = [...new Set(elements.map(getRow))].filter(Boolean);
    if (rows.length === 0) {
      if (direction === 'up' && currentIndex > 0) {
        elements[currentIndex - 1]?.focus();
      } else if (direction === 'down' && currentIndex < elements.length - 1) {
        elements[currentIndex + 1]?.focus();
      }
      return;
    }

    const currentRowIndex = rows.indexOf(currentRow);
    const targetRowIndex =
      direction === 'up' ? currentRowIndex - 1 : currentRowIndex + 1;

    if (targetRowIndex < 0 || targetRowIndex >= rows.length) return;

    const targetRow = rows[targetRowIndex];
    const targetRowElements = elements.filter((el) => getRow(el) === targetRow);
    targetRowElements[0]?.focus();
  }
};

interface Options {
  onNavigate?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
}

export const useControllerNavigation = ({
  onNavigate,
  onSelect,
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
          onSelect?.();
          (document.activeElement as HTMLElement)?.click();
          break;
        case BUTTON.B:
        case BUTTON.START:
          onBack?.();
          pop();
          break;
      }
    },
    [pop, onNavigate, onSelect, onBack],
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
