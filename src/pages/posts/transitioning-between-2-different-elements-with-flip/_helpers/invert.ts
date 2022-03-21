import { ElementInfo } from '@/lib/flip/core';

export const invert = (
  newNode: Element,
  newRect: DOMRect,
  prevRect: ElementInfo,
) => {
  const prevCenterX = prevRect.x + prevRect.width / 2;
  const prevCenterY = prevRect.y + prevRect.scrollTop + prevRect.height / 2;

  const newCenterX = newRect.left + newRect.width / 2;
  const newCenterY =
    newRect.top + document.documentElement.scrollTop + newRect.height / 2;

  const deltaX = prevCenterX - newCenterX;
  const deltaY = prevCenterY - newCenterY;

  const deltaScaleX = prevRect.width / newRect.width;
  const deltaScaleY = prevRect.height / newRect.height;

  // Apply the inverting transformation without playing the animation,
  // For blog post demo purposes
  // @ts-expect-error
  newNode.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaScaleX}, ${deltaScaleY})`;
};
