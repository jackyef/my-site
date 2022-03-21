import { Flip } from '@/lib/flip/react';
import clsx from 'clsx';
import { invert } from './invert';

type Props = {
  flipId?: string;
  onBack?: () => void;
  invertOnly?: boolean;
};

export const ProfileHero = ({ flipId, onBack, invertOnly = false }: Props) => {
  const renderWithWrapper = (component: JSX.Element) => {
    if (flipId) {
      return (
        <Flip
          id={flipId as string}
          animateFunction={invertOnly ? invert : undefined}
        >
          {component}
        </Flip>
      );
    }

    return component;
  };

  return (
    <>
      <div
        className={clsx(
          'border',
          'border-theme-backgroundOffset',
          'rounded-lg',
          'max-w-full',
          'w-[720px]',
          'overflow-hidden',
        )}
      >
        <div
          className="w-full h-[200px]"
          style={{
            background: `linear-gradient(
            138deg,
            rgba(103, 27, 163, 1) 0%,
            rgba(33, 0, 62, 1) 18%,
            rgba(0, 0, 0, 1) 52%,
            rgba(0, 32, 168, 1) 91%,
            rgba(91, 134, 255, 1) 99%
          )`,
          }}
        >
          <button
            className={clsx(
              'text-white',
              'inline-block',
              'w-12',
              'h-12',
              'text-2xl',
            )}
            aria-label="Go back"
            onClick={onBack}
          >
            &larr;
          </button>
        </div>
        <div className="p-6">
          {renderWithWrapper(
            <img
              className={clsx(
                'w-[120px]',
                'h-[120px]',
                'rounded-full',
                '-mt-[76px]',
                'mb-3',
              )}
              loading="lazy"
              width="120px"
              height="120px"
              alt="profile picture"
              src="https://pbs.twimg.com/profile_images/1484537475293118467/0tnyk6wK_400x400.jpg"
            />,
          )}
          <div className="leading-5">
            <div className="font-semibold text-lg">Jacky Efendi</div>
            <div className="opacity-70 mb-4 mt-1">@jackyef__</div>
            <div>
              Code web-related stuff. I sometimes tweet about tech and career,
              other times about all random thoughts in adulting life.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
