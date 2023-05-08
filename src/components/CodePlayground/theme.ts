import type { SandpackTheme } from '@codesandbox/sandpack-react';

export const theme: SandpackTheme = {
  colors: {
    surface1: '#0f1620',
    surface2: '#151d27',
    surface3: '#1f2731',
    clickable: '#999999',
    base: '#808080',
    disabled: '#4D4D4D',
    hover: '#C5C5C5',
    accent: '#54b4c1',
    error: '#EEECEB',
    errorSurface: '#E05047',
  },
  syntax: {
    plain: '#fefefe',
    comment: {
      color: '#757575',
      fontStyle: 'italic',
    },
    keyword: '#54b4c1',
    tag: '#d487cb',
    punctuation: '#fefefe',
    definition: '#bbe1e6',
    property: '#54b4c1',
    static: '#b4c153',
    string: '#c153b4',
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: '13px',
    lineHeight: '20px',
  },
};
