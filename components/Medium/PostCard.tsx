import { ExternalLink } from '../Typography/ExternalLink';
import MediumLogo from './assets/medium.svg';

interface Props {
  title: string;
  timeToRead: string;
  coverImage: string;
  url: string;
}

const MediumPostCard = ({ title, timeToRead, coverImage, url }: Props) => {
  return (
    <>
      <div
        className="inline-block relative rounded-md mx-2 mt-4 mb-0 shadow-md whitespace-normal align-top last:mr-0 md:inline-flex md:flex-col md:self-start md:content-start md:w-60 max-w-md"
        style={{
          width: `calc(100% - 1rem * 2)`,
          scrollSnapAlign: 'start',
        }}
      >
        <img
          loading="lazy"
          src={coverImage}
          alt={title}
          className="w-full h-64 rounded-md object-cover"
        />
        <div className="absolute pt-4 bottom-0 bg-gradient-to-t from-gray-900 to-transparent rounded-md w-full max-w-lg">
          <h3 className="p-2 text-lg text-shadow">
            <ExternalLink className="text-gray-50 hover:text-gray-200" href={url}>
              {title}
            </ExternalLink>{' '}
          </h3>
          <span className="items-center flex p-2 pt-0 text-xs text-gray-200">
            <img src={MediumLogo} alt="medium logo" className="w-4 h-4" />
            &nbsp;&middot; {timeToRead}
          </span>
        </div>
      </div>
    </>
  );
};

export default MediumPostCard;
