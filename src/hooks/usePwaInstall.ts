import { useState, useRef, useEffect } from 'react';

import { sendEventTracker } from '@/utils/analytics/tracker';
import { canUseDOM } from '@/utils/constants';

interface ChoiceResult {
  outcome: 'accepted' | 'dismissed';
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<ChoiceResult>;
}

let deferredPrompt: BeforeInstallPromptEvent;
let prompted = false;

if (canUseDOM) {
  window.addEventListener('appinstalled', () => {
    sendEventTracker({
      name: 'click',
      category: `pwa`,
      label: 'pwa installed',
    });
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
    prompted = true;

    sendEventTracker({
      name: 'click',
      category: `pwa`,
      label: 'trigger pwa install prompt',
    });

    if (promptRef.current) {
      promptRef.current.prompt();

      promptRef.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          sendEventTracker({
            name: 'click',
            category: `pwa`,
            label: 'pwa install accepted',
          });

          if (typeof onAccepted === 'function') {
            onAccepted();
          }
        } else {
          sendEventTracker({
            name: 'click',
            category: `pwa`,
            label: 'pwa install dismissed',
          });

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

    if (!ready && !prompted) {
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
