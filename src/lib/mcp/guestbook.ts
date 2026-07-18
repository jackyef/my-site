import { toPlainText } from './sanitize';

/**
 * Ephemeral, in-process guestbook.
 *
 * There is deliberately no database behind this. Entries live in module scope,
 * which means:
 *   - `next dev` runs a single process, so sign -> get works end to end locally.
 *   - On Vercel, each lambda instance has its own copy and it is wiped on cold
 *     start. Two calls can hit different instances and see different entries.
 *
 * That is fine for a learning endpoint. Swap `entries` for a Redis list (or any
 * shared store) to make it durable — the tool layer above does not change.
 */

export type GuestbookEntry = {
  name: string;
  message: string;
  url?: string;
  timestamp: string;
};

const MAX_ENTRIES = 500;

const entries: GuestbookEntry[] = [];

export type SignInput = {
  name: string;
  message: string;
  url?: string;
  timestamp: string;
};

/**
 * Sanitizes and appends an entry. Returns the stored form so the caller can
 * show exactly what was persisted (which may differ from what was submitted,
 * if HTML was stripped).
 */
export function addEntry(input: SignInput): GuestbookEntry {
  const entry: GuestbookEntry = {
    name: toPlainText(input.name),
    message: toPlainText(input.message),
    ...(input.url ? { url: input.url } : {}),
    timestamp: input.timestamp,
  };

  entries.push(entry);

  // Keep the list capped, dropping oldest first.
  if (entries.length > MAX_ENTRIES) {
    entries.splice(0, entries.length - MAX_ENTRIES);
  }

  return entry;
}

/** Most recent entries first. */
export function getEntries(limit: number): GuestbookEntry[] {
  return entries.slice(-limit).reverse();
}

export function getEntryCount(): number {
  return entries.length;
}

/** Test seam — clears the store. */
export function resetGuestbook(): void {
  entries.length = 0;
}
