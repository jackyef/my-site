import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import { getPlatformMetaKey } from '@/utils/keyboard';

import { useCommandPaletteContext } from './hooks/useCommandPaletteContext';
import { useNavigationAction } from './hooks/useNavigationAction';
import { useOnboardingToast } from './hooks/useOnboardingToast';
import { usePostSearch } from './hooks/usePostSearch';
import { useStaticResult } from './hooks/useStaticResult';
import { ResultBox } from './ResultBox';
import { ResultSection } from './ResultSection';
import { SearchInput } from './SearchInput';

export default () => {
  const { isOpen, setIsOpen } = useCommandPaletteContext();
  const [query, setQuery] = useState('');
  const { actionQueries, externalLinkResult, pageSearchResult } =
    useStaticResult({ query });
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
  };

  const getPlaceholderText = () => {
    const defaultMessage = `Try typing "dark theme" or "tools"!`;

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
  const hasExternalLinkResults = externalLinkResult.length > 0;
  const hasResults =
    hasActions || hasPostResults || hasPageResults || hasExternalLinkResults;

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
            'bg-surface-1',
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
            hasResults={hasResults}
          />
          {hasResults && (
            <ResultBox>
              {/* Actions */}
              <ResultSection
                query={query}
                results={actionQueries}
                type="action"
                heading="Actions"
              />

              {/* Pages */}
              <ResultSection
                query={query}
                results={pageSearchResult}
                type="navigation"
                heading="Pages"
                onResultClick={setShouldCloseAfterNavigation}
              />

              {/* External links */}
              <ResultSection
                query={query}
                results={externalLinkResult}
                type="navigation-external"
                heading="External links"
              />

              {/* Posts */}
              <ResultSection
                query={query}
                results={postSearchResult}
                type="navigation"
                heading="Posts"
                onResultClick={setShouldCloseAfterNavigation}
              />
            </ResultBox>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
