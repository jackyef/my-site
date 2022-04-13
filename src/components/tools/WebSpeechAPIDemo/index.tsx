import { useState } from 'react';
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

  return (
    <>
      <h3>Speak anything</h3>
      <button onClick={toggleListeningState}>
        {isListening ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={() => {
          setLanguage((prev) => (prev === 'en-US' ? 'id-ID' : 'en-US'));
        }}
      >
        Language: {language}
      </button>

      <div>
        <span dangerouslySetInnerHTML={{ __html: output }} />
        <span className="opacity-75">{interimOutput}</span>
      </div>

      <div>Error: {errorMessage}</div>
    </>
  );
};
