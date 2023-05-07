import {
  FileTabs,
  useSandpackNavigation,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { css } from 'goober';
import { RowsIcon, ColumnsIcon } from 'lucide-react';

import { useCodePlaygroundContext } from './CodePlayground';
import { theme } from './theme';

export const PlaygroundHeader = () => {
  const { setIsShowingFileExplorer, currentLayout, toggleLayout } =
    useCodePlaygroundContext();
  const { refresh } = useSandpackNavigation();
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
      className={clsx(
        'flex w-full space-between',
        bgCss,
        css`
          border-radius: 0.5rem 0.5rem 0 0 !important;
          overflow: clip;
        `,
      )}
    >
      <div className={clsx('flex flex-1 items-center pl-4')}>
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
        <button
          className={clsx(interactableCss, 'hidden min-[770px]:inline-block')}
          onClick={toggleLayout}
        >
          Switch to {currentLayout === 'horizontal' ? 'vertical' : 'horizontal'}
          {currentLayout === 'horizontal' ? (
            <RowsIcon {...iconProps} />
          ) : (
            <ColumnsIcon {...iconProps} />
          )}
        </button>
        <UnstyledOpenInCodeSandboxButton className={interactableCss}>
          Fork
          <ArrowTopRightOnSquareIcon {...iconProps} />
        </UnstyledOpenInCodeSandboxButton>

        <button className={interactableCss} onClick={() => refresh()}>
          Reload
          <ArrowPathIcon {...iconProps} />
        </button>
      </div>
    </div>
  );
};
