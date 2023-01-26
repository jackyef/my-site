import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        className="h-5 inline-block"
        width={20}
        height={20}
        src="/android-icon-96x96.png"
        alt="logo"
      />
      <strong className="hidden ml-2 text sm:inline">jackyef.com</strong>
    </div>
  );
}
