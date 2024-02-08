import * as Tooltip from '@radix-ui/react-tooltip';

import { cn } from '@/utils/styles/classNames';

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
        className={cn('not-prose', { [baseClass]: !isNotFancy }, className)}
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noreferrer noopener"
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
            className={cn({ [baseClass]: !isNotFancy }, className)}
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
