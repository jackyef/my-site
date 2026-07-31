import type { SandpackTheme } from '@codesandbox/sandpack-react';

export const theme: SandpackTheme = {
  colors: {
    surface1: '#0f1620',
    surface2: '#151d27',
    surface3: '#1f2731',
    clickable: '#999999',
    base: '#808080',
    // 2.15:1 on surface1 -> 3.56:1. WCAG exempts inactive controls from the
    // contrast floor, so this is a legibility judgement rather than a fix:
    // at 2.15 the disabled state was closer to invisible than to quiet.
    disabled: '#6E6E6E',
    hover: '#C5C5C5',
    accent: '#54b4c1',
    error: '#EEECEB',
    errorSurface: '#E05047',
  },
  syntax: {
    plain: '#fefefe',
    comment: {
      // 3.94:1 on surface1. Comments are the part of a snippet doing the
      // explaining — the same fix already applied to --code-comment for the
      // blog's build-time blocks, which this editor theme predates.
      color: '#949494',
      fontStyle: 'italic',
    },
    keyword: '#54b4c1',
    tag: '#d487cb',
    punctuation: '#fefefe',
    definition: '#bbe1e6',
    property: '#54b4c1',
    static: '#b4c153',
    // 4.47:1 on surface1 — a rounding-margin miss rather than a dramatic one,
    // but string literals are most of what you read in a snippet.
    string: '#cd6ac0',
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: '13px',
    lineHeight: '20px',
  },
};
