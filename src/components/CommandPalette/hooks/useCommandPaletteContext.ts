import { useContext } from 'react';

import { CommandPaletteContext } from '../CommandPaletteProvider';

export const useCommandPaletteContext = () => {
  return useContext(CommandPaletteContext);
};
