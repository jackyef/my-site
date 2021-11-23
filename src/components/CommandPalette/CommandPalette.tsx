import { getPlatformMetaKey } from '@/utils/keyboard';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { PageData } from '../../../types/types';
import { Action } from './Actions/Action';
import { filterValidQueries, Query } from './Actions/actions';
import { filterPages } from './Actions/pages';
import { useCommandPaletteContext } from './hooks/useCommandPaletteContext';
import { useNavigationAction } from './hooks/useNavigationAction';
import { useOnboardingToast } from './hooks/useOnboardingToast';
import { usePostSearch } from './hooks/usePostSearch';
import { ResultBox } from './ResultBox';
import { ResultSectionHeading } from './ResultSectionHeading';
import { SearchInput } from './SearchInput';

export default () => {
  const { isOpen, setIsOpen } = useCommandPaletteContext();
  const [query, setQuery] = useState('');
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const [pageSearchResult, setPageSearchResult] = useState<PageData[]>([]);
  const { data: postSearchResult } = usePostSearch(query);
  const { onFirstTimeOpen, hasOpenedBefore } = useOnboardingToast();

  const closeCommandPalette = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const { setShouldCloseAfterNavigation } = useNavigationAction({
    onCommandPaletteClose: closeCommandPalette,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey && event.key === 'k') ||
        (event.ctrlKey && event.key === 'k')
      ) {
        event.preventDefault();
        setIsOpen((prev) => !prev);

        onFirstTimeOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFirstTimeOpen, setIsOpen]);

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
    setPageSearchResult(value ? filterPages(value) : []);
  };

  const getPlaceholderText = () => {
    const defaultMessage = `Try typing "dark theme" or "learn"!`;

    if (!hasOpenedBefore) {
      return defaultMessage;
    } else {
      const shortcutMessage = `Press ${getPlatformMetaKey()} + K anytime to access this command palette.`;
      return Math.random() > 0.5 ? defaultMessage : shortcutMessage;
    }
  };

  const hasActions = actionQueries.length > 0;
  const hasPostResults = postSearchResult.length > 0;
  const hasPageResults = pageSearchResult.length > 0;

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
            placeholder={getPlaceholderText()}
            value={query}
            onChange={handleChangeQuery}
            hasResults={actionQueries.length > 0}
          />
          {(hasActions || hasPostResults || hasPageResults) && (
            <ResultBox>
              {/* Actions */}
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

              {hasActions && hasPageResults && (
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

              {/* Pages */}
              {hasPageResults && (
                <ResultSectionHeading>Pages</ResultSectionHeading>
              )}
              {pageSearchResult.map((page) => {
                return (
                  <Action
                    key={page.link}
                    query={page.title}
                    href={page.link}
                    description={page.description}
                    userSubmittedQuery={query}
                    onClick={setShouldCloseAfterNavigation}
                    type="navigation"
                  />
                );
              })}

              {hasPageResults && hasPostResults && (
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

              {/* Posts */}
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
                    type="navigation"
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
