import { useCallback, useEffect, useRef, useState } from 'react';

/** Deterministic hash → float in [min, max] for a given index + seed. */
function seededValue(
  index: number,
  seed: number,
  min: number,
  max: number,
): number {
  let h = index * 2654435761 + seed;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  const t = (h & 0xffff) / 0xffff;
  return +(min + t * (max - min)).toFixed(1);
}

/**
 * Detects when carousel items are at their sticky position (stacked)
 * and applies messy rotations + vertical offsets via CSS custom properties.
 * Cards in their natural position stay flat; cards in the stack get rotated.
 */
export function useMessyStack(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const rafRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback((container: HTMLElement) => {
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const items = container.querySelectorAll<HTMLElement>(
        '[data-carousel-item]',
      );
      const containerLeft = container.getBoundingClientRect().left;

      items.forEach((item, i) => {
        const itemLeft = item.getBoundingClientRect().left - containerLeft;
        const stickyLeft = i * 6;

        const isStacked = itemLeft <= stickyLeft + 10;

        if (isStacked) {
          item.style.setProperty('--r', `${seededValue(i, 3, -3.5, 3.5)}deg`);
          item.style.setProperty('--ty', `${seededValue(i, 4, -5, 5)}px`);
          item.style.setProperty('--z', String(i + 1));
        } else {
          item.style.setProperty('--r', `${seededValue(i, 1, -1.2, 1.2)}deg`);
          item.style.setProperty('--ty', `${seededValue(i, 2, -1.5, 1.5)}px`);
          item.style.setProperty('--z', String(20 + i));
        }
      });

      updateScrollButtons(container);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, updateScrollButtons]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scroll a bit initially to make it apparent that the carousel can be scrolled.
    containerRef.current.scrollBy({ left: 40 });
  }, [containerRef]);

  const scrollLeft = useCallback(() => {
    containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  }, [containerRef]);

  const scrollRight = useCallback(() => {
    containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  }, [containerRef]);

  return { canScrollLeft, canScrollRight, scrollLeft, scrollRight };
}
