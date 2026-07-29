/**
 * The avatar's hair, as one continuous shell rather than a pile of
 * intersecting boxes — those read as lumps, and the seams between them
 * catch the light. A grid is swept around the skull; its lower edge
 * follows the hairline and tucks under the scalp, so the silhouette ends
 * on the head instead of on a lip of geometry.
 *
 * Deliberately free of imports: it returns plain arrays, so the shape can
 * be previewed on its own without dragging the scene in behind it.
 */

export const HEAD_RADIUS = 0.17;

// Azimuth of the part, measured from straight ahead. Negative turns
// toward his right; the sweep falls across the other way.
const PART_AZIMUTH = -0.36;

const RINGS = 26;
const SEGMENTS = 88;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const gaussian = (x: number, center: number, width: number) =>
  Math.exp(-Math.pow((x - center) / width, 2));

/**
 * Where the hairline sits, as a polar angle down from the crown, sampled
 * by azimuth (0 = straight ahead). It climbs at the part, dips again as
 * the fringe sweeps across the brow, and runs long over the sides and
 * nape, where the fade turns it into a taper.
 */
const HAIRLINE: Array<[number, number]> = [
  [-Math.PI, 1.96],
  [-2.45, 1.86],
  [-2.0, 1.7],
  [-1.57, 1.42],
  [-1.15, 1.44],
  [-0.8, 1.26],
  [-0.55, 1.04],
  [-0.36, 0.9],
  [-0.05, 0.99],
  [0.35, 1.12],
  [0.8, 1.34],
  [1.15, 1.46],
  [1.57, 1.42],
  [2.0, 1.7],
  [2.45, 1.86],
  [Math.PI, 1.96],
];

// Cubic Hermite through the control points, with Catmull-Rom tangents.
// Interpolating with smoothstep instead flattens the curve at every knot,
// which scallops the hairline into sixteen little plateaus.
const hairlineAt = (azimuth: number) => {
  let i = 1;
  while (i < HAIRLINE.length - 1 && azimuth > HAIRLINE[i][0]) i++;
  const [a0, v0] = HAIRLINE[i - 1];
  const [a1, v1] = HAIRLINE[i];
  const before = HAIRLINE[Math.max(0, i - 2)];
  const after = HAIRLINE[Math.min(HAIRLINE.length - 1, i + 1)];

  const span = a1 - a0;
  const m0 = ((v1 - before[1]) / (a1 - before[0])) * span;
  const m1 = ((after[1] - v0) / (after[0] - a0)) * span;
  const t = clamp01((azimuth - a0) / span);
  const t2 = t * t;
  const t3 = t2 * t;

  return (
    (2 * t3 - 3 * t2 + 1) * v0 +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * v1 +
    (t3 - t2) * m1
  );
};

/**
 * How the hair sits away from the scalp. The front and the sides want
 * opposite treatments: a fringe is blunt and overhangs the brow, while
 * the sides and nape taper away to nothing. Carrying full thickness all
 * the way round instead leaves a flange that catches the light, and
 * tapering the fringe as well leaves it glued to the skull.
 */
const hairLift = (azimuth: number, t: number) => {
  const frontness = smoothstep(1.3, 0.45, Math.abs(azimuth));
  const taperHem = smoothstep(1, 0.84, t);
  const fringeHem = 1 - 0.42 * smoothstep(0.84, 1, t);
  const hem = taperHem + (fringeHem - taperHem) * frontness;

  // Rises away from the crown and settles before the hem. It has to fall
  // to nothing at t=0: the crown is a single vertex at a fixed radius, so
  // any volume left in the ring around it shows up as a dimple.
  const sweep =
    gaussian(azimuth, 0.4, 0.8) *
    smoothstep(0.06, 0.36, t) *
    smoothstep(0.98, 0.6, t);
  // The fringe stands a little proud of the forehead
  const overhang = 0.007 * frontness * smoothstep(0.45, 0.95, t);
  return (0.012 + 0.017 * sweep + overhang) * hem;
};

export type HairSurface = {
  positions: Float32Array;
  index: Uint32Array;
  /** 0 = hair, 1 = skin. Fades the sides and nape into a taper. */
  fade: Float32Array;
  /** Brightness multiplier — darkens the crease along the part. */
  shade: Float32Array;
};

export function buildHairSurface(): HairSurface {
  // The crown comes first, then one ring of vertices per row
  const positions: number[] = [0, HEAD_RADIUS + 0.012, 0];
  const fade: number[] = [0];
  const shade: number[] = [1];

  for (let ring = 1; ring <= RINGS; ring++) {
    const t = ring / RINGS;
    for (let segment = 0; segment < SEGMENTS; segment++) {
      const azimuth = (segment / SEGMENTS) * Math.PI * 2 - Math.PI;
      const polar = t * hairlineAt(azimuth);
      // The last ring slips just under the skin, closing the edge
      const radius =
        ring === RINGS
          ? HEAD_RADIUS - 0.006
          : HEAD_RADIUS + hairLift(azimuth, t);

      positions.push(
        Math.sin(polar) * Math.sin(azimuth) * radius,
        Math.cos(polar) * radius,
        Math.sin(polar) * Math.cos(azimuth) * radius,
      );

      // Faded taper over the sides and nape; the fringe keeps its edge
      fade.push(
        0.34 *
          smoothstep(0.88, 1, t) *
          smoothstep(0.95, 1.6, Math.abs(azimuth)),
      );
      shade.push(
        1 -
          0.4 *
            gaussian(azimuth, PART_AZIMUTH, 0.16) *
            smoothstep(0, 0.3, t) *
            smoothstep(1, 0.8, t),
      );
    }
  }

  const index: number[] = [];
  const at = (ring: number, segment: number) =>
    1 + (ring - 1) * SEGMENTS + (segment % SEGMENTS);

  for (let segment = 0; segment < SEGMENTS; segment++) {
    index.push(0, at(1, segment), at(1, segment + 1));
  }
  for (let ring = 2; ring <= RINGS; ring++) {
    for (let segment = 0; segment < SEGMENTS; segment++) {
      const a = at(ring - 1, segment);
      const b = at(ring, segment);
      const c = at(ring, segment + 1);
      const d = at(ring - 1, segment + 1);
      index.push(a, b, d, b, c, d);
    }
  }

  return {
    positions: new Float32Array(positions),
    index: new Uint32Array(index),
    fade: new Float32Array(fade),
    shade: new Float32Array(shade),
  };
}
