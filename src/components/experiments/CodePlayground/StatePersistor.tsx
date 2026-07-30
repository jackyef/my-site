import { useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { useEffect } from 'react';
import * as LZString from 'lz-string';

export const StatePersistor = () => {
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const { code } = useActiveCode();

  useEffect(() => {
    if (activeFile === '/App.tsx') {
      // Update the URL with the current code
      window.location.hash = `#code=${LZString.compressToEncodedURIComponent(
        code,
      )}`;
    }
  }, [code, activeFile]);

  return null;
};
