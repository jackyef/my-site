import Image from 'next/image';

import { usePwaInstall } from '@/hooks/usePwaInstall';

import PwaInstallIcon from './assets/icon-plus.svg';

export const PwaInstallButton = () => {
  const { isReady, trigger } = usePwaInstall();

  return (
    <button
      style={{
        opacity: isReady ? 1 : 0,
        transform: isReady
          ? 'translateX(0) rotate(0deg)'
          : 'translateX(-1rem) rotate(-270deg)',
        cursor: isReady ? 'auto' : 'none',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
      }}
      tabIndex={isReady ? 0 : -1}
      className="self-center w-7 h-7 p-1 rounded-full"
      onClick={() => trigger()}
    >
      <Image
        className="monochrome-img"
        src={PwaInstallIcon}
        width={20}
        height={20}
        alt="Add to home screen"
        loading="lazy"
      />
    </button>
  );
};
