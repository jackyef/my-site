import { ThemeContext } from '@/components/Theme/ThemeProvider';
import clsx from 'clsx';
import { useContext } from 'react';
import { Query } from './actions';

interface Props {
  query: Query;
  userSubmittedQuery: string;
}

const HighlightedQuery = ({ query, userSubmittedQuery }: Props) => {
  const __html = query.replace(
    new RegExp(`(${userSubmittedQuery})`, 'gi'),
    '<span class="font-extrabold">$1</span>',
  );

  return <span dangerouslySetInnerHTML={{ __html }} />;
};

export const Action = ({ query, userSubmittedQuery }: Props) => {
  const [theme, setTheme] = useContext(ThemeContext);

  const getToggleThemeIcon = () => {
    const theme = getComputedStyle(document.body).getPropertyValue('--theme');

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
      className={clsx(
        'px-4',
        'py-2',
        'rounded-lg',
        'w-full',
        'text-left',
        'flex',
        'justify-between',
        'hover:bg-theme-backgroundOffset',
        'focus:bg-theme-backgroundOffset',
        'bg-theme-background',
        'text-theme-text',
        'transition-colors',
        'duration-500',
      )}
    >
      <HighlightedQuery query={query} userSubmittedQuery={userSubmittedQuery} />
      <span>{icon}</span>
    </button>
  );
};
