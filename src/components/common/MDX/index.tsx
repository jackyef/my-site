import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';
import { Flipped } from 'react-flip-toolkit';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { Panel } from '@/components/common/Panel';
import { HorizontalDivider } from '@/components/Divider';
import { FunctionRenderer } from '@/components/FunctionRenderer';
import { LightButton } from '@/components/common/Button/LightButton';
import { Surfaces, Colors } from '@/components/DesignDemo';

import { getPlatformMetaKey } from '@/utils/keyboard';

import { Pre, PreCode } from './components/Pre';
import { Anchor } from './components/Anchor';

const mdxComponents = {
  a: Anchor,
  pre: Pre,
  'pre.code': PreCode,
  Image,
  HorizontalDivider,
  Flipped,
  MetaKey: () => {
    return <FunctionRenderer renderer={getPlatformMetaKey} />;
  },

  /* Needed for some posts */
  Panel,
  LightButton,
  Surfaces,
  Colors,

  KanbanBoard: dynamic(() =>
    import('@/components/FlipDemos/KanbanBoard').then((m) => m.KanbanBoard),
  ),
  ProfileCard: dynamic(() =>
    import('@/components/FlipDemos/ProfileCard').then((m) => m.ProfileCard),
  ),
  ProfileHero: dynamic(() =>
    import('@/components/FlipDemos/ProfileHero').then((m) => m.ProfileHero),
  ),
  ProfileCardToHero: dynamic(() =>
    import('@/components/FlipDemos/ProfileCardToHero').then(
      (m) => m.ProfileCardToHero,
    ),
  ),

  AudioPlayer: dynamic(() =>
    import('@/components/Audio').then((m) => m.AudioPlayer),
  ),
  GaplessAudioPlayer: dynamic(() =>
    import('@/components/Audio').then((m) => m.GaplessAudioPlayer),
  ),
};

interface Props {
  mdxSource?: MDXRemoteSerializeResult;
}

export const MDXProvider = ({ mdxSource }: Props) => {
  return (
    <MDXRemote
      {...mdxSource}
      scope={{
        clsx,
      }}
      // @ts-ignore
      components={mdxComponents}
      // This will initialize custom components lazily, needed to prevent hydration mismatches warnings
      // This is a compromise we have to live with when using next-mdx-remote, as the MDX aren't parsed
      // in the bundler lifecycle, so it cannot resolves the custom components used there.
      lazy
    />
  );
};
