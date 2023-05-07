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

import { useCodePlaygroundContext } from './CodePlayground';
import { theme } from './theme';

export const PlaygroundHeader = () => {
  const { setIsShowingFileExplorer } = useCodePlaygroundContext();
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
          <DocumentMagnifyingGlassIcon width={16} height={16} />
        </button>
        <FileTabs className={bgCss} />
      </div>

      {/* Actions */}
      <div className="flex flex-1 justify-end items-center gap-2 pr-4">
        <UnstyledOpenInCodeSandboxButton className={interactableCss}>
          Fork
          <ArrowTopRightOnSquareIcon
            className="ml-1 inline-block"
            width={16}
            height={16}
          />
        </UnstyledOpenInCodeSandboxButton>

        <button className={interactableCss} onClick={() => refresh()}>
          Reload
          <ArrowPathIcon className="ml-1 inline-block" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};
