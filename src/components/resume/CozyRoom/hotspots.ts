export type SectionId = 'about' | 'career' | 'projects' | 'writing' | 'contact';

export type ViewId = 'overview' | SectionId;

type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

// Desktop views frame the object together with its in-scene panel
export const CAMERA_VIEWS: Record<ViewId, CameraView> = {
  overview: { position: [7.0, 5.0, 8.6], target: [0.3, 0.85, 0] },
  projects: { position: [1.55, 1.95, -0.1], target: [1.6, 1.5, -3.5] },
  career: { position: [2.2, 2.25, -1.0], target: [2.2, 2.12, -4.1] },
  writing: { position: [-0.3, 1.8, 0.75], target: [-3.75, 1.5, 0.75] },
  about: { position: [1.9, 1.5, 5.8], target: [1.75, 0.78, 1.9] },
  contact: { position: [-0.85, 1.85, 0.9], target: [-0.6, 1.25, -2.45] },
};

// Mobile has no side panel — fly tight onto the object instead
// Targets aim low so the subject sits in the top half of the frame,
// clear of the bottom sheet.
export const CAMERA_VIEWS_MOBILE: Record<ViewId, CameraView> = {
  // A portrait frame is far taller than the room's silhouette, so the
  // phone overview looks down from higher up: the floor opens out, the
  // room reads as a diorama, and the empty bands top and bottom shrink.
  overview: { position: [7.0, 7.9, 8.6], target: [0.3, 0.85, 0] },
  projects: { position: [1.3, 1.8, -0.8], target: [1.3, 0.85, -3.55] },
  career: { position: [3.0, 2.6, 0.35], target: [2.95, 1.75, -4.1] },
  writing: { position: [-0.7, 1.6, 1.5], target: [-3.8, 0.65, 1.5] },
  about: { position: [1.2, 1.45, 5.0], target: [1.2, 0.15, 1.9] },
  contact: { position: [-0.42, 1.7, -0.5], target: [-0.42, 0.75, -2.35] },
};

// Where the camera starts before the intro swoop
export const INTRO_CAMERA_POSITION: [number, number, number] = [15, 11, 18];

// Where the in-scene content panel hangs off each section's object
// (desktop).
//
// `anchor` is a world point on the edge of the object the panel belongs to,
// and the card is laid out beside that point's *projection*, on `side`, with
// a fixed pixel gutter. The card never scales with the scene, so a world-space
// offset of its own is only ever right at one framing: change the viewport's
// aspect and the same offset reads as a card's width of empty room. Anchoring
// to the object and spacing in pixels keeps the gap the size it looks.
//
// `tilt` degrees, via a single-element CSS perspective transform. (A full
// drei `Html transform` matrix chain paints correctly but Chromium hit-tests
// it offset, which made links hover in the wrong place.)
export const PANEL_PLACEMENTS: Record<
  SectionId,
  { anchor: [number, number, number]; side: 'left' | 'right'; tilt: number }
> = {
  // Outer edge of the right-hand monitor
  projects: { anchor: [2.35, 1.62, -3.66], side: 'right', tilt: -14 },
  // Inner edge of the corkboard's frame
  career: { anchor: [1.94, 2.2, -4.1], side: 'left', tilt: 10 },
  // Front-near corner of the bookshelf
  writing: { anchor: [-3.68, 1.3, 0.62], side: 'right', tilt: 12 },
  // Overridden at open time — he is wherever he wandered to
  about: { anchor: [1.2, 1.15, 1.9], side: 'right', tilt: -14 },
  // Left edge of the stack of envelopes
  contact: { anchor: [-0.62, 1.24, -2.32], side: 'left', tilt: 10 },
};

// Pixels between the object's edge and the card, and the least the card
// will keep from the edges of the room's slot before it stops following.
export const PANEL_GUTTER = 20;
export const PANEL_MARGIN = 16;

export type Hotspot = {
  id: SectionId;
  label: string;
  // Anchor for the floating label in the scene
  labelPosition: [number, number, number];
};

export const HOTSPOTS: Hotspot[] = [
  { id: 'projects', label: 'Projects', labelPosition: [1.3, 2.4, -3.6] },
  { id: 'career', label: 'Career', labelPosition: [2.95, 3.15, -4.0] },
  { id: 'writing', label: 'Writing', labelPosition: [-3.65, 2.8, 1.5] },
  { id: 'about', label: 'About me', labelPosition: [1.8, 1.5, 1.2] },
  { id: 'contact', label: 'Contact', labelPosition: [-0.38, 1.7, -2.3] },
];
