import Image from 'next/image';

import { ExternalLink } from '../Typography/ExternalLink';
import MediumLogo from './assets/medium.svg';

interface Props {
  title: string;
  timeToRead: string;
  coverImage: string;
  url: string;
  isFirst?: boolean;
}

const MediumPostCard = ({
  title,
  timeToRead,
  coverImage,
  url,
  isFirst,
}: Props) => {
  return (
    <>
      <div
        className="inline-block relative rounded-md mx-2 mt-4 mb-0 shadow-md whitespace-normal align-top last:mr-0 md:inline-flex md:flex-col md:self-start md:content-start max-w-sm scroll-snap-align-start zoom-on-hover-container"
        style={{
          width: `calc(100% - 1rem * 2)`,
          scrollMargin: isFirst ? `0px 1rem` : undefined,
        }}
      >
        {/* The cover images are hosted on Medium */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
            >
              {title}
            </ExternalLink>{' '}
          </h3>
          <span className="items-center flex text-xs text-gray-200">
            <Image
              src={MediumLogo}
              alt="medium logo"
              className="w-4 h-4"
              width="16px"
              height="16px"
            />
            &nbsp;&middot; {timeToRead}
          </span>
        </div>
      </div>
    </>
  );
};

export default MediumPostCard;
