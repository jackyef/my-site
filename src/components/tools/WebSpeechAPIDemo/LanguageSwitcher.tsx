import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

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
  const baseButton = css`
    padding: 0.5rem 0.6rem;
    color: ${getHslaColor('text', 0.6)};
    width: 8rem;
    border-style: solid;
    border-color: ${getHslaColor('text', 0.3)};
    border-top-width: 2px;
    border-bottom-width: 2px;
    transition: opacity var(--transition-faster), color var(--transition-faster),
      background-color var(--transition-faster);

    &:first-child {
      border-radius: 0.5rem 0 0 0.5rem;
      border-left-width: 2px;
    }

    &:last-child {
      border-radius: 0 0.5rem 0.5rem 0;
      border-right-width: 2px;
    }

    &[disabled] {
      opacity: 0.6;
    }
  `;

  const activeButton = css`
    color: ${getHslaColor('primary', 1, { l: -12 })};

    [data-theme='dark'] & {
      color: ${getHslaColor('primary')};
    }
    
    background: ${getHslaColor('primary', 0.04)}
    font-weight: 700;

    /* Specificity hack */
    & {
      border-color: ${getHslaColor('primary')};
    }

    &:first-child {
      border-right-width: 2px;
    }

    &:last-child {
      border-left-width: 2px;
    }
  `;

  return (
    <div className={cn('flex', 'justify-center', 'mt-12', 'mb-24')}>
      <button
        aria-label={
          activeLanguage === 'en-US'
            ? 'Currently selected language is English (as spoken in the US)'
            : 'Switch language to English (as spoken in the US)'
        }
        className={cn(baseButton, {
          [activeButton]: activeLanguage === 'en-US',
        })}
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
        className={cn(baseButton, {
          [activeButton]: activeLanguage === 'id-ID',
        })}
        onClick={activeLanguage === 'id-ID' ? undefined : onToggle}
        disabled={disabled}
      >
        id-ID 🇮🇩
      </button>
    </div>
  );
};
