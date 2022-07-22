import Prism from 'prismjs';

import { prismTokenMap } from '@/lib/prismTokenMap';

const BASE_DISTANCE = 20;

type Params = {
  lightAngle: number;
  elevation: number;
  baseShadowColors: {
    red: number;
    green: number;
    blue: number;
  };
};

export const useClayCss = ({
  lightAngle,
  elevation,
  baseShadowColors,
}: Params) => {
  const baseX = Math.cos(lightAngle) * BASE_DISTANCE;
  const baseY = Math.sin(lightAngle) * BASE_DISTANCE;
  const baseBlurSpread = (Math.abs(baseX) + Math.abs(baseY)) / 2;

  const innerY1 = `${(elevation * baseY).toFixed(2)}px`;
  const innerX1 = `${(elevation * baseX).toFixed(2)}px`;
  const innerY2 = `${(elevation * baseY * -1.5).toFixed(2)}px`;
  const innerX2 = `${(elevation * baseX * -1.5).toFixed(2)}px`;
  const innerBlur = `${(elevation * baseBlurSpread * 2).toFixed(2)}px`;
  const innerSpread = `${(elevation * baseBlurSpread * -0.25).toFixed(2)}px`;
  const outerX = `${(elevation * baseX * 3).toFixed(2)}px`;
  const outerY = `${(elevation * baseY * 3).toFixed(2)}px`;
  const outerBlur = `${(elevation * baseBlurSpread * 3 * 0.5).toFixed(2)}px`;
  const outerSpread = `${(elevation * baseBlurSpread * 3 * -0.25).toFixed(
    2,
  )}px`;

  const baseShadowColor = `${baseShadowColors.red}, ${baseShadowColors.green}, ${baseShadowColors.blue}`;
  const innerShadowLight = `rgba(${baseShadowColor}, 0.15)`;
  const innerShadowDark = `rgba(${baseShadowColor}, 0.3)`;
  const outerShadow = `rgba(${baseShadowColor}, 0.6)`;

  const boxShadowCss = `box-shadow: inset ${innerX1} ${innerY1} ${innerBlur} ${innerSpread} ${innerShadowLight},
  inset ${innerX2} ${innerY2} ${innerBlur} ${innerSpread} ${innerShadowDark},
  ${outerX} ${outerY} ${outerBlur} ${outerSpread} ${outerShadow};
  `;

  const code = Prism.highlight(boxShadowCss, Prism.languages.css, 'css');
  let highlightedCode = code;

  Object.keys(prismTokenMap).forEach((token) => {
    const className =
      prismTokenMap[token as keyof typeof prismTokenMap] || token;

    highlightedCode = highlightedCode.replace(
      new RegExp(`${token}`, 'g'),
      className,
    );
  });

  return {
    boxShadowCss,
    highlightedCode,
  };
};
