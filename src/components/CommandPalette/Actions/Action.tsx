import { ArrowUpRight, CircleDot, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { useTheme } from '@/hooks/useTheme';

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
  const { setTheme } = useTheme();
  const router = useRouter();

  const isEnablingDarkTheme = query === 'Enable dark theme';
  const isEnablingDimTheme = query === 'Enable dim theme';
  const isEnablingLightTheme = query === 'Enable light theme';
  const isThemeToggleAction =
    isEnablingDarkTheme || isEnablingDimTheme || isEnablingLightTheme;
  const isShareArticleAction = query === 'Share this article';

  const icon = isEnablingLightTheme ? (
    <Sun size={14} aria-hidden="true" />
  ) : isEnablingDimTheme ? (
    <Moon size={14} aria-hidden="true" />
  ) : isEnablingDarkTheme ? (
    <CircleDot size={14} aria-hidden="true" />
  ) : (
    <ArrowUpRight size={14} aria-hidden="true" />
  );

  const handleClick = () => {
    if (isThemeToggleAction) {
      if (isEnablingDarkTheme) {
        setTheme('dark');
      } else if (isEnablingDimTheme) {
        setTheme('dim');
      } else if (isEnablingLightTheme) {
        setTheme('light');
      }
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
        scrollMarginTop: '2rem',
        scrollMarginBottom: '2rem',
      }}
      className={cn(
        'focusable-cmd-item',
        'rounded-md',
        'mx-1.5',
        'px-3',
        'py-1.5',
        'text-left',
        'text-sm',
        'hover:bg-(--color-bg-hover)',
        'focus:bg-(--color-bg-hover)',
        'text-(--color-ink-2)',
        'transition-colors',
        'duration-150',
        'outline-none',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-(--color-ink) truncate">
          <HighlightedQuery
            query={query}
            userSubmittedQuery={userSubmittedQuery}
          />
        </span>
        <span className="text-(--color-ink-4) shrink-0">{icon}</span>
      </div>
      {description && (
        <p className="text-xs text-(--color-ink-3) mt-0.5 truncate">
          <HighlightedQuery
            query={description}
            userSubmittedQuery={userSubmittedQuery}
          />
        </p>
      )}
    </button>
  );
};
