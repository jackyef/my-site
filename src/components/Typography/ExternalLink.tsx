import clsx from 'clsx';
import { css } from 'goober';
import { useState } from 'react';

import { LinkPreview } from '../LinkPreview';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children?: React.ReactNode;
  previewOnHover?: boolean;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `fancy-anchor`,
  onClick,
  children,
  previewOnHover = true,
}) => {
  const [isShowingPreview, setIsShowingPreview] = useState(false);

  const handleHover = async () => {
    if (!previewOnHover) return;

    setIsShowingPreview(true);
  };

  const handleLeave = () => {
    if (!previewOnHover) return;

    setIsShowingPreview(false);
  };

  return (
    <a
      onMouseOver={handleHover}
      onMouseLeave={handleLeave}
      className={clsx(
        className,
        previewOnHover
          ? css`
              position: relative;
            `
          : '',
      )}
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      {isShowingPreview && <LinkPreview href={href} />}
    </a>
  );
};
