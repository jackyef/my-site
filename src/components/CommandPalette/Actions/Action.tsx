import { ThemeContext } from '@/components/Theme/ThemeProvider';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { HighlightedQuery } from './HighlightedQuery';

interface Props {
  query: string;
  userSubmittedQuery: string;
  description?: string;
  type: 'action' | 'post';
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
  const [theme, setTheme] = useContext(ThemeContext);
  const router = useRouter();

  const getToggleThemeIcon = () => {
    return theme !== 'dark' ? '☀️' : '🌙';
  };

  const isThemeToggleAction = query === 'Toggle dark/light theme';
  const icon = isThemeToggleAction ? getToggleThemeIcon() : '↗️';

  const handleClick = () => {
    if (isThemeToggleAction) {
      setTheme(theme === 'dark' ? 'default' : 'dark');
    } else if (type === 'post') {
      router.push({
        pathname: href,
      });
    }

    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      role="listitem"
      onClick={handleClick}
      style={{
        scrollMarginTop: '3rem',
        scrollMarginBottom: '3rem',
      }}
      className={clsx(
        'focusable-cmd-item', // Used to set focus

        'rounded-sm',
        'last:rounded-b-lg',

        'mx-4',
        'px-4',
        'py-2',
        'text-left',
        'hover:bg-theme-backgroundOffset',
        'focus:bg-theme-backgroundOffset',
        'bg-theme-background',
        'text-theme-text',
        'transition-colors',
        'duration-500',
        'hover:duration-100',
        'focus:duration-100',
      )}
    >
      <div className={clsx('flex', 'justify-between')}>
        <h4 className="font-medium">
          <HighlightedQuery
            query={query}
            userSubmittedQuery={userSubmittedQuery}
          />
        </h4>
        <span>{icon}</span>
      </div>
      {description && (
        <p className={clsx('text-sm', 'text-theme-subtitle', 'mt-2', 'pr-4')}>
          <HighlightedQuery
            query={description}
            userSubmittedQuery={userSubmittedQuery}
          />
        </p>
      )}
    </button>
  );
};
