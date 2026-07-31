import { createContext, useContext } from 'react';

/**
 * The palette used to drive its list by moving real DOM focus onto each
 * result. That is a legitimate pattern, but it costs you the thing a command
 * palette is for: once focus left the input, typing stopped filtering and you
 * had to click back into the field to refine a search.
 *
 * Focus now stays in the input for the whole session and the highlighted row
 * is published with `aria-activedescendant`, which is what Spotlight, Raycast
 * and cmdk all do. Screen readers announce the active option on every arrow
 * press without the caret ever leaving the text field.
 */
export const ActiveOptionContext = createContext<string | null>(null);

export const useIsActiveOption = (id: string) =>
  useContext(ActiveOptionContext) === id;

/** Stable, unique, and valid as an id attribute for aria-activedescendant. */
export const toOptionId = (type: string, value: string) =>
  `cmd-${type}-${value
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()}`;

export const RESULTS_LISTBOX_ID = 'command-palette-results';
