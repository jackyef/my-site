import { ThemeContext } from '@/components/Theme/ThemeProvider';
import clsx from 'clsx';
import { useContext } from 'react';
import { Query } from './actions';

interface Props {
  query: Query;
  userSubmittedQuery: string;
}

const HighlightedQuery = ({ query, userSubmittedQuery }: Props) => {
  const words = userSubmittedQuery.split(' ').join('|');

  const __html = query.replace(
    new RegExp(`(${words})`, 'gi'),
    '<span class="font-extrabold">$1</span>',
  );

  return <span dangerouslySetInnerHTML={{ __html }} />;
};

export const Action = ({ query, userSubmittedQuery }: Props) => {
  const [theme, setTheme] = useContext(ThemeContext);

  const getToggleThemeIcon = () => {
    return theme !== 'dark' ? '☀️' : '🌙';
  };

  const isThemeToggleAction = query === 'Toggle dark/light theme';
  const icon = isThemeToggleAction ? getToggleThemeIcon() : '';

  const handleClick = () => {
    if (isThemeToggleAction) {
      setTheme(theme === 'dark' ? 'default' : 'dark');
    } else {
      // no-op for now
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
        'flex',
        'justify-between',
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
      <HighlightedQuery query={query} userSubmittedQuery={userSubmittedQuery} />
      <span>{icon}</span>
    </button>
  );
};
