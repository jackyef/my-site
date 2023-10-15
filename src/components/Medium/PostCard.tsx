import Image from 'next/image';

import { ExternalLink } from '../Typography/ExternalLink';
import { CarouselCardItem } from '../Carousel/CarouselCardItem';

import MediumLogo from './assets/medium.svg';

interface Props {
  title: string;
  timeToRead: string;
  coverImage: string;
  url: string;
  index: number;
  totalItems: number;
  scrollTimelineName?: string;
}

const MediumPostCard = ({
  title,
  timeToRead,
  coverImage,
  url,
  index,
  totalItems,
  scrollTimelineName,
}: Props) => {
  return (
    <>
      <CarouselCardItem
        index={index}
        totalItems={totalItems}
        scrollTimelineName={scrollTimelineName}
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
      </CarouselCardItem>
    </>
  );
};

export default MediumPostCard;
