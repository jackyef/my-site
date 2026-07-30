import { Vector3 } from 'three';

/**
 * The wandering avatar's live world position, written by the Avatar each
 * frame. The camera rig and the About panel read it so they can frame him
 * wherever he happens to be standing when you click.
 */
export const avatarPosition = new Vector3(1.2, 0, 1.9);

/** Where he stands when motion is reduced (he doesn't wander then). */
export const AVATAR_REST_SPOT = new Vector3(1.2, 0, 1.9);

const scratchDir = new Vector3();
const scratchRight = new Vector3();

/**
 * Horizontal unit vector from the avatar toward a point, plus the
 * camera-right vector that goes with it.
 */
function approachBasis(from: Vector3) {
  scratchDir.set(from.x - avatarPosition.x, 0, from.z - avatarPosition.z);
  if (scratchDir.lengthSq() < 1e-4) scratchDir.set(0, 0, 1);
  scratchDir.normalize();
  // Rotating the approach direction -90° about Y gives the camera's right
  scratchRight.set(scratchDir.z, 0, -scratchDir.x);
  return { dir: scratchDir, right: scratchRight };
}

/**
 * A view of the avatar from whichever side the camera is already on, so
 * clicking him flies in without making him walk somewhere first. On
 * desktop the target is nudged to the camera's right, which puts him
 * left of frame and leaves room for the panel.
 */
export function aboutCameraView(cameraPosition: Vector3, desktop: boolean) {
  const { dir, right } = approachBasis(cameraPosition);
  // Portrait has to fit the whole standing figure into the band above
  // the bottom sheet, so it sits further back and aims lower
  const distance = desktop ? 4.6 : 6.2;
  const lateral = desktop ? 0.7 : 0;

  const position = new Vector3(avatarPosition.x, 0, avatarPosition.z)
    .addScaledVector(dir, distance)
    .setY(desktop ? 1.75 : 1.5);
  // Mobile aims low so he sits above the bottom sheet
  const target = new Vector3(avatarPosition.x, 0, avatarPosition.z)
    .addScaledVector(right, lateral)
    .setY(desktop ? 1.1 : 0.05);

  return { position, target };
}

/**
 * Anchor for the About panel: at his shoulder, on the camera's right. The
 * card is then spaced off it in pixels, so this only has to clear his
 * silhouette rather than leave room for the card itself.
 */
export function aboutPanelAnchor(cameraPosition: Vector3) {
  const { right } = approachBasis(cameraPosition);
  return new Vector3(avatarPosition.x, 0, avatarPosition.z)
    .addScaledVector(right, 0.75)
    .setY(1.2);
}
