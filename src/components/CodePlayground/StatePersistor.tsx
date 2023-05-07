import { useActiveCode } from '@codesandbox/sandpack-react';
import { useEffect } from 'react';
import * as LZString from 'lz-string';

export const StatePersistor = () => {
  const { code } = useActiveCode();

  useEffect(() => {
    // Update the URL with the current code
    window.location.hash = `#code=${LZString.compressToEncodedURIComponent(
      code,
    )}`;
  }, [code]);

  return null;
};
