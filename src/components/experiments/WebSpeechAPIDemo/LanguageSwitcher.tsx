import { cn } from '@/utils/styles/classNames';

import { Language } from './useSpeechRecognition';

interface Props {
  activeLanguage: Language;
  onToggle: () => void;
  disabled: boolean;
}

export const LanguageSwitcher = ({
  activeLanguage,
  onToggle,
  disabled,
}: Props) => {
  const base =
    'py-2 px-2.5 w-32 border-2 border-(--color-border) text-(--color-ink-3) transition-all duration-150 disabled:opacity-60';
  const active =
    'font-bold text-(--color-accent-text) bg-(--color-accent-xl) !border-(--color-accent)';

  return (
    <div className="flex justify-center mt-12 mb-24">
      <button
        aria-label={
          activeLanguage === 'en-US'
            ? 'Currently selected language is English (as spoken in the US)'
            : 'Switch language to English (as spoken in the US)'
        }
        className={cn(
          base,
          'rounded-l-lg border-r-0',
          activeLanguage === 'en-US' && [active, '!border-r-2'],
        )}
        onClick={activeLanguage === 'en-US' ? undefined : onToggle}
        disabled={disabled}
      >
        en-US 🇺🇸
      </button>
      <button
        aria-label={
          activeLanguage === 'id-ID'
            ? 'Currently selected language is Indonesian'
            : 'Switch language to Indonesian'
        }
        className={cn(
          base,
          'rounded-r-lg border-l-0',
          activeLanguage === 'id-ID' && [active, '!border-l-2'],
        )}
        onClick={activeLanguage === 'id-ID' ? undefined : onToggle}
        disabled={disabled}
      >
        id-ID 🇮🇩
      </button>
    </div>
  );
};
