export const calculateProjectilePath = (
  initialVelocity: number,
  angleDegree: number,
  g: number,
  totalTime: number,
) => {
  const intervals = totalTime / (totalTime / 32); // Ensure we have at least 32 points
  const radian = (angleDegree * Math.PI) / 180; // Convert angle to radians
  const v0x = initialVelocity * Math.cos(radian);
  const v0y = initialVelocity * Math.sin(radian);
  const dt = totalTime / intervals;
  const path = [];

  for (let t = 0; t <= totalTime; t += dt) {
    const x = v0x * t;
    const y = v0y * t - 0.5 * g * t ** 2;
    if (y < 0) break; // Stop if projectile has "landed"
    path.push({ x, y });
  }

  // Add the final point
  path.push({ x: v0x * totalTime, y: 0 });

  return path;
};
