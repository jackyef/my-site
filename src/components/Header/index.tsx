import Image from 'next/image';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { sendEventTracker } from '@/utils/analytics/tracker';
import Link from 'next/link';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { InternalLink } from '../Typography/InternalLink';
import PwaInstallIcon from './assets/icon-plus.svg';
import { useCommandPaletteContext } from '../CommandPalette/hooks/useCommandPaletteContext';

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        className="h-5 inline-block"
        width="20"
        height="20"
        src="/android-icon-96x96.png"
        alt="logo"
      />
      <strong className="ml-2 text-lg text">jackyef.com</strong>
    </div>
  );
}

export default function Header() {
  const { isReady, trigger } = usePwaInstall();
  const { setIsOpen } = useCommandPaletteContext();

  return (
    <header className="flex justify-between items-center py-6">
      <div className="flex space-x-2">
        <Link href="/">
          <a
            aria-label="Jacky Efendi's personal site"
            onClick={() => {
              sendEventTracker({
                name: 'click',
                category: 'header nav',
                label: 'logo',
              });
            }}
          >
            <Logo />
          </a>
        </Link>
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
          className="self-center w-7 h-7 p-1"
          onClick={() => trigger()}
        >
          <Image
            className="monochrome-img"
            src={PwaInstallIcon}
            alt="Add to home screen"
            loading="lazy"
          />
        </button>
      </div>
      <div className="text-base leading-5 flex items-center space-x-2">
        <InternalLink
          href="/blog"
          className="font-medium text-theme-text hover:text-theme-text"
          onClick={() => {
            sendEventTracker({
              name: 'click',
              category: 'header nav',
              label: 'blog',
            });
          }}
        >
          Blog
        </InternalLink>
        <button
          className="font-medium text-theme-text hover:text-theme-text"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <code>/cmd</code>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
