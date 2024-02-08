import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';
import { Flipped } from 'react-flip-toolkit';
import dynamic from 'next/dynamic';

import { Panel } from '@/components/common/Panel';
import { HorizontalDivider } from '@/components/Divider';
import { FunctionRenderer } from '@/components/FunctionRenderer';
import { LightButton } from '@/components/common/Button/LightButton';
import { Surfaces, Colors } from '@/components/DesignDemo';
import type { Props as ProfileCardProps } from '@/components/FlipDemos/ProfileCard';
import type { Props as ProfileHeroProps } from '@/components/FlipDemos/ProfileHero';
import type { Props as ProfileCardToHeroProps } from '@/components/FlipDemos/ProfileCardToHero';
import type { Props as AudioPlayerProps } from '@/components/Audio/AudioPlayer';
import type { Props as GaplessAudioPlayerProps } from '@/components/Audio/GaplessAudioPlayer';
import { H1, H2, H3, H4, H5 } from '@/components/Typography/Heading';
import { withTocHighlighter } from '@/components/Blog/Post/hocs/withTocHighlighter';

import { cn } from '@/utils/styles/classNames';
import { getPlatformMetaKey } from '@/utils/keyboard';

import { Pre, PreCode } from './components/Pre';
import { Anchor } from './components/Anchor';

const mdxComponents = {
  a: Anchor,
  pre: Pre,
  'pre.code': PreCode,
  h1: H1,
  h2: withTocHighlighter(H2),
  h3: withTocHighlighter(H3),
  h4: H4,
  h5: H5,
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

  KanbanBoard: dynamic<any>(() =>
    import('@/components/FlipDemos/KanbanBoard').then((m) => m.KanbanBoard),
  ),

  ProfileCard: dynamic<ProfileCardProps>(() =>
    import('@/components/FlipDemos/ProfileCard').then((m) => m.ProfileCard),
  ),
  ProfileHero: dynamic<ProfileHeroProps>(() =>
    import('@/components/FlipDemos/ProfileHero').then((m) => m.ProfileHero),
  ),
  ProfileCardToHero: dynamic<ProfileCardToHeroProps>(() =>
    import('@/components/FlipDemos/ProfileCardToHero').then(
      (m) => m.ProfileCardToHero,
    ),
  ),

  AudioPlayer: dynamic<AudioPlayerProps>(() =>
    import('@/components/Audio').then((m) => m.AudioPlayer),
  ),
  GaplessAudioPlayer: dynamic<GaplessAudioPlayerProps>(() =>
    import('@/components/Audio').then((m) => m.GaplessAudioPlayer),
  ),
};

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export const MDXProvider = ({ mdxSource }: Props) => {
  return (
    <MDXRemote
      {...mdxSource}
      scope={{
        cn,
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
