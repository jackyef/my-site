# Adding theme

New themes can be added by adding a new CSS declaration block in the `theme.css`
file.

```css
[data-theme='name-of-theme'] {
  /* prettier-ignore */
  --theme:name-of-theme;

  /* Put the rest of the CSS vars here, use the default/dark theme as reference */
}
```

Once that is done, add the theme to the `ThemeProvider` so it can be picked in
the `ThemePicker`.

```ts
export const THEMES = [
  'default',
  'dark',
  'cobalt',
  'purple-and-gold',
  'name-of-theme',
] as const;
```
