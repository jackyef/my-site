const varString = <T extends string>(varName: T) => {
  return `var(--${varName})` as const;
};

export const colors = {
  primary: {
    h: varString('h-primary'),
    s: varString('s-primary'),
    l: varString('l-primary'),
  },
  secondary: {
    h: varString('h-secondary'),
    s: varString('s-secondary'),
    l: varString('l-secondary'),
  },
  tertiary: {
    h: varString('h-tertiary'),
    s: varString('s-tertiary'),
    l: varString('l-tertiary'),
  },
  info: {
    h: varString('h-info'),
    s: varString('s-info'),
    l: varString('l-info'),
  },
  warning: {
    h: varString('h-warning'),
    s: varString('s-warning'),
    l: varString('l-warning'),
  },
  bg: {
    h: varString('h-bg'),
    s: varString('s-bg'),
    l: varString('l-bg'),
  },

  // Text-related colors
  text: {
    h: varString('h-text'),
    s: varString('s-text'),
    l: varString('l-text'),
  },
  heading: {
    h: varString('h-heading'),
    s: varString('s-heading'),
    l: varString('l-heading'),
  },
  subtitle: {
    h: varString('h-subtitle'),
    s: varString('s-subtitle'),
    l: varString('l-subtitle'),
  },

  // Other colors
  outline: {
    h: varString('h-outline'),
    s: varString('s-outline'),
    l: varString('l-outline'),
  },
} as const;

export type HSLColor = keyof typeof colors;
