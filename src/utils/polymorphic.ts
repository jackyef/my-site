import type { ElementType, FC, ReactNode } from 'react';

/**
 * Loosely-typed stand-in for rendering a polymorphic `as` prop with JSX.
 *
 * When a library augments React's global JSX.IntrinsicElements with entries
 * that conflict with the DOM ones (e.g. @react-three/fiber's three.js
 * elements, where `id` is a number), rendering a bare `React.ElementType`
 * makes TypeScript intersect the props of every possible element, which
 * collapses to `never`. Casting through this alias keeps polymorphic
 * primitives compiling while preserving their public API and runtime
 * behavior.
 */
export type LooseComponent = FC<
  Record<string, unknown> & { children?: ReactNode }
>;

export const asLooseComponent = (as: ElementType): LooseComponent =>
  as as LooseComponent;
