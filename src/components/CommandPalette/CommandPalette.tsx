import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Action } from './Actions/Action';
import { filterValidQueries, Query } from './Actions/actions';
import { ResultBox } from './ResultBox';
import { SearchInput } from './SearchInput';

export default () => {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'k') {
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const rootContainer = document.getElementById('__next');

    if (!rootContainer) return;

    rootContainer.style.transition = 'transform 0.15s ease-in-out';

    if (isOpen) {
      rootContainer.style.transform = 'scale(0.997)';
    } else {
      rootContainer.style.transform = 'scale(1)';
    }
  });

  useEffect(() => {
    const container = contentContainerRef.current;

    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (!activeElement) return;

      const focusableElements = Array.from(
        container.querySelectorAll('.focusable-cmd-item'),
      );

      const activeElementIndex = focusableElements.findIndex(
        (el) => el === activeElement,
      );

      // Move focus with arrow keys
      if (e.key === 'ArrowDown') {
        e.preventDefault();

        const newIndex = (activeElementIndex + 1) % focusableElements.length;

        (focusableElements[newIndex] as HTMLElement)?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        const newIndex =
          activeElementIndex === 0
            ? focusableElements.length - 1
            : activeElementIndex - 1;

        (focusableElements[newIndex] as HTMLElement)?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleChangeQuery: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setQuery(value);
    setActionQueries(value ? filterValidQueries(value) : []);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal>
      <Dialog.Overlay>
        <div className="backdrop-blur fixed inset-0 bg-black bg-opacity-30 animate-fadeIn" />
      </Dialog.Overlay>
      <Dialog.Content asChild>
        <div
          ref={contentContainerRef}
          className={clsx(
            'p-4',
            'bg-theme-background',
            'text-theme-text',
            'rounded-3xl',
            'top',
            'animate-fadeIn',
            'transition-colors',
            'duration-500',
            'border-dark-only',
          )}
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%)',
            width: '90vw',
            maxWidth: '44rem',
          }}
        >
          <SearchInput
            placeholder="search..."
            value={query}
            onChange={handleChangeQuery}
            hasResults={actionQueries.length > 0}
          />
          {actionQueries.length > 0 && (
            <ResultBox>
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
            </ResultBox>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
