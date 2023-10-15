import Image from 'next/image';
import { css, keyframes } from 'goober';

import { cn } from '@/lib/classNames';

import { ExternalLink } from '../Typography/ExternalLink';

import MediumLogo from './assets/medium.svg';

interface Props {
  title: string;
  timeToRead: string;
  coverImage: string;
  url: string;
  isFirst?: boolean;
  index: number;
  totalItems: number;
  scrollTimelineName: string;
}

const MediumPostCard = ({
  title,
  timeToRead,
  coverImage,
  url,
  isFirst,
  index,
  totalItems,
  scrollTimelineName,
}: Props) => {
  const factor = totalItems - index;
  const stepBackAnimation = keyframes`
    from {
      transform: scale(1);
      filter: brightness(100%);
    }
    
    to {
      transform: scale(${1 - (factor / totalItems) * 0.3});
      filter: brightness(calc(100% - calc(${factor - 1} * 5%)));
    }
  `;

  const stickyCardStackCss = css`
    position: sticky;
    left: ${index * 10}px;
    transform-origin: 0% 75%;
    animation-timeline: --${scrollTimelineName};
    animation-name: ${stepBackAnimation};
    animation-duration: 1ms; /* Firefox requires this to apply the animation */
    animation-direction: normal;
  `;

  return (
    <>
      <div
        className={cn(
          stickyCardStackCss,
          'inline-block rounded-md mx-2 mt-4 mb-0 shadow-surface-2',
          'whitespace-normal align-top last:mr-0 md:inline-flex md:flex-col md:self-start md:content-start',
          'max-w-sm scroll-snap-align-start zoom-on-hover-container',
        )}
        style={{
          width: `calc(100% - 1rem * 2)`,
          scrollMargin: isFirst ? `0px 1rem` : undefined,
        }}
      >
        {/* The cover images are hosted on Medium */}
        <img
          loading="lazy"
          src={coverImage}
          alt={title}
          className="w-full h-64 rounded-md object-cover zoom-on-hover"
        />
        <div className="absolute p-4 bottom-0 bg-gradient-to-t from-gray-900 rounded-md w-full max-w-lg h-full flex flex-col justify-end">
          <h3 className="text-lg text-shadow">
            <ExternalLink
              className="text-gray-50 hover:text-gray-200"
              href={url}
              isNotFancy
            >
              {title}
            </ExternalLink>{' '}
          </h3>
          <span className="items-center flex text-xs text-gray-200">
            <Image
              src={MediumLogo}
              alt="medium logo"
              className="w-4 h-4"
              width={16}
              height={16}
            />
            &nbsp;&middot; {timeToRead}
          </span>
        </div>
      </div>
    </>
  );
};

export default MediumPostCard;
