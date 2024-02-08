import { useState } from 'react';

import { cn } from '@/utils/styles/classNames';

import { Container } from './Container';
import { InfoBanner } from './InfoBanner';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ToggleButton } from './ToggleButton';
import { Language, useSpeechRecognition } from './useSpeechRecognition';

export const WebSpeechAPIDemo = () => {
  const [language, setLanguage] = useState<Language>('en-US');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en-US' ? 'id-ID' : 'en-US'));
  };

  const {
    isListening,
    toggleListeningState,
    output,
    interimOutput,
    errorMessage,
    clear,
  } = useSpeechRecognition({ language });

  const hasOutput = Boolean(output.trim());
  const getMessage = () => {
    if (isListening) return 'Start speaking...';
    else if (hasOutput) return 'Click on the button to start again';
    else return 'Click on the button above to get started';
  };

  const hasError = Boolean(errorMessage);

  return (
    <>
      {!hasError && (
        <LanguageSwitcher
          activeLanguage={language}
          onToggle={toggleLanguage}
          disabled={isListening}
        />
      )}

      <Container hasError={hasError}>
        {!hasError && (
          <>
            <div className={cn('flex', 'justify-center', '-mt-20', 'mb-12')}>
              <ToggleButton
                isEnabled={isListening}
                onToggle={toggleListeningState}
              />
            </div>

            <div
              className={cn(
                'flex',
                'justify-center',
                'text-2xl',
                'text-theme-subtitle',
                'mb-16',
                'text-center',
              )}
            >
              {getMessage()}
            </div>

            <span dangerouslySetInnerHTML={{ __html: output }} />
            <span className="opacity-50">{interimOutput}</span>

            {hasOutput && (
              <button
                className={cn(
                  'mt-8',
                  'mx-auto',
                  'block',
                  'text-theme-subtitle',
                  'underline',
                )}
                onClick={clear}
                type="button"
              >
                Clear
              </button>
            )}
          </>
        )}

        {hasError && (
          <div className={cn('flex', 'flex-col', 'space-y-4')}>
            <span>Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </Container>

      <InfoBanner />
    </>
  );
};
