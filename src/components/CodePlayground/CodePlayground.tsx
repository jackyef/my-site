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

import { theme } from './theme';
import { PlaygroundHeader } from './PlaygroundHeader';

type CodePlaygroundContextType = {
  isShowingFileExplorer: boolean;
  setIsShowingFileExplorer: Dispatch<SetStateAction<boolean>>;
};

const CodePlaygroundContext = createContext<CodePlaygroundContextType>({
  isShowingFileExplorer: false,
  setIsShowingFileExplorer: () => {},
});

export const useCodePlaygroundContext = () => useContext(CodePlaygroundContext);
export const CodePlayground = () => {
  const [isShowingFileExplorer, setIsShowingFileExplorer] = useState(false);
  const heightCss = css`
    height: 60vh !important;
  `;

  return (
    <CodePlaygroundContext.Provider
      value={{ isShowingFileExplorer, setIsShowingFileExplorer }}
    >
      <div className="isolate shadow-surface-2 rounded-lg xl:-mx-36">
        <SandpackProvider
          template="react"
          theme={theme}
          options={{
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
            className={css`
              border-radius: 0 0 0.5rem 0.5rem !important;
            `}
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
