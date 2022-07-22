import { cloneElement, useEffect, useLayoutEffect, useRef } from 'react';

import { getInfo, storeInfo, animate } from './core';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Params = {
  id: string;

  // Not actually part of the lib, just for blog post demo purposes.
  // Feel free to omit this if you are copying the lib
  animateFunction?: typeof animate;
};

export const useFlip = ({ id, animateFunction }: Params) => {
  const nodeRef = useRef<any>(null);

  useIsomorphicLayoutEffect(() => {
    const prevRect = getInfo(id);
    const node = nodeRef?.current as Element;
    const newRect = node?.getBoundingClientRect();
    const newScrollTop = document.documentElement.scrollTop;
    const computedStyle = getComputedStyle(node);

    if (node) {
      // Store latest information for next transition
      // Some of the variable here are reactive (like computedStyle)
      // So, we store the info before animating
      storeInfo(id, {
        domRect: newRect,
        computedStyle,
        documentScrollTop: newScrollTop,
      });
    }

    if (prevRect && node) {
      animateFunction
        ? animateFunction(node, newRect, prevRect)
        : animate(node, newRect, prevRect);
    }
  });

  useIsomorphicLayoutEffect(() => {
    const node = nodeRef?.current as Element;

    return () => {
      // Store the final info before unmounting the previous state
      if (node) {
        const domRect = node.getBoundingClientRect();
        const computedStyle = getComputedStyle(node);
        const scrollTop = document.documentElement.scrollTop;

        storeInfo(id, { domRect, computedStyle, documentScrollTop: scrollTop });
      }
    };
  }, []);

  return nodeRef;
};

interface FlipProps {
  id: string;
  children: JSX.Element;

  // Not actually part of the lib, just for blog post demo purposes.
  // Feel free to omit this if you are copying the lib
  animateFunction?: typeof animate;
}

export const Flip = ({ children, id, animateFunction }: FlipProps) => {
  const nodeRef = useFlip({ id, animateFunction });

  return cloneElement(children, { ref: nodeRef });
};
