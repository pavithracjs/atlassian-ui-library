export const getCurrentUrlWithoutHash = (): string => {
  const { location } = document;
  if (location) {
    return `${location.protocol}//${location.host}${location.pathname}${
      location.search
    }`;
  }
  return '';
};
