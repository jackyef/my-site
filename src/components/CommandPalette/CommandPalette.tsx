import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Surface } from '@/components/common/Surface';

import { cn } from '@/utils/styles/classNames';

import { ActiveOptionContext } from './activeOption';
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Radix restores focus to a Dialog.Trigger, and this palette has none — it
  // opens from a global ⌘K listener. Without this the caret landed on <body>
  // after Escape and a keyboard user had to tab in from the top of the page.
  const openerRef = useRef<HTMLElement | null>(null);
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

        setIsOpen((prev) => {
          // Remember where the caret was standing before we take it away.
          if (!prev && document.activeElement instanceof HTMLElement) {
            openerRef.current = document.activeElement;
          }

          return !prev;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsOpen]);

  const getOptions = useCallback(
    () =>
      Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ??
          [],
      ),
    [],
  );

  // A stale highlight is worse than none: every keystroke rebuilds the result
  // list, so the selection resets to the top rather than pointing at a row that
  // has since moved or disappeared.
  //
  // `isOpen` belongs in here even though the body never reads it. The query
  // survives a close, so reopening brings the previous session's rows straight
  // back — and without this dependency the effect never re-ran, leaving
  // activeId pointing at whichever row was selected last rather than resetting
  // to the top the way the paragraph above claims.
  //
  // The frame of delay is the other half of it. Radix wraps Dialog.Content in
  // Presence, which mounts its children a commit later than the open flips, so
  // reading the DOM synchronously here finds zero options and blanks the
  // highlight on a list that is about to render ten rows. Measured: rows=0 at
  // effect time, rows=10 by the next frame.
  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() =>
      setActiveId(getOptions()[0]?.id ?? null),
    );
    return () => cancelAnimationFrame(frame);
  }, [
    isOpen,
    query,
    actionQueries,
    pageSearchResult,
    externalLinkResult,
    postSearchResult,
    getOptions,
  ]);

  const moveActive = (delta: number) => {
    const options = getOptions();
    if (options.length === 0) return;

    const currentIndex = options.findIndex((el) => el.id === activeId);
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + delta + options.length) % options.length;
    const next = options[nextIndex];

    setActiveId(next.id);
    next.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter' && activeId) {
      e.preventDefault();
      getOptions()
        .find((el) => el.id === activeId)
        ?.click();
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
    <ActiveOptionContext.Provider value={activeId}>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal>
        <Dialog.Overlay>
          <div
            className="backdrop-blur fixed inset-0 animate-palette-overlay z-(--z-modal-backdrop)"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          asChild
          onCloseAutoFocus={(event) => {
            const opener = openerRef.current;
            if (!opener?.isConnected) return;

            event.preventDefault();
            opener.focus();
          }}
        >
          <Surface
            ref={contentRef}
            elevation="lg"
            rounded="lg"
            onKeyDown={handleKeyDown}
            className={cn(
              'p-1.5',
              'animate-palette-in',
              'transition-colors',
              'duration-200',
              'text-(--color-ink-2)',
              // Centred with auto margins rather than a -50% translate, so the
              // entrance keyframe owns `transform` outright and cannot fight a
              // layout offset baked into the same property.
              'fixed inset-x-0 mx-auto w-[90vw] max-w-lg',
              'z-(--z-modal)',
            )}
            style={{
              top: '12vh',
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
              activeId={activeId}
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
    </ActiveOptionContext.Provider>
  );
};
