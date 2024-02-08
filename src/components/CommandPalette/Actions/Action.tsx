import { useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';

import { ThemeContext } from '@/components/Theme/ThemeProvider';

import { cn } from '@/utils/styles/classNames';
import { publicUrl } from '@/utils/constants';

import { HighlightedQuery } from './HighlightedQuery';

interface Props {
  query: string;
  userSubmittedQuery: string;
  description?: string;
  type: 'action' | 'navigation' | 'navigation-external';
  href?: string;
  onClick?: () => void;
}

export const Action = ({
  query,
  userSubmittedQuery,
  type,
  href,
  description,
  onClick,
}: Props) => {
  const actionElementRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useContext(ThemeContext);
  const router = useRouter();

  const getToggleThemeIcon = () => {
    return theme !== 'dark' ? '☀️' : '🌙';
  };

  const isThemeToggleAction = query === 'Toggle dark/light theme';
  const isShareArticleAction = query === 'Share this article';
  const icon = isThemeToggleAction ? getToggleThemeIcon() : '↗️';

  const handleClick = () => {
    if (isThemeToggleAction) {
      setTheme(theme === 'dark' ? 'default' : 'dark');
    } else if (isShareArticleAction) {
      const text = `${document.title} ${publicUrl}${router.pathname} via @jackyef__`;

      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        '_blank',
      );
    } else if (type === 'navigation') {
      router.push({
        pathname: href,
      });
    } else if (type === 'navigation-external') {
      window.open(href, '_blank');
    }

    if (typeof onClick === 'function') {
      onClick();
    }
  };

  /**
   * This effect handle prefetching routes when the button is focused.
   * We can't use react `onFocus` because we are triggering focus on
   * elements with `focusable-cmd-item` class manually.
   */
  useEffect(() => {
    if (type !== 'navigation' || !href) return;

    const element = actionElementRef.current;
    const handlePrefetch = () => {
      router.prefetch(href);
    };

    if (element) {
      element.addEventListener('focus', handlePrefetch);
      element.addEventListener('hover', handlePrefetch);
    }

    return () => {
      if (element) {
        element.removeEventListener('focus', handlePrefetch);
        element.removeEventListener('hover', handlePrefetch);
      }
    };
  }, [href, router, type]);

  return (
    <button
      ref={actionElementRef}
      role="listitem"
      onClick={handleClick}
      style={{
        scrollMarginTop: '3rem',
        scrollMarginBottom: '3rem',
      }}
      className={cn(
        'focusable-cmd-item', // Used to set focus

        'rounded-sm',
        'last:rounded-b-lg', // TODO: Change this with last-of-type when we upgrade tailwind

        'mx-4',
        'px-4',
        'py-2',
        'text-left',
        'hover:bg-surface-3',
        'focus:bg-surface-3',
        'bg-surface-1',
        'text-theme-text',
        'transition-colors',
        'duration-500',
        'hover:duration-100',
        'focus:duration-100',
      )}
    >
      <div className={cn('flex', 'justify-between')}>
        <h4 className="font-medium">
          <HighlightedQuery
            query={query}
            userSubmittedQuery={userSubmittedQuery}
          />
        </h4>
        <span aria-hidden>{icon}</span>
      </div>
      {description && (
        <p className={cn('text-sm', 'text-theme-subtitle', 'mt-2', 'pr-4')}>
          <HighlightedQuery
            query={description}
            userSubmittedQuery={userSubmittedQuery}
          />
        </p>
      )}
    </button>
  );
};
