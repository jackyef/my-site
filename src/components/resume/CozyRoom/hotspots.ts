export type SectionId = 'about' | 'career' | 'projects' | 'writing' | 'contact';

export type ViewId = 'overview' | SectionId;

type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

export const CAMERA_VIEWS: Record<ViewId, CameraView> = {
  overview: { position: [6.4, 4.7, 7.8], target: [0.2, 1.0, 0] },
  projects: { position: [0.6, 1.85, 0.2], target: [0.6, 1.62, -3.0] },
  career: { position: [2.2, 2.1, -0.7], target: [2.2, 2.1, -3.4] },
  writing: { position: [-0.1, 1.7, 1.6], target: [-3.1, 1.3, 1.6] },
  about: { position: [1.4, 2.1, 2.9], target: [1.3, 0.3, 0.5] },
  contact: { position: [-0.5, 2.0, -0.7], target: [-0.5, 1.1, -2.6] },
};

// Where the camera starts before the intro swoop
export const INTRO_CAMERA_POSITION: [number, number, number] = [13, 10, 16];

export type Hotspot = {
  id: SectionId;
  label: string;
  // Anchor for the floating label in the scene
  labelPosition: [number, number, number];
};

export const HOTSPOTS: Hotspot[] = [
  { id: 'projects', label: 'Projects', labelPosition: [0.6, 2.35, -3.0] },
  { id: 'career', label: 'Career', labelPosition: [2.2, 2.95, -3.3] },
  { id: 'writing', label: 'Writing', labelPosition: [-3.0, 2.75, 1.6] },
  { id: 'about', label: 'About me', labelPosition: [1.35, 0.95, 0.5] },
  { id: 'contact', label: 'Contact', labelPosition: [-0.5, 1.75, -2.6] },
];
