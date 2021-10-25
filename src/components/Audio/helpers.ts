export const secondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60) || 0;
  const secondsLeft = seconds % 60 || 0;

  return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
};
