import Link from 'next/link';

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img className="h-5 inline-block mr-2" src="/monochrome/logo.svg" alt="logo" />
      <strong className="text-lg text">jackyef.com</strong>
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex justify-between items-center py-8">
      <div>
        <Link href="/">
          <a aria-label="Jacky Efendi's personal site">
            <Logo />
          </a>
        </Link>
      </div>
      <div className="text-base leading-5">
        <a
          href="https://tailwindcss.com"
          className="font-medium text-gray-500 hover:text-gray-700"
        >
          Blog &rarr;
        </a>
      </div>
    </header>
  );
}
