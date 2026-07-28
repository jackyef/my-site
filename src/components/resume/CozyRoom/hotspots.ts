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
  overview: CAMERA_VIEWS.overview,
  projects: { position: [1.3, 1.8, -0.8], target: [1.3, 0.85, -3.55] },
  career: { position: [2.95, 2.15, -1.5], target: [2.95, 1.5, -4.1] },
  writing: { position: [-0.7, 1.6, 1.5], target: [-3.8, 0.65, 1.5] },
  about: { position: [1.2, 1.45, 5.0], target: [1.2, 0.15, 1.9] },
  contact: { position: [-0.4, 1.9, -0.3], target: [-0.4, 0.45, -2.35] },
};

// Where the camera starts before the intro swoop
export const INTRO_CAMERA_POSITION: [number, number, number] = [15, 11, 18];

// Where the in-scene content panel anchors for each section (desktop).
// The panel is a screen-space card anchored at `position`, tilted by
// `tilt` degrees via a single-element CSS perspective transform. (A full
// drei `Html transform` matrix chain paints correctly but Chromium
// hit-tests it offset, which made links hover in the wrong place.)
export const PANEL_PLACEMENTS: Record<
  SectionId,
  { position: [number, number, number]; tilt: number }
> = {
  projects: { position: [3.15, 1.6, -2.9], tilt: -14 },
  career: { position: [1.2, 2.1, -3.9], tilt: 10 },
  writing: { position: [-3.5, 1.65, -0.45], tilt: 12 },
  about: { position: [2.75, 1.15, 2.7], tilt: -14 },
  contact: { position: [-1.8, 1.75, -2.35], tilt: 10 },
};

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
