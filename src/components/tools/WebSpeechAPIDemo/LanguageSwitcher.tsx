import clsx from 'clsx';
import { css } from 'goober';
import { Language } from './useSpeechRecognition';

interface Props {
  activeLanguage: Language;
  onToggle: () => void;
}

export const LanguageSwitcher = ({ activeLanguage, onToggle }: Props) => {
  const baseButton = css`
    padding: 0.5rem 0.8rem;
    width: 8rem;
    border-style: solid;
    border-color: rgba(var(--rgb-text), 0.3);
    border-top-width: 2px;
    border-bottom-width: 2px;

    &:first-child {
      border-radius: 0.5rem 0 0 0.5rem;
      border-left-width: 2px;
    }

    &:last-child {
      border-radius: 0 0.5rem 0.5rem 0;
      border-right-width: 2px;
    }
  `;

  const activeButton = css`
    color: rgb(var(--rgb-link));
    background-color: rgba(var(--rgb-primary), 0.1);
    font-weight: 700;

    /* Specificity hack */
    & {
      border-color: rgb(var(--rgb-link));
    }

    &:first-child {
      border-right-width: 2px;
    }

    &:last-child {
      border-left-width: 2px;
    }
  `;

  return (
    <div className={clsx('flex', 'justify-center', 'mb-24')}>
      <button
        aria-label={
          activeLanguage === 'en-US'
            ? 'Currently selected language is English (as spoken in the US)'
            : 'Switch language to English (as spoken in the US)'
        }
        className={clsx(baseButton, {
          [activeButton]: activeLanguage === 'en-US',
        })}
        onClick={activeLanguage === 'en-US' ? undefined : onToggle}
      >
        en-US 🇺🇸
      </button>
      <button
        aria-label={
          activeLanguage === 'id-ID'
            ? 'Currently selected language is Indonesian'
            : 'Switch language to Indonesian'
        }
        className={clsx(baseButton, {
          [activeButton]: activeLanguage === 'id-ID',
        })}
        onClick={activeLanguage === 'id-ID' ? undefined : onToggle}
      >
        id-ID 🇮🇩
      </button>
    </div>
  );
};
