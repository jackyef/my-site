import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';

import { Panel } from '@/components/common/Panel';
import { KanbanBoard } from '@/components/FlipDemos/KanbanBoard';
import { ProfileCard } from '@/components/FlipDemos/ProfileCard';
import { ProfileHero } from '@/components/FlipDemos/ProfileHero';
import { ProfileCardToHero } from '@/components/FlipDemos/ProfileCardToHero';
import { HorizontalDivider } from '@/components/Divider';
import { AudioPlayer, GaplessAudioPlayer } from '@/components/Audio';
import { FunctionRenderer } from '@/components/FunctionRenderer';

import { getPlatformMetaKey } from '@/utils/keyboard';

import { Pre, PreCode } from './components/Pre';
import { Anchor } from './components/Anchor';

const mdxComponents = {
  a: Anchor,
  pre: Pre,
  'pre.code': PreCode,
  Image,
  HorizontalDivider,
  MetaKey: () => {
    return <FunctionRenderer renderer={getPlatformMetaKey} />;
  },

  /* Needed for some posts */
  Panel,
  KanbanBoard,
  ProfileCard,
  ProfileHero,
  ProfileCardToHero,

  AudioPlayer,
  GaplessAudioPlayer,
};

interface Props {
  mdxSource?: MDXRemoteSerializeResult;
}

export const MDXProvider = ({ mdxSource }: Props) => {
  return (
    <MDXRemote
      {...mdxSource}
      // @ts-ignore
      components={mdxComponents}
      // This will initialize custom components lazily, needed to prevent hydration mismatches warnings
      // This is a compromise we have to live with when using next-mdx-remote, as the MDX aren't parsed
      // in the bundler lifecycle, so it cannot resolves the custom components used there.
      lazy
    />
  );
};
