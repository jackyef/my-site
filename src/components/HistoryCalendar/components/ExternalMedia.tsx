import { css } from 'goober';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/utils/styles/classNames';

type ExternalMediaProps = {
  href: string;
  imgSrc: string;
  title: string;
};

export const ExternalMediaList = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="pt-4">
      <h3 className="text-theme-heading font-bold mb-4">Featured</h3>
      <div className="space-x-2">{children}</div>
    </section>
  );
};

export const ExternalMedia = ({ href, imgSrc, title }: ExternalMediaProps) => {
  return (
    <a
      className="inline-block relative overflow-hidden rounded-lg isolate w-24 aspect-video"
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={cn(
          'absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity',
          'bg-gradient-to-t from-black/50',
          'flex items-center justify-center text-white',
          'hover:duration-200 duration-300 z-20',
          css`
            &:hover + img {
              transform: scale(1.2);
              transition-duration: 200ms;
            }
          `,
        )}
      >
        <ExternalLinkIcon />
      </div>
      <img
        className="z-10 block rounded-lg w-full h-full object-cover transition-transform duration-500"
        src={imgSrc}
        alt={title}
      />
    </a>
  );
};
