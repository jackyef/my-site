// Button indices (standard Xbox/PlayStation layout)
export const BUTTON = {
  A: 0, // Cross / A — Select / Confirm
  B: 1, // Circle / B — Back
  X: 2, // Square / X
  Y: 3, // Triangle / Y
  LB: 4, // L1 / LB — Previous section
  RB: 5, // R1 / RB — Next section
  LT: 6, // L2 / LT
  RT: 7, // R2 / RT
  SELECT: 8, // Share / Back
  START: 9, // Options / Menu — Toggle Big Picture
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
} as const;

// Axis indices
export const AXIS = {
  LEFT_X: 0, // Left stick horizontal — navigate left/right
  LEFT_Y: 1, // Left stick vertical — navigate up/down
  RIGHT_X: 2, // Right stick horizontal
  RIGHT_Y: 3, // Right stick vertical — scroll content
} as const;

// Timing
export const DPAD_DEBOUNCE_MS = 150;
export const STICK_THRESHOLD = 0.5;
export const SCROLL_SPEED = 8;

// Ambient glow colors per section
export const SECTION_GLOW_COLORS: Record<string, string> = {
  home: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
  blog: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
  post: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
  about:
    'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
  'absurd-ui':
    'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
};
