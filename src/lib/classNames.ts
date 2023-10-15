import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: (string | undefined)[]) => {
  return twMerge(clsx(classes));
};
