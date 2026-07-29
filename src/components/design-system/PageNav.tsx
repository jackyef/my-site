import { motion } from 'motion/react';
import { useId } from 'react';

import { SectionLabel } from '@/components/common/SectionLabel';

import { cn } from '@/utils/styles/classNames';

import type { OutlineEntry } from './usePageOutline';

interface Props {
  outline: OutlineEntry[];
  activeId: string;
  onNavigate: (id: string) => void;
}

/**
 * "On this page" rail, matching the one beside blog posts — same 224px width,
 * same sliding accent indicator, same muted-until-active type. The page is
 * long enough that the sticky tab strip alone leaves you scrolling to find a
 * single component.
 */
export function PageNav({ outline, activeId, onNavigate }: Props) {
  const labelId = useId();
  const indicatorId = useId();

  const item = ({ id, label }: { id: string; label: string }, depth: 0 | 1) => {
    const isActive = activeId === id;

    return (
      <li
        key={id}
        className={cn('relative', depth === 1 ? 'pl-5' : 'pl-[10px]')}
      >
        {isActive && (
          <motion.div
            layoutId={indicatorId}
            className="absolute left-0 top-[2px] bottom-[2px] w-[2px] rounded-sm bg-(--color-accent)"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <a
          href={`#${id}`}
          onClick={(event) => {
            // Let modified clicks open a real link; otherwise scroll smoothly
            // without pushing a hash the reader has to back out of.
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onNavigate(id);
          }}
          aria-current={isActive ? 'true' : undefined}
          className={cn(
            'block py-1 no-underline leading-[1.4]',
            'transition-[color,transform] duration-150',
            depth === 1 ? 'text-[12px]' : 'text-[13px]',
            'hover:text-(--color-ink-3)',
            isActive
              ? 'font-bold text-(--color-ink-2) translate-x-0.5'
              : 'font-normal text-(--color-ink-4)',
          )}
        >
          {label}
        </a>
      </li>
    );
  };

  return (
    <nav aria-labelledby={labelId} className="overflow-x-clip">
      <SectionLabel id={labelId} className="mb-3">
        On this page
      </SectionLabel>

      <ol className="list-none p-0 m-0">
        {outline.map((entry) => (
          <li key={entry.id} className="list-none">
            <ol className="list-none p-0 m-0">
              {item(entry, 0)}
              {entry.children.map((child) => item(child, 1))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
