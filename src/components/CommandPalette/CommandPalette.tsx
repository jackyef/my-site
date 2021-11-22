import { toast } from '@/lib/toast';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Action } from './Actions/Action';
import { filterValidQueries, Query } from './Actions/actions';
import { useSearchPosts } from './hooks/useSearchPosts';
import { ResultBox } from './ResultBox';
import { SearchInput } from './SearchInput';

let hasOpenedBefore = false;

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const { data } = useSearchPosts(query);

  console.log({ data });

  useEffect(() => {
    if (localStorage.getItem('cmd_k_opened_before') === 'true') {
      hasOpenedBefore = true;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isProbablyTouchDevice =
        window.matchMedia('(pointer: coarse)').matches;

      const platformString = (
        navigator.platform ||
        // @ts-expect-error
        navigator.userAgentData.platform ||
        ''
      ).toLowerCase();
      const isMac = platformString.indexOf('mac') >= 0;

      if (!hasOpenedBefore && !isProbablyTouchDevice) {
        const metaKey = isMac ? 'CMD' : 'Ctrl';

        toast({ text: `Pssst! Try pressing ${metaKey}+K 🤫` });
      }
    }, 6000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey && event.key === 'k') ||
        (event.ctrlKey && event.key === 'k')
      ) {
        event.preventDefault();
        setIsOpen((prev) => !prev);

        if (!hasOpenedBefore) {
          hasOpenedBefore = true;
          localStorage.setItem('cmd_k_opened_before', 'true');
        }
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

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const activeElement = document.activeElement;
    const container = e.currentTarget;

    if (!activeElement) return;

    const focusableElements = Array.from(
      container.querySelectorAll('.focusable-cmd-item'),
    );

    const activeElementIndex = focusableElements.findIndex(
      (el) => el === activeElement,
    );

    // Move focus with arrow keys
    if (e.key === 'ArrowDown') {
      console.log('keydown arrowDown');
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
          onKeyDown={handleKeyDown}
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
            placeholder={`Psst, try typing "dark theme"!`}
            value={query}
            onChange={handleChangeQuery}
            hasResults={actionQueries.length > 0}
          />
          {actionQueries.length > 0 && (
            <ResultBox>
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
              {actionQueries.map((q) => {
                return <Action key={q} query={q} userSubmittedQuery={query} />;
              })}
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
