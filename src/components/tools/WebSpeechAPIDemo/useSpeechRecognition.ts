import { useEffect, useState } from 'react';

export type Language = 'en-US' | 'id-ID';

const endsWithWhitespace = /\s$/;

type Params = {
  language: Language;
};

export const useSpeechRecognition = ({ language }: Params) => {
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [output, setOutput] = useState('');
  const [interimOutput, setInterimOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleListeningState = () => {
    if (isListening) {
      speechRecognition?.stop();

      return;
    }

    speechRecognition?.start();
    setInterimOutput('');
  };

  const showErrorState = (
    errorType: SpeechRecognitionErrorCode | 'unsupported' | 'unknown',
  ) => {
    if (errorType === 'not-allowed') {
      setErrorMessage(
        'Access to microphone is blocked. Please allow this site to access your microphone for the demo to work.',
      );
    } else if (errorType === 'audio-capture') {
      setErrorMessage(
        'No audio capture device found. Please make sure you have a working microphone connected to the computer and try reloading the page.',
      );
    } else if (errorType === 'unsupported') {
      setErrorMessage(
        'Web Speech API is not supported on your browser. Try using latest version of Chrome for the best experience.',
      );
    } else {
      setErrorMessage(
        'An unexpected error occured. If you could reproduce the issue please open an issue on the Github repo, thanks! Check the console for the logged error event.',
      );
    }
  };

  useEffect(() => {
    if (isListening) {
      setOutput((prev) => {
        if (!endsWithWhitespace.test(prev)) {
          return `${prev} `;
        }

        return prev;
      });
    } else {
      // Clear interim output
      setInterimOutput('');
    }
  }, [isListening]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      showErrorState('unsupported');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      if (!event.results) {
        // Web Speech API not fully supported
        recognition.onend = null;
        recognition.stop();
      }

      const isLastFinal = event.results[event.results.length - 1].isFinal;

      let interimTranscript = '';
      let addedFinalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          addedFinalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setOutput((prev) => {
        if (isLastFinal) {
          return prev + addedFinalTranscript + '<br>';
        }
        return prev + addedFinalTranscript;
      });
      setInterimOutput(interimTranscript);
    };

    recognition.onerror = (event) => {
      const errorType = event.error;

      console.error('[WebSpeechAPIDemo error]', event);

      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent/error
      if (errorType === 'not-allowed') {
        // Permission to use microphone is denied
        // Show a message telling the user
        showErrorState(errorType);
      } else if (errorType === 'audio-capture') {
        // No audio capture device
        // Show a message telling the user
        showErrorState(errorType);
      } else if (errorType === 'no-speech') {
        // No speech was detected
        // Nothing to do here
      } else if (errorType === 'aborted') {
        // Aborted by some specific user-agent mechanism
        // Nothing to do here
      } else if (errorType === 'network') {
        // Failed to communicate with the speech recognition service
        console.error(
          '[WebSpeechAPIDemo]',
          'Failed to communicate with speech recognition service',
        );
      } else {
        // Other errors
        console.error('[WebSpeechAPIDemo error]', event);
        showErrorState('unknown');
      }
    };

    setSpeechRecognition(recognition);

    return () => {
      recognition.onend = null;
      recognition?.stop();
      setSpeechRecognition(null);
    };
  }, [language]);

  return {
    toggleListeningState,
    isListening,
    errorMessage,
    output,
    interimOutput,
  };
};
