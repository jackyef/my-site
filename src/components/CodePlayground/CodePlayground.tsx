import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { css } from 'goober';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import clsx from 'clsx';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';

import { useKeyDown } from '@/hooks/useKeyDown';

import { getPlatformMetaKey } from '@/utils/keyboard';

import { theme } from './theme';
import { PlaygroundHeader } from './PlaygroundHeader';
import { defaultIndexSnippet, defaultSnippet } from './snippets';
import { StatePersistor } from './StatePersistor';

const keymap = [...completionKeymap];

type PlaygroundLayout = 'horizontal' | 'vertical';
type CodePlaygroundContextType = {
  isShowingFileExplorer: boolean;
  setIsShowingFileExplorer: Dispatch<SetStateAction<boolean>>;
  currentLayout: PlaygroundLayout;
  toggleLayout: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

const CodePlaygroundContext = createContext<CodePlaygroundContextType>({
  isShowingFileExplorer: false,
  setIsShowingFileExplorer: () => {},
  currentLayout: 'horizontal',
  toggleLayout: () => {},
  isFullscreen: false,
  toggleFullscreen: () => {},
});

export const useCodePlaygroundContext = () => useContext(CodePlaygroundContext);

type Props = {
  initialCode?: string;
};

export const CodePlayground = ({ initialCode }: Props) => {
  const [editorAndPreviewLayout, setEditorAndPreviewLayout] =
    useState<PlaygroundLayout>('horizontal');
  const [isShowingFileExplorer, setIsShowingFileExplorer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const heightCss = css`
    height: 60vh !important;
  `;
  const fullHeightCss = css`
    height: 100vh !important;
  `;

  useKeyDown('Escape', () => setIsFullscreen(false));
  useKeyDown('f', () => setIsFullscreen(true), {
    ctrlKey: getPlatformMetaKey() === 'Ctrl',
    metaKey: getPlatformMetaKey() === 'Cmd',
  });

  return (
    <CodePlaygroundContext.Provider
      value={{
        isShowingFileExplorer,
        setIsShowingFileExplorer,
        currentLayout: editorAndPreviewLayout,
        toggleLayout: () =>
          setEditorAndPreviewLayout((prev) =>
            prev === 'horizontal' ? 'vertical' : 'horizontal',
          ),
        isFullscreen,
        toggleFullscreen: () => {
          setIsFullscreen((prev) => !prev);
          if (!isFullscreen) {
            setEditorAndPreviewLayout('horizontal');
          }
        },
      }}
    >
      <div
        className={clsx('isolate shadow-surface-2 rounded-lg lg:-mx-[7vw]', {
          [css`
            inset: 0;
            position: fixed;
            margin: 0 !important;
            border-radius: 0 !important;
            z-index: 10;
          `]: isFullscreen,
        })}
      >
        <SandpackProvider
          template="react"
          theme={theme}
          files={{
            'App.tsx': initialCode ?? defaultSnippet,
            'index.js': {
              readOnly: true,
              code: defaultIndexSnippet,
            },
          }}
          options={{
            activeFile: 'App.tsx',
            visibleFiles: ['App.tsx'],
            externalResources: ['https://cdn.tailwindcss.com'],
          }}
          customSetup={{
            dependencies: {
              'framer-motion': 'latest',
            },
          }}
        >
          <PlaygroundHeader />
          <SandpackLayout
            className={clsx(
              css`
                border-radius: 0 0 0.5rem 0.5rem !important;
              `,
              {
                block: editorAndPreviewLayout === 'vertical',
                flex: editorAndPreviewLayout === 'horizontal',
              },
            )}
          >
            {isShowingFileExplorer && <SandpackFileExplorer />}
            <SandpackCodeEditor
              className={clsx({
                [fullHeightCss]: isFullscreen,
                [heightCss]: !isFullscreen,
              })}
              extensions={[autocompletion()]}
              extensionsKeymap={keymap}
              showTabs={false}
              showLineNumbers
              showInlineErrors
            />
            <SandpackPreview
              className={clsx({
                [fullHeightCss]: isFullscreen,
                [heightCss]: !isFullscreen,
              })}
              showNavigator={false}
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>

          <StatePersistor />
        </SandpackProvider>
      </div>
    </CodePlaygroundContext.Provider>
  );
};
