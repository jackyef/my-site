import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

import { LinkPreview } from '../LinkPreview';

import { useAnchorClassName } from './hooks/useAnchorClassName';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children?: React.ReactNode;
  shouldShowPreviewOnHover?: boolean;

  isNotFancy?: boolean; // Disables the box-shadow highlight effect on hover/focus
}

export const ExternalLink: React.FC<Props> = ({
  href,
  className,
  onClick,
  children,
  shouldShowPreviewOnHover = false,
  isNotFancy = false,
}) => {
  const baseClass = useAnchorClassName();

  if (!shouldShowPreviewOnHover) {
    return (
      <a
        className={clsx('not-prose', { [baseClass]: !isNotFancy }, className)}
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
        {/* @ts-expect-error */}
        <Tooltip.Trigger asChild>
          <a
            className={clsx({ [baseClass]: !isNotFancy }, className)}
            href={href}
            onClick={onClick}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {/* @ts-expect-error */}
          <Tooltip.Content>
            <LinkPreview href={href} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
