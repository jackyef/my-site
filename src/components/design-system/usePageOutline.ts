import { useCallback, useEffect, useRef, useState } from 'react';

import { SECTIONS } from './constants';

export interface OutlineEntry {
  id: string;
  label: string;
  /** Sub-anchors discovered inside the section, e.g. the component specs. */
  children: { id: string; label: string }[];
}

const BASE: OutlineEntry[] = SECTIONS.map((s) => ({
  id: s.id,
  label: s.label,
  children: [],
}));

/**
 * The page's navigation model: what is on it, and where the reader is.
 *
 * The sections are known up front, but the component specs inside them are
 * not — so rather than keeping a second list in sync by hand, the outline
 * reads the rendered anchors back out of the DOM. That is the same bargain the
 * rest of the page makes: add a `<Spec>` and it appears in the rail, with no
 * registry to forget to update.
 *
 * Returns the base sections on the server and on first paint, so the rail has
 * its final width before the children arrive and nothing shifts under the
 * cursor.
 */
export function usePageOutline(scopeRef: React.RefObject<HTMLElement | null>) {
  const [outline, setOutline] = useState<OutlineEntry[]>(BASE);
  const [activeId, setActiveId] = useState<string>(BASE[0].id);

  // Set while a click-driven smooth scroll is in flight, so the scroll
  // listener does not fight the destination on the way past.
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    setOutline(
      SECTIONS.map((section) => {
        const el = scope.querySelector(`section#${section.id}`);
        const children = el
          ? Array.from(
              el.querySelectorAll<HTMLElement>('[id^="component-"]'),
            ).map((node) => ({
              id: node.id,
              label: node.querySelector('h3')?.textContent?.trim() ?? node.id,
            }))
          : [];

        return { id: section.id, label: section.label, children };
      }),
    );
  }, [scopeRef]);

  // Scroll spy. The scroll container is ContentArea's <main>, not this page's
  // wrapper, so walk up to it.
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const container = scope.closest('main') ?? scope;

    // Collected once: the page renders its full set of anchors on mount and
    // never adds more. Re-querying per scroll event would walk the DOM
    // continuously for the whole length of a very long page.
    const anchors = Array.from(
      scope.querySelectorAll<HTMLElement>('section[id], [id^="component-"]'),
    );

    let frame: number | null = null;

    const measure = () => {
      frame = null;

      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + containerRect.height * 0.25;

      // Walk every anchor in document order and keep the last one whose top
      // has passed the threshold — sections and their component specs alike,
      // so the rail highlights the individual component you are reading.
      let current = BASE[0].id;
      for (const node of anchors) {
        if (node.getBoundingClientRect().top <= threshold) current = node.id;
      }

      setActiveId(current);
    };

    // Reading getBoundingClientRect for every anchor forces layout, so do it
    // at most once a frame rather than once per scroll event.
    const handleScroll = () => {
      if (isScrollingRef.current || frame !== null) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [scopeRef]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    isScrollingRef.current = true;
    setActiveId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  return { outline, activeId, scrollTo };
}
