import { useRouter } from 'next/router';
import { useEffect } from 'react';

let shouldCloseAfterNavigation = false;

const setShouldCloseAfterNavigation = () => {
  shouldCloseAfterNavigation = true;
};

type Props = {
  onCommandPaletteClose: () => void;
};

export const useNavigationAction = ({ onCommandPaletteClose }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeEnd = () => {
      if (shouldCloseAfterNavigation) {
        onCommandPaletteClose();
        shouldCloseAfterNavigation = false;
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
    };
  }, [router.events, onCommandPaletteClose]);

  return {
    setShouldCloseAfterNavigation,
  };
};
