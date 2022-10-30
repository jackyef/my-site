import { useState } from 'react';

import { ProfileCard } from './ProfileCard';
import { ProfileHero } from './ProfileHero';

interface Props {
  id?: string;
  invertOnly?: boolean;
}

export const ProfileCardToHero = ({ id, invertOnly }: Props) => {
  const [state, setState] = useState<0 | 1>(0);

  if (state === 0) {
    return (
      <ProfileCard
        flipId={id as string}
        invertOnly={invertOnly}
        onLinkClick={() => {
          setState(1);
        }}
      />
    );
  }

  if (state === 1) {
    return (
      <ProfileHero
        flipId={id as string}
        invertOnly={invertOnly}
        onBack={() => {
          setState(0);
        }}
      />
    );
  }

  return null;
};
