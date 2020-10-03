import { canUseDOM } from '@/utils/constants';
import { useState, useRef, useEffect } from 'react';

interface ChoiceResult {
  outcome: 'accepted' | 'dismissed';
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<ChoiceResult>;
}

let deferredPrompt: BeforeInstallPromptEvent;

if (canUseDOM) {
  window.addEventListener('appinstalled', () => {
    // Log install to analytics
    console.log('INSTALL: Success');
  });
}

export const usePwaInstall = () => {
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [ready, setReady] = useState(Boolean(deferredPrompt));
  const triggerInstallPrompt = (
    onAccepted?: () => void,
    onDismissed?: () => void,
  ) => {
    setReady(false);

    if (promptRef.current) {
      promptRef.current.prompt();

      promptRef.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // @TODO: might want to add some analytics here
          console.log('User accepted the install prompt');

          if (typeof onAccepted === 'function') {
            onAccepted();
          }
        } else {
          console.log('User dismissed the install prompt');

          if (typeof onDismissed === 'function') {
            onDismissed();
          }
        }
      });
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      promptRef.current = e as BeforeInstallPromptEvent;
      deferredPrompt = promptRef.current;

      setReady(true);
    };

    if (!ready) {
      window.addEventListener('beforeinstallprompt', handler);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [ready]);

  return {
    isReady: ready,
    trigger: triggerInstallPrompt,
  };
};
