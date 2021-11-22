import { toast } from '@/lib/toast';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action } from './Actions/Action';
import { filterValidQueries, Query } from './Actions/actions';
import { usePostSearch } from './hooks/usePostSearch';
import { ResultBox } from './ResultBox';
import { ResultSectionHeading } from './ResultSectionHeading';
import { SearchInput } from './SearchInput';

let hasOpenedBefore = false;
let shouldCloseAfterNavigation = false;

const setShouldCloseAfterNavigation = () => {
  shouldCloseAfterNavigation = true;
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const { data: postSearchResult } = usePostSearch(query);
  const router = useRouter();

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
    rootContainer.style.transformOrigin = 'top center';

    if (isOpen) {
      rootContainer.style.transform = 'scale(0.997)';
    } else {
      rootContainer.style.transform = 'scale(1)';
    }
  });

  useEffect(() => {
    const handleRouteChangeEnd = () => {
      if (shouldCloseAfterNavigation) {
        setIsOpen(false);
        shouldCloseAfterNavigation = false;
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
    };
  }, [router.events]);

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

  const hasActions = actionQueries.length > 0;
  const hasPostResults = postSearchResult.length > 0;

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
            placeholder={`Psst, try typing "dark theme" or "learn"!`}
            value={query}
            onChange={handleChangeQuery}
            hasResults={actionQueries.length > 0}
          />
          {(hasActions || hasPostResults) && (
            <ResultBox>
              {hasActions && (
                <ResultSectionHeading>Actions</ResultSectionHeading>
              )}
              {actionQueries.map((q) => {
                return (
                  <Action
                    key={q}
                    query={q}
                    userSubmittedQuery={query}
                    type="action"
                  />
                );
              })}

              {hasActions && hasPostResults && (
                <div>
                  <div
                    className={clsx(
                      'my-2',
                      'mx-6',
                      'h-[2px]',
                      'w-full',
                      'bg-theme-backgroundOffset',
                      'transition-colors',
                      'duration-500',
                    )}
                  />
                </div>
              )}

              {hasPostResults && (
                <ResultSectionHeading>Posts</ResultSectionHeading>
              )}
              {postSearchResult.map((post) => {
                return (
                  <Action
                    key={post.link}
                    query={post.title}
                    href={post.link}
                    description={post.description}
                    userSubmittedQuery={query}
                    onClick={setShouldCloseAfterNavigation}
                    type="post"
                  />
                );
              })}
            </ResultBox>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
