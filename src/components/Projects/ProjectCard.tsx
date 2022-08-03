import { ExternalLink } from '../Typography/ExternalLink';

import { Project } from './projects';

type Props = Project & {
  isFirst?: boolean;
};

export const ProjectCard = ({
  name,
  repo,
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
      </div>
    </>
  );
};
