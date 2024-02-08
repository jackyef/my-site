import { css } from 'goober';
import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

import { InternalLink } from '../Typography/InternalLink';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ActiveNavIndicator = () => {
  return (
    <Flipped flipId="activeNavIndicator" spring="noWobble" translate scale>
      <div
        className={cn(
          'absolute bottom-0 h-[4px] left-2 right-2',
          'rounded-full',
          css`
            background: ${getHslaColor('secondary', 0.4)};
          `,
        )}
      />
    </Flipped>
  );
};

export const NavLink = ({ children, href, ...props }: Props) => {
  const router = useRouter();
  const isPostPage = router.pathname.startsWith('/posts');
  const isBlogLink = href?.startsWith('/blog');

  return (
    <InternalLink
      href={href || '#'}
      className="rounded-full p-2 relative"
      isNotFancy
      {...props}
    >
      {(router.pathname === href || (isBlogLink && isPostPage)) && (
        <ActiveNavIndicator />
      )}
      {children}
    </InternalLink>
  );
};
