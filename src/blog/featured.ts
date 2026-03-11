import type { WritingItem } from "./types";

const FEATURED_TITLES = [
  "1-billion row challenge with Node.js",
  "Web security implications of 3rd party resources",
  "Writing Your Own CSS-in-JS Library",
  "Building 60 FPS QR Scanner for the Mobile Web",
  "Getting Content Painted under 2 seconds on the Mobile Web",
];

export function getFeaturedWritings(allWritings: WritingItem[]): WritingItem[] {
  const featured: WritingItem[] = [];
  featured.unshift(allWritings[0] as WritingItem); // Always include the most recent writing as the first item

  featured[0].isLatest = true; // Mark the most recent writing as the latest

  FEATURED_TITLES.forEach((title) => {
    const writing = allWritings.find((w) => w.title.startsWith(title));

    if (featured[0].title === writing?.title) return; // Skip if the writing is already included as the most recent one

    if (writing) {
      featured.push(writing);
    }
  });

  return featured;
}
