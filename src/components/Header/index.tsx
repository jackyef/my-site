import { sendEventTracker } from '@/utils/analytics/tracker';
import Link from 'next/link';
import { InternalLink } from '../Typography/InternalLink';

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img
        className="h-5 inline-block mr-2"
        width="20"
        height="20"
        src="/monochrome/logo.svg"
        alt="logo"
      />
      <strong className="text-lg text">jackyef.com</strong>
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex justify-between items-center py-6">
      <div>
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
      </div>
      <div className="text-base leading-5">
        <InternalLink
          href="/blog"
          className="font-medium text-gray-900 hover:text-gray-600"
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
      </div>
    </header>
  );
}
