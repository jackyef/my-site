import { ElementInfo } from '@/lib/flip/core';

export const invert = (
  newNode: Element,
  newRect: DOMRect,
  prevInfo: ElementInfo,
) => {
  const prevCenterX = prevInfo.x + prevInfo.width / 2;
  const prevCenterY = prevInfo.y + prevInfo.scrollTop + prevInfo.height / 2;

  const newCenterX = newRect.left + newRect.width / 2;
  const newCenterY =
    newRect.y + document.documentElement.scrollTop + newRect.height / 2;

  const deltaX = prevCenterX - newCenterX;
  const deltaY = prevCenterY - newCenterY;

  const deltaScaleX = prevInfo.width / newRect.width;
  const deltaScaleY = prevInfo.height / newRect.height;

  // Apply the inverting transformation without playing the animation,
  // For blog post demo purposes
  // @ts-expect-error
  newNode.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaScaleX}, ${deltaScaleY})`;
};
