import { useReduceMotion } from '@/hooks/useReduceMotion';

import { useBigPictureContext } from '../hooks/useBigPictureContext';
import { SectionTile } from '../components/SectionTile';

const SECTIONS = [
  {
    id: 'blog' as const,
    title: 'Blog',
    description:
      'Articles about web development, performance, and curiosities.',
    icon: '📝',
    accentColor: '#06b6d4',
  },
  {
    id: 'about' as const,
    title: 'About',
    description: "Who I am, what I do, and where I've been.",
    icon: '👨‍💻',
    accentColor: '#a855f7',
  },
];

export const HomeScreen = () => {
  const { push } = useBigPictureContext();
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className="flex flex-col gap-8 flex-1 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Welcome</h1>
        <p className="text-white/50">Select a section to explore</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {SECTIONS.map((section) => (
          <SectionTile
            key={section.id}
            title={section.title}
            description={section.description}
            icon={section.icon}
            accentColor={section.accentColor}
            onClick={() => push({ id: section.id })}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
};
