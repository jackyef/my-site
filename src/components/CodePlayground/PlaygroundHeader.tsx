import {
  FileTabs,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react';
import {
  ArrowTopRightOnSquareIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { css } from 'goober';
import {
  RowsIcon,
  ColumnsIcon,
  MaximizeIcon,
  MinimizeIcon,
} from 'lucide-react';

import { cn } from '@/utils/styles/classNames';

import { useCodePlaygroundContext } from './CodePlayground';
import { theme } from './theme';

export const PlaygroundHeader = () => {
  const {
    setIsShowingFileExplorer,
    currentLayout,
    toggleLayout,
    isFullscreen,
    toggleFullscreen,
  } = useCodePlaygroundContext();
  const bgCss = css`
    background-color: rgb(22, 28, 34) !important;
  `;
  const interactableCss = css`
    color: #eee;

    &:hover,
    &:active {
      color: ${theme.colors.hover};
    }
  `;
  const iconProps = {
    className: 'ml-1 inline-block',
    width: 16,
    height: 16,
  };

  return (
    <div
      className={cn(
        'flex w-full space-between',
        bgCss,
        css`
          border-radius: 0.5rem 0.5rem 0 0 !important;
          overflow: clip;
        `,
        {
          [css`
            border-radius: 0 !important;
          `]: isFullscreen,
        },
      )}
    >
      <div className={cn('flex flex-1 items-center pl-4')}>
        <button
          className={interactableCss}
          aria-label="Toggle file explorer inline-flex items-baseline"
          onClick={() => setIsShowingFileExplorer((prev) => !prev)}
        >
          <DocumentMagnifyingGlassIcon {...iconProps} />
        </button>
        <FileTabs className={bgCss} closableTabs />
      </div>

      {/* Actions */}
      <div className="flex flex-1 justify-end items-center gap-4 pr-4">
        {!isFullscreen && (
          <button
            className={cn(interactableCss, 'hidden min-[770px]:inline-block')}
            onClick={toggleLayout}
          >
            Switch to{' '}
            {currentLayout === 'horizontal' ? 'vertical' : 'horizontal'}
            {currentLayout === 'horizontal' ? (
              <RowsIcon {...iconProps} />
            ) : (
              <ColumnsIcon {...iconProps} />
            )}
          </button>
        )}
        <UnstyledOpenInCodeSandboxButton className={interactableCss}>
          Fork
          <ArrowTopRightOnSquareIcon {...iconProps} />
        </UnstyledOpenInCodeSandboxButton>

        <button
          className={cn(interactableCss, 'hidden min-[770px]:inline-block')}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? 'Minimize' : 'Fullscreen'}
          {isFullscreen ? (
            <MinimizeIcon {...iconProps} />
          ) : (
            <MaximizeIcon {...iconProps} />
          )}
        </button>
      </div>
    </div>
  );
};
