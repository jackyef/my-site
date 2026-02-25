import { useContext } from 'react';

import { BigPictureContext } from '../BigPictureProvider';

export const useBigPictureContext = () => {
  return useContext(BigPictureContext);
};
