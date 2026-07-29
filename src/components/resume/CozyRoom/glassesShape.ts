/**
 * The outline of one lens rim. The real pair is a panto: essentially
 * round, a touch wider than it is tall, with the brow edge flattened just
 * enough to notice and a thin wire rim. Sampled as a smooth closed curve
 * rather than assembled from corners, which is what made the old shape
 * read as angular.
 *
 * Import-free on purpose, so the shape can be previewed on its own.
 */

export const LENS_RADIUS_X = 0.053;
export const LENS_RADIUS_Y = 0.0425;
/** Wire thickness. Thin, but not so thin it aliases away across a room. */
export const LENS_RIM = 0.0055;

const STEPS = 64;

/** How much the brow edge is pulled down, as a fraction of the height. */
const BROW_FLAT = 0.09;

/**
 * How far the outline sits between an ellipse and a rectangle. At 2 it is
 * a plain ellipse, which bows in too much at the left and right; above
 * that the profile fills out toward the edges, so the sides run straighter
 * without ever introducing a corner.
 */
const SQUARENESS = 2.35;

// Polar form of the superellipse. Sampling the usual parametric form
// instead bunches points at the axes, which shows up as a flat chord
// across the top of the rim.
const outlineAt = (radiusX: number, radiusY: number) => {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < STEPS; i++) {
    const angle = (i / STEPS) * Math.PI * 2;
    // Only the top half is flattened, and gently — cubed so the flattening
    // concentrates along the brow
    const flat = 1 - BROW_FLAT * Math.pow(Math.max(0, Math.sin(angle)), 3);
    const radius = Math.pow(
      Math.pow(Math.abs(Math.cos(angle) / radiusX), SQUARENESS) +
        Math.pow(Math.abs(Math.sin(angle) / (radiusY * flat)), SQUARENESS),
      -1 / SQUARENESS,
    );
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  return points;
};

export const lensOutline = () => outlineAt(LENS_RADIUS_X, LENS_RADIUS_Y);

export const lensAperture = () =>
  outlineAt(LENS_RADIUS_X - LENS_RIM, LENS_RADIUS_Y - LENS_RIM);

/**
 * Placement lives here too, because it is what makes the shape work: a
 * lens is flat and the head is a sphere, so a pair sitting square to the
 * face buries its inner edges in the nose. Real glasses wrap — each lens
 * is angled outward and stood off along the surface normal, which clears
 * the face at the nose and lets the outer edge fall back toward the ear.
 */
export const LENS_CENTER: [number, number, number] = [0.0744, 0.013, 0.1696];
export const LENS_YAW = 0.4;

/** A thin bar between the two rims, high on the lens like the real pair. */
export const BRIDGE = { width: 0.062, y: 0.03, z: 0.1875 };

/** From the outer edge of each rim back to the ear. */
export const TEMPLE = {
  position: [0.1431, 0.01, 0.0795] as [number, number, number],
  yaw: 0.278,
  length: 0.145,
};
