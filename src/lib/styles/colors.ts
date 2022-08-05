import { colors, HSLColor } from './tokens';

type HueToken = `var(--h-${string})`;
type SaturationToken = `var(--s-${string})`;
type LightnessToken = `var(--l-${string})`;

type Degree = `${string}deg`;
type Percentage = `${string}%`;

type AdjustedHue = `calc(${HueToken} ${Degree})`;
type AdjustedSaturation = `calc(${SaturationToken} ${Percentage})`;
type AdjustedLightness = `calc(${LightnessToken} ${Percentage})`;

export type HSLObject = {
  h: HueToken | AdjustedHue;
  s: SaturationToken | AdjustedSaturation;
  l: LightnessToken | AdjustedLightness;
};

type Adjustments = {
  h?: number;
  s?: number;
  l?: number;
};

export const rotateHue = (hue: HueToken, amount: number) => {
  if (amount < 0) {
    return `calc(${hue} - ${Math.abs(amount)}deg)` as const;
  }

  return `calc(${hue} + ${amount}deg)` as const;
};

const adjustPercentageBasedValues = <
  T extends SaturationToken | LightnessToken,
>(
  value: T,
  amount: number,
) => {
  if (amount < 0) {
    return `calc(${value} - ${Math.abs(amount)}%)` as const;
  }

  return `calc(${value} + ${amount}%)` as const;
};

export const adjustSaturation = (
  saturation: SaturationToken,
  amount: number,
) => {
  return adjustPercentageBasedValues(saturation, amount);
};

export const adjustLightness = (lightness: LightnessToken, amount: number) => {
  return adjustPercentageBasedValues(lightness, amount);
};

export const constructHslString = ({ h, s, l }: HSLObject) => {
  return `${h} ${s} ${l}`;
};

export const constructHslaColor = ({ h, s, l }: HSLObject, alpha = 1) => {
  return `hsla(${h} ${s} ${l} / ${alpha})`;
};

export const getHslString = (variant: HSLColor) => {
  return constructHslString(colors[variant]);
};

export const getHslaColor = (
  variant: HSLColor,
  alpha = 1,
  adjustments?: Adjustments,
) => {
  const base = colors[variant];
  if (!adjustments) return constructHslaColor(colors[variant], alpha);

  const h = adjustments.h ? rotateHue(base.h, adjustments.h) : base.h;
  const s = adjustments.s ? adjustSaturation(base.s, adjustments.s) : base.s;
  const l = adjustments.l ? adjustLightness(base.l, adjustments.l) : base.l;

  return constructHslaColor({ h, s, l }, alpha);
};
