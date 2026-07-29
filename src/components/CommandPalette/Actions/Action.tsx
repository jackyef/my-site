import {
  ArrowUpRightIcon,
  CircleDotIcon,
  MoonIcon,
  SunIcon,
  TypeIcon,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { useFontPairing } from '@/hooks/useFontPairing';
import { useTheme } from '@/hooks/useTheme';

import { cn } from '@/utils/styles/classNames';
import { publicUrl } from '@/utils/constants';

import { FONT_QUERIES_MAP } from '../constants/actions';

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
  const { setPairing } = useFontPairing();
  const router = useRouter();

  const isEnablingDarkTheme = query === 'Enable dark theme';
  const isEnablingDimTheme = query === 'Enable dim theme';
  const isEnablingLightTheme = query === 'Enable light theme';
  const isThemeToggleAction =
    isEnablingDarkTheme || isEnablingDimTheme || isEnablingLightTheme;
  const isShareArticleAction = query === 'Share this article';
  const fontPairingId = FONT_QUERIES_MAP[query];

  const icon = isEnablingLightTheme ? (
    <SunIcon size={14} aria-hidden="true" />
  ) : isEnablingDimTheme ? (
    <MoonIcon size={14} aria-hidden="true" />
  ) : isEnablingDarkTheme ? (
    <CircleDotIcon size={14} aria-hidden="true" />
  ) : fontPairingId ? (
    <TypeIcon size={14} aria-hidden="true" />
  ) : (
    <ArrowUpRightIcon size={14} aria-hidden="true" />
  );

  const handleClick = () => {
    if (fontPairingId) {
      setPairing(fontPairingId);
    } else if (isThemeToggleAction) {
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
      role="option"
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
