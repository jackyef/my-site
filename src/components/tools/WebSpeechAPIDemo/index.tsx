import clsx from 'clsx';
import { css } from 'goober';
import { useState } from 'react';
import { ToggleButton } from './ToggleButton';
import { Language, useSpeechRecognition } from './useSpeechRecognition';

export const WebSpeechAPIDemo = () => {
  const [language, setLanguage] = useState<Language>('en-US');

  const {
    isListening,
    toggleListeningState,
    output,
    interimOutput,
    errorMessage,
  } = useSpeechRecognition({ language });

  const getMessage = () => {
    const hasOutput = Boolean(output.trim());

    if (isListening) return 'Start speaking...';
    else if (hasOutput) return 'Click on the button to start listening again';
    else return 'Click on the button above to get started';
  };

  return (
    <>
      <button
        onClick={() => {
          setLanguage((prev) => (prev === 'en-US' ? 'id-ID' : 'en-US'));
        }}
      >
        Language: {language}
      </button>

      <div
        className={clsx(
          'lg:mx-8',
          'mt-8',
          'mb-16',
          'p-8',
          'rounded-2xl',
          'border-2',
          'border-theme-backgroundOffset',
        )}
      >
        <div className={clsx('flex', 'justify-center', '-mt-20', 'mb-12')}>
          <ToggleButton
            isEnabled={isListening}
            onToggle={toggleListeningState}
          />
        </div>

        <div
          className={clsx(
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
      </div>

      <div>Error: {errorMessage}</div>
    </>
  );
};
