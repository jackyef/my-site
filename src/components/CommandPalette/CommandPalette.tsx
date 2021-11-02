import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Action } from './Actions/Action';
import { filterValidQueries, Query } from './Actions/actions';
import { ResultBox } from './ResultBox';
import { SearchInput } from './SearchInput';

export default () => {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [actionQueries, setActionQueries] = useState<Query[]>([]);

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
          className={clsx(
            'p-4',
            'bg-theme-background',
            'text-theme-text',
            'rounded-3xl',
            'top',
            'animate-halfFadeIn',
            'transition-colors',
            'duration-500',
          )}
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%)',
            width: '90vw',
            maxWidth: '44rem',
            maxHeight: '60vh',
          }}
        >
          <SearchInput
            placeholder="search..."
            value={query}
            onChange={handleChangeQuery}
          />
          {actionQueries.length > 0 && (
            <ResultBox>
              {actionQueries.map((query) => {
                return <Action key={query} query={query} />;
              })}
            </ResultBox>
          )}
          <Dialog.Close asChild>
            <button
              className={clsx(
                'w-4',
                'h-4',
                'p-4',
                'absolute',
                'grid',
                'place-content-center',
                'rounded-full',
                'bg-opacity-70',
                'text-2xl',
                'bg-theme-background',
                'text-theme-text',
                'transition-colors',
                'duration-500',
              )}
              style={{
                top: '-1rem',
                right: 0,
                transform: 'translateY(-100%)',
              }}
            >
              &times;
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
