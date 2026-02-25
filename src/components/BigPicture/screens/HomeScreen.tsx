import { motion } from 'framer-motion';

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

const rowVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.165, 0.84, 0.44, 1] },
  },
};

export const HomeScreen = () => {
  const { push } = useBigPictureContext();
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className="flex flex-col gap-6 p-6 flex-1 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-lg text-white/50">Select a section to explore</p>
      </div>

      <motion.div
        className="flex flex-row gap-6 flex-1 min-h-0 overflow-x-auto py-5 px-3 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
        variants={prefersReducedMotion ? undefined : rowVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
      >
        {SECTIONS.map((section) => (
          <motion.div
            key={section.id}
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="h-full min-w-[260px] flex-1 max-w-[420px]"
          >
            <SectionTile
              title={section.title}
              description={section.description}
              icon={section.icon}
              accentColor={section.accentColor}
              onClick={() => push({ id: section.id })}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
