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

    // Add any properties we want to animate here
    const computedStyle = getComputedStyle(node);
    const newBackgroundColor = computedStyle.backgroundColor;
    const newColor = computedStyle.color;

    if (prevRect && node) {
      animateFunction
        ? animateFunction(node, newRect, prevRect)
        : animate(node, newRect, prevRect);
    }

    if (node) {
      storeInfo(id, {
        ...newRect.toJSON(),
        scrollTop: document.documentElement.scrollTop,
        backgroundColor: newBackgroundColor,
        color: newColor,
      });
    }
  });

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
