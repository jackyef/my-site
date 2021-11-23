export const getPlatformMetaKey = () => {
  if (typeof window !== 'undefined') {
    const platformString = (
      navigator.platform ||
      // @ts-expect-error
      navigator.userAgentData.platform ||
      ''
    ).toLowerCase();

    const isMac = platformString.indexOf('mac') >= 0;

    const metaKey = isMac ? 'Cmd' : 'Ctrl';

    return metaKey;
  }

  return 'Ctrl';
};
