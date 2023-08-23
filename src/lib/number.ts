export const formatNumber = (number: number): string => {
  return String(Math.abs(number))
    .split('')
    .reverse()
    .reduce((acc, v, index) => {
      if ((index + 1) % 4 === 0) {
        return `${v},${acc}`;
      }

      return `${v}${acc}`;
    });
};
