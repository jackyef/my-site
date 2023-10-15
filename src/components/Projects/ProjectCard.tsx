import { ExternalLink } from '../Typography/ExternalLink';
import { CarouselCardItem } from '../Carousel/CarouselCardItem';

import { Project } from './projects';

type Props = Project & {
  index: number;
  totalItems: number;
  scrollTimelineName: string;
};

export const ProjectCard = ({
  name,
  repo,
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
        <img
          loading="lazy"
          src={coverImage}
          alt={name}
          className="w-full h-52 rounded-md object-cover zoom-on-hover"
        />
        <div className="absolute p-4 bottom-0 bg-gradient-to-t from-gray-900 rounded-md w-full max-w-lg h-full flex flex-col justify-end">
          <h3 className="text-xl text-shadow font-bold">
            <ExternalLink
              className="text-gray-50 hover:text-gray-200"
              href={url}
              isNotFancy
            >
              {name}
            </ExternalLink>{' '}
          </h3>
          <span className="items-center flex text-md text-gray-200">
            {repo ? (
              <ExternalLink
                className="text-gray-50 hover:text-gray-200"
                href={repo}
                isNotFancy
              >
                Repository &rarr;
              </ExternalLink>
            ) : (
              ' '
            )}
          </span>
        </div>
      </CarouselCardItem>
    </>
  );
};
