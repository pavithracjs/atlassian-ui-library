import Url from 'url-parse';

export const getCurrentUrlWithHash = (hash: string = ''): string => {
  let url = new Url(window.location.href);
  url.set('hash', encodeURIComponent(hash));
  return url.href;
};
