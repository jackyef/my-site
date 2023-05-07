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

import { theme } from './theme';
import { PlaygroundHeader } from './PlaygroundHeader';
import { defaultIndexSnippet, defaultSnippet } from './snippets';

type PlaygroundLayout = 'horizontal' | 'vertical';
type CodePlaygroundContextType = {
  isShowingFileExplorer: boolean;
  setIsShowingFileExplorer: Dispatch<SetStateAction<boolean>>;
  currentLayout: PlaygroundLayout;
  toggleLayout: () => void;
};

const CodePlaygroundContext = createContext<CodePlaygroundContextType>({
  isShowingFileExplorer: false,
  setIsShowingFileExplorer: () => {},
  currentLayout: 'horizontal',
  toggleLayout: () => {},
});

export const useCodePlaygroundContext = () => useContext(CodePlaygroundContext);
export const CodePlayground = () => {
  const [editorAndPreviewLayout, setEditorAndPreviewLayout] =
    useState<PlaygroundLayout>('horizontal');
  const [isShowingFileExplorer, setIsShowingFileExplorer] = useState(false);
  const heightCss = css`
    height: 60vh !important;
  `;

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
      }}
    >
      <div className="isolate shadow-surface-2 rounded-lg lg:-mx-[7vw]">
        <SandpackProvider
          template="react"
          theme={theme}
          files={{
            'App.tsx': defaultSnippet,
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
              className={heightCss}
              showLineNumbers
              showInlineErrors
            />
            <SandpackPreview
              className={heightCss}
              showNavigator={false}
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </CodePlaygroundContext.Provider>
  );
};
