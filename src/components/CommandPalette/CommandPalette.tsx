import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useCallback, useEffect, useState } from 'react';

import { Surface } from '@/components/common/Surface';

import { cn } from '@/utils/styles/classNames';

import { useCommandPaletteContext } from './hooks/useCommandPaletteContext';
import { useNavigationAction } from './hooks/useNavigationAction';
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsOpen]);

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
    const defaultMessage = `Try typing "theme" or "tools"!`;

    return defaultMessage;
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
        <div
          className="backdrop-blur fixed inset-0 animate-fadeIn"
          style={{ background: 'rgba(0, 0, 0, 0.3)', zIndex: 1000 }}
        />
      </Dialog.Overlay>
      <Dialog.Content asChild>
        <Surface
          elevation="lg"
          rounded="lg"
          onKeyDown={handleKeyDown}
          className={cn(
            'p-1.5',
            'animate-fadeIn',
            'transition-colors',
            'duration-500',
            'text-(--color-ink-2)',
            'fixed left-1/2 -translate-x-1/2 w-[90vw] max-w-lg',
          )}
          style={{
            top: '12vh',
            zIndex: 1001,
          }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Command palette</Dialog.Title>
            <Dialog.Description>
              Search for actions, pages, and posts
            </Dialog.Description>
          </VisuallyHidden.Root>
          <SearchInput
            placeholder={getPlaceholderText()}
            value={query}
            autoFocus
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
        </Surface>
      </Dialog.Content>
    </Dialog.Root>
  );
};
