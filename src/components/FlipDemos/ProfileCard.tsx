import { Flip } from '@/lib/flip/react';

type Props = {
  flipId?: string;
  onLinkClick?: () => void;
  invertOnly?: boolean;
};

export const ProfileCard = ({
  flipId,
  onLinkClick,
  invertOnly = false,
}: Props) => {
  const renderWithWrapper = (component: JSX.Element) => {
    if (flipId) {
      return (
        <Flip
          id={flipId as string}
          // Do not animate the inversion, for demo purposes
          animateFunction={invertOnly ? () => {} : undefined}
        >
          {component}
        </Flip>
      );
    }

    return component;
  };

  return (
    <div className="flex justify-start border border-surface-3 rounded-lg p-4 w-[400px] max-w-full gap-3">
      {renderWithWrapper(
        <img
          loading="lazy"
          className="w-[60px] h-[60px] rounded-full m-0"
          width="60px"
          height="60px"
          alt="profile picture"
          src="https://pbs.twimg.com/profile_images/1484537475293118467/0tnyk6wK_400x400.jpg"
        />,
      )}
      <div className="leading-5">
        <a className="font-semibold cursor-pointer" onClick={onLinkClick}>
          Jacky Efendi
        </a>
        <div className="opacity-70 mt-1 mb-2">@jackyef__</div>
        <div>
          Code web-related stuff. I sometimes tweet about tech and career, other
          times about all random thoughts in adulting life.
        </div>
      </div>
    </div>
  );
};
