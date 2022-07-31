import * as Tooltip from '@radix-ui/react-tooltip';

import { LinkPreview } from '../LinkPreview';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children?: React.ReactNode;
  shouldShowPreviewOnHover?: boolean;
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className = `fancy-anchor`,
  onClick,
  children,
  shouldShowPreviewOnHover = false,
}) => {
  if (!shouldShowPreviewOnHover) {
    return (
      <a
        className={className}
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <a
            className={className}
            href={href}
            onClick={onClick}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <LinkPreview href={href} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
